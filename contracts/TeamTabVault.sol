// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TeamTabVault
 * @notice Programmable Team Spending Vault with Scoped Session Keys for Hackathon & Club Teams.
 * @dev ROAD TO DEVCON - IIITN EDITION
 * 
 * Account Abstraction & Session Key Architecture:
 * - Team Lead funds the vault once.
 * - Scoped Session Keys are issued to teammates with strict limits:
 *     1. Category constraint (e.g. "API Credits", "Hardware", "Food")
 *     2. Budget ceiling (maximum lifetime allowance)
 *     3. Single transaction limit (anti-drain safety)
 *     4. Expiration timestamp (auto-expires when hackathon concludes)
 * - Gas Sponsorship Ready: Supports direct execution or EIP-712 meta-transactions / UserOps
 *   so teammates do not need testnet gas in their personal wallets.
 * - Auto-sweeping and full on-chain tagged spending audit trail with receipt hashes.
 */
contract TeamTabVault {
    // --- Structs ---

    struct ScopedKey {
        address member;
        string memberName;
        string category;
        uint256 ceiling;
        uint256 spent;
        uint256 singleTxLimit;
        uint256 expiry;
        bool active;
    }

    struct TaggedSpend {
        uint256 id;
        address member;
        string memberName;
        address recipient;
        uint256 amount;
        string category;
        string purpose;
        string receiptHash; // IPFS CID or metadata hash
        uint256 timestamp;
    }

    // --- State Variables ---

    address public teamLead;
    string public teamName;
    string public hackathonEvent;
    uint256 public eventEndTime;
    uint256 public totalDeposited;
    uint256 public totalSpent;
    uint256 public spendCount;

    // Member address => ScopedKey
    mapping(address => ScopedKey) public scopedKeys;
    address[] public memberList;

    // Audit trail
    TaggedSpend[] public spendHistory;

    // EIP-712 Typed Data Domain for Gasless Meta-Transactions / Session Ops
    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant SPEND_TYPEHASH = keccak256(
        "SpendAuthorization(address member,address recipient,uint256 amount,string category,string purpose,string receiptHash,uint256 nonce,uint256 deadline)"
    );
    mapping(address => uint256) public nonces;

    // --- Events ---

    event TabFunded(address indexed funder, uint256 amount, uint256 newBalance);
    event ScopedKeyIssued(
        address indexed member,
        string memberName,
        string category,
        uint256 ceiling,
        uint256 singleTxLimit,
        uint256 expiry
    );
    event ScopedKeyRevoked(address indexed member, uint256 unspentAllowance);
    event TaggedSpendExecuted(
        uint256 indexed spendId,
        address indexed member,
        string memberName,
        address indexed recipient,
        uint256 amount,
        string category,
        string purpose,
        string receiptHash,
        uint256 remainingCeiling
    );
    event FundsSwept(address indexed lead, uint256 amount, string reason);

    // --- Custom Errors ---

    error OnlyTeamLeadAllowed();
    error KeyNotFoundOrInactive();
    error EventAlreadyEnded();
    error KeyExpired();
    error CategoryMismatch(string requested, string authorized);
    error ExceedsSingleTxLimit(uint256 requested, uint256 limit);
    error ExceedsBudgetCeiling(uint256 requested, uint256 remaining);
    error InsufficientVaultBalance(uint256 requested, uint256 available);
    error TransferFailed();
    error InvalidSignature();
    error SignatureExpired();
    error InvalidRecipient();

    // --- Modifiers ---

    modifier onlyLead() {
        if (msg.sender != teamLead) revert OnlyTeamLeadAllowed();
        _;
    }

    // --- Constructor ---

    constructor(
        address _teamLead,
        string memory _teamName,
        string memory _hackathonEvent,
        uint256 _eventEndTime
    ) payable {
        require(_teamLead != address(0), "Invalid lead");
        require(_eventEndTime > block.timestamp, "End time must be in future");

        teamLead = _teamLead;
        teamName = _teamName;
        hackathonEvent = _hackathonEvent;
        eventEndTime = _eventEndTime;

        if (msg.value > 0) {
            totalDeposited += msg.value;
            emit TabFunded(msg.sender, msg.value, address(this).balance);
        }

        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("TeamTabVault")),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }

    // --- Tab Funding ---

    receive() external payable {
        totalDeposited += msg.value;
        emit TabFunded(msg.sender, msg.value, address(this).balance);
    }

    function fundTab() external payable {
        require(msg.value > 0, "Deposit must be > 0");
        totalDeposited += msg.value;
        emit TabFunded(msg.sender, msg.value, address(this).balance);
    }

    // --- Session Key Management (Lead Only) ---

    function issueScopedKey(
        address _member,
        string calldata _memberName,
        string calldata _category,
        uint256 _ceiling,
        uint256 _singleTxLimit,
        uint256 _expiry
    ) external onlyLead {
        require(_member != address(0), "Invalid member address");
        require(_ceiling > 0, "Ceiling must be > 0");
        require(_singleTxLimit <= _ceiling, "Single tx limit > ceiling");

        uint256 effectiveExpiry = _expiry == 0 || _expiry > eventEndTime ? eventEndTime : _expiry;

        if (!scopedKeys[_member].active && scopedKeys[_member].ceiling == 0) {
            memberList.push(_member);
        }

        scopedKeys[_member] = ScopedKey({
            member: _member,
            memberName: _memberName,
            category: _category,
            ceiling: _ceiling,
            spent: scopedKeys[_member].spent, // preserve spent amount if updating
            singleTxLimit: _singleTxLimit == 0 ? _ceiling : _singleTxLimit,
            expiry: effectiveExpiry,
            active: true
        });

        emit ScopedKeyIssued(
            _member,
            _memberName,
            _category,
            _ceiling,
            _singleTxLimit == 0 ? _ceiling : _singleTxLimit,
            effectiveExpiry
        );
    }

    function revokeScopedKey(address _member) external onlyLead {
        ScopedKey storage key = scopedKeys[_member];
        if (!key.active) revert KeyNotFoundOrInactive();
        
        key.active = false;
        uint256 unspent = key.ceiling > key.spent ? key.ceiling - key.spent : 0;
        emit ScopedKeyRevoked(_member, unspent);
    }

    // --- Scoped Spending Execution ---

    /**
     * @notice Direct execution by authorized team member using their session key / EOA.
     */
    function executeScopedSpend(
        address payable _recipient,
        uint256 _amount,
        string calldata _category,
        string calldata _purpose,
        string calldata _receiptHash
    ) external returns (uint256 spendId) {
        return _processSpend(msg.sender, _recipient, _amount, _category, _purpose, _receiptHash);
    }

    /**
     * @notice Gas-sponsored execution via Bundler / Paymaster / Relayer.
     * @dev Teammate signs EIP-712 permit; Paymaster or Relayer pays the gas.
     */
    function executeScopedSpendWithSignature(
        address _member,
        address payable _recipient,
        uint256 _amount,
        string calldata _category,
        string calldata _purpose,
        string calldata _receiptHash,
        uint256 _deadline,
        bytes calldata _signature
    ) external returns (uint256 spendId) {
        if (block.timestamp > _deadline) revert SignatureExpired();

        bytes32 structHash = keccak256(
            abi.encode(
                SPEND_TYPEHASH,
                _member,
                _recipient,
                _amount,
                keccak256(bytes(_category)),
                keccak256(bytes(_purpose)),
                keccak256(bytes(_receiptHash)),
                nonces[_member]++,
                _deadline
            )
        );

        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
        );

        address recovered = _recoverSigner(digest, _signature);
        if (recovered != _member) revert InvalidSignature();

        return _processSpend(_member, _recipient, _amount, _category, _purpose, _receiptHash);
    }

    // --- Internal Spend Verification & Execution ---

    function _processSpend(
        address _member,
        address payable _recipient,
        uint256 _amount,
        string calldata _category,
        string calldata _purpose,
        string calldata _receiptHash
    ) internal returns (uint256 spendId) {
        if (_recipient == address(0)) revert InvalidRecipient();
        if (block.timestamp > eventEndTime) revert EventAlreadyEnded();

        ScopedKey storage key = scopedKeys[_member];
        if (!key.active) revert KeyNotFoundOrInactive();
        if (block.timestamp > key.expiry) revert KeyExpired();

        // Check category restriction (allow "All" or exact match)
        if (
            keccak256(bytes(key.category)) != keccak256(bytes("All")) &&
            keccak256(bytes(key.category)) != keccak256(bytes(_category))
        ) {
            revert CategoryMismatch(_category, key.category);
        }

        // Check single transaction limit
        if (_amount > key.singleTxLimit) {
            revert ExceedsSingleTxLimit(_amount, key.singleTxLimit);
        }

        // Check total budget ceiling
        if (key.spent + _amount > key.ceiling) {
            revert ExceedsBudgetCeiling(_amount, key.ceiling - key.spent);
        }

        // Check vault funds
        if (address(this).balance < _amount) {
            revert InsufficientVaultBalance(_amount, address(this).balance);
        }

        // Update state
        key.spent += _amount;
        totalSpent += _amount;
        spendId = ++spendCount;

        TaggedSpend memory newSpend = TaggedSpend({
            id: spendId,
            member: _member,
            memberName: key.memberName,
            recipient: _recipient,
            amount: _amount,
            category: _category,
            purpose: _purpose,
            receiptHash: _receiptHash,
            timestamp: block.timestamp
        });

        spendHistory.push(newSpend);

        // Execute value transfer
        (bool success, ) = _recipient.call{value: _amount}("");
        if (!success) revert TransferFailed();

        emit TaggedSpendExecuted(
            spendId,
            _member,
            key.memberName,
            _recipient,
            _amount,
            _category,
            _purpose,
            _receiptHash,
            key.ceiling - key.spent
        );
    }

    // --- Sweeping Unspent Pot (Lead Only) ---

    function sweepRemainingFunds(address payable _to, string calldata _reason) external onlyLead {
        require(_to != address(0), "Invalid sweep recipient");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to sweep");

        (bool success, ) = _to.call{value: balance}("");
        if (!success) revert TransferFailed();

        emit FundsSwept(_to, balance, _reason);
    }

    // --- View Functions ---

    function getVaultSummary()
        external
        view
        returns (
            address lead,
            string memory name,
            string memory eventName,
            uint256 endTime,
            uint256 currentBalance,
            uint256 totalDep,
            uint256 totalSp,
            uint256 activeMembersCount,
            uint256 totalTransactions
        )
    {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < memberList.length; i++) {
            if (scopedKeys[memberList[i]].active) {
                activeCount++;
            }
        }

        return (
            teamLead,
            teamName,
            hackathonEvent,
            eventEndTime,
            address(this).balance,
            totalDeposited,
            totalSpent,
            activeCount,
            spendCount
        );
    }

    function getAllMembers() external view returns (ScopedKey[] memory) {
        ScopedKey[] memory members = new ScopedKey[](memberList.length);
        for (uint256 i = 0; i < memberList.length; i++) {
            members[i] = scopedKeys[memberList[i]];
        }
        return members;
    }

    function getSpendHistory() external view returns (TaggedSpend[] memory) {
        return spendHistory;
    }

    // --- Internal Helpers ---

    function _recoverSigner(bytes32 _digest, bytes memory _sig) internal pure returns (address) {
        require(_sig.length == 65, "Invalid sig length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            v := byte(0, mload(add(_sig, 96)))
        }
        if (v < 27) v += 27;
        return ecrecover(_digest, v, r, s);
    }
}
