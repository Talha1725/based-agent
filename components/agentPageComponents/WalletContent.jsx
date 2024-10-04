"use client"
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDown, ArrowUp, Copy, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import Link from 'next/link';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";

const WalletContent = () => {
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [activeWallet, setActiveWallet] = useState("agent");
  const agentWalletAddress = "0x1234567890123456789012345678901234567890";

  const handleDeposit = () => setIsDepositDialogOpen(true);
  const handleWithdraw = () => setIsWithdrawDialogOpen(true);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Address copied to clipboard!");
    });
  };

  const WalletHeader = ({ isContributorPool = false }) => (
    <Card className="bg-white/50  backdrop-blur-sm rounded-none border-2 border-black">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-4 sm:mb-0">
            <p className="text-2xl sm:text-4xl font-bold text-gray-800 ">$9,280,963.29</p>
            <p className="text-sm text-red-500 mt-2">
              <span className="bg-red-500/20 px-1 py-0.5 rounded">24h</span> -$117,051.80
            </p>
          </div>
          <div className="space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Button className="bg-black hover:bg-brownCustom rounded-none border-2 border-black text-white w-full sm:w-auto" onClick={handleDeposit}>Deposit</Button>
            <Button className="bg-black hover:bg-brownCustom rounded-none border-2 border-black text-white w-full sm:w-auto" onClick={handleWithdraw}>Withdraw</Button>
          </div>
        </div>
        <div className="mt-4 text-right">
          <a href="https://multisig.example.com" target="_blank" rel="noopener noreferrer" className="text-black text-sm hover:underline">
            View Multisig
          </a>
        </div>
        {isContributorPool && (
          <div className="mt-4 space-y-2">
            <p className="text-gray-600 ">Total amount vested: $5,000,000</p>
            <p className="text-gray-600 ">Total amount remaining to vest: $4,280,963.29</p>
            <p className="text-gray-600 ">Days remaining to vest: 730</p>
            <Progress value={54} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const TokensCard = () => (
    <Card className="bg-white/50  backdrop-blur-sm mt-8 rounded-none border-2 border-black">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold text-gray-800  mb-4">Tokens</h3>
        <div className="space-y-4">
          {[
            { name: "Polygon Ecosystem Token", symbol: "POL", amount: "16M", price: "$0.37", value: "$6,110,730.30", change: "-$60,656.99", percentage: "-0.98%" },
            { name: "Matic Token", symbol: "MATIC", amount: "8M", price: "$0.36", value: "$3,086,709.68", change: "-$56,993.40", percentage: "-1.81%" },
          ].map((token, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200  rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-800 ">{token.name}</p>
                  <p className="text-sm text-gray-600 ">{token.amount} {token.symbol} • {token.price}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800 ">{token.value}</p>
                <p className="text-sm text-red-500">{token.change} <span className="bg-red-500/20 px-1 py-0.5 rounded">{token.percentage}</span></p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/all-tokens">
          <Button variant="outline" className="w-full mt-4  text-white bg-blackCustom hover:bg-brownCustom rounded-none border-2 border-black ">
            See all tokens <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const TransactionHistoryCard = () => (
    <Card className="bg-white/50  backdrop-blur-sm mt-8 rounded-none border-2 border-black">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold text-gray-800  mb-4">Transaction History</h3>
        <div className="space-y-4">
          {[
            { type: "Received", amount: "+1,000 MATIC", date: "2023-05-01 14:30", status: "Completed" },
            { type: "Sent", amount: "-500 POL", date: "2023-04-30 09:15", status: "Completed" },
          ].map((transaction, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                {transaction.type === "Received" ? <ArrowUp className="text-green-500 mr-2" /> : <ArrowDown className="text-red-500 mr-2" />}
                <div>
                  <p className="text-gray-800 ">{transaction.type}</p>
                  <p className="text-sm text-gray-600 ">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-800 ">{transaction.amount}</p>
                <p className="text-sm text-green-500">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/all-transactions">
          <Button variant="outline" className="w-full bg-blackCustom hover:bg-brownCustom text-white rounded-none border-2 border-blackCustom">
            View all transactions <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const DepositWithdrawDialog = ({ isOpen, onOpenChange, type }) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white  text-gray-800 ">
        <DialogHeader>
          <DialogTitle>{type} to {activeWallet === "agent" ? "Agent" : "Contributor Pool"} Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {type === "Deposit" ? (
            <>
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <div className="flex items-center space-x-2">
                <Input id="wallet-address" value={agentWalletAddress} readOnly className="bg-gray-100  text-gray-800 " />
                <Button size="icon" variant="outline" onClick={() => copyToClipboard(agentWalletAddress)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 ">Send assets to this address to deposit them into the wallet.</p>
            </>
          ) : (
            <>
              <Label htmlFor="withdraw-amount">Amount</Label>
              <Input id="withdraw-amount" type="number" placeholder="Enter amount" className="bg-gray-100  text-gray-800 " />
              <Label htmlFor="withdraw-address">Recipient Address</Label>
              <Input id="withdraw-address" placeholder="Enter recipient address" className="bg-gray-100  text-gray-800 " />
              <Button className="w-full bg-black hover:bg-brownCustom rounded-none border-2 border-black text-white">Initiate Withdrawal</Button>
              <p className="text-sm text-gray-600 ">Note: Withdrawals may require approval from multiple signers.</p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-8">
      <ToggleGroup type="single" value={activeWallet} onValueChange={setActiveWallet} className="justify-center">
        <ToggleGroupItem value="agent" aria-label="AI Agent Wallet" className="data-[state=on]:bg-blackCustom data-[state=on]:text-white hover:bg-brownCustom rounded-none border-2 border-black text-gray-800 ">
          <Wallet className="h-4 w-4 mr-2" />
          AI Agent Wallet
        </ToggleGroupItem>
        <ToggleGroupItem value="contributor" aria-label="Contributor Pool Wallet" className="data-[state=on]:bg-blackCustom data-[state=on]:text-white rounded-none border-2 border-black hover:bg-brownCUstom text-gray-800 ">
          <Wallet className="h-4 w-4 mr-2" />
          Contributor Pool Wallet
        </ToggleGroupItem>
      </ToggleGroup>

      <WalletHeader isContributorPool={activeWallet === "contributor"} />
      <TokensCard />
      <TransactionHistoryCard />

      <DepositWithdrawDialog isOpen={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen} type="Deposit" />
      <DepositWithdrawDialog isOpen={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen} type="Withdraw" />
    </div>
  );
};

export default WalletContent;