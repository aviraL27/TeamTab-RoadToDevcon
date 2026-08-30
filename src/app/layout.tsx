import type { Metadata } from "next";
import "./globals.css";
import { TeamTabProvider } from "@/lib/store";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "TeamTab | Programmable Scoped Spending for Hackathon Teams",
  description: "One pot, zero shared cards, zero reimbursement chases. ERC-4337 Account Abstraction session keys for hackathon and club team spending.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-eth-dark text-gray-100 min-h-screen selection:bg-emerald-500 selection:text-gray-950">
        <TeamTabProvider>
          {children}
          <ToastContainer />
        </TeamTabProvider>
      </body>
    </html>
  );
}
