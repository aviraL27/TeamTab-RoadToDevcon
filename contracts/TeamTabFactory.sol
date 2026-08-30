// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TeamTabVault.sol";

/**
 * @title TeamTabFactory
 * @notice Factory contract to instantiate and track TeamTabVaults for Hackathons and Clubs.
 * @dev ROAD TO DEVCON - IIITN EDITION
 */
contract TeamTabFactory {
    struct VaultRecord {
        address vaultAddress;
        address lead;
        string teamName;
        string eventName;
        uint256 createdAt;
        uint256 eventEndTime;
    }

    VaultRecord[] public allVaults;
    mapping(address => address[]) public leadToVaults;
    mapping(address => address[]) public memberToVaults;

    event VaultCreated(
        address indexed vaultAddress,
        address indexed lead,
        string teamName,
        string eventName,
        uint256 eventEndTime,
        uint256 initialDeposit
    );

    function createTeamTab(
        string calldata _teamName,
        string calldata _eventName,
        uint256 _eventEndTime
    ) external payable returns (address vaultAddress) {
        TeamTabVault newVault = (new TeamTabVault){value: msg.value}(
            msg.sender,
            _teamName,
            _eventName,
            _eventEndTime
        );

        vaultAddress = address(newVault);

        VaultRecord memory record = VaultRecord({
            vaultAddress: vaultAddress,
            lead: msg.sender,
            teamName: _teamName,
            eventName: _eventName,
            createdAt: block.timestamp,
            eventEndTime: _eventEndTime
        });

        allVaults.push(record);
        leadToVaults[msg.sender].push(vaultAddress);

        emit VaultCreated(
            vaultAddress,
            msg.sender,
            _teamName,
            _eventName,
            _eventEndTime,
            msg.value
        );
    }

    function getAllVaults() external view returns (VaultRecord[] memory) {
        return allVaults;
    }

    function getLeadVaults(address _lead) external view returns (address[] memory) {
        return leadToVaults[_lead];
    }
}
