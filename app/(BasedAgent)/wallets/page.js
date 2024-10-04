"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Wallet, AlertTriangle, Plus } from "lucide-react";

const WalletsPage = () => {
  const [connectedWallets, setConnectedWallets] = useState([
    { chain: "Ethereum", address: "0x1234...5678" },
    { chain: "Solana", address: "ABC123...XYZ" },
  ]);

  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [newWalletChain, setNewWalletChain] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");

  const handleDisconnect = (chainToRemove) => {
    setConnectedWallets(
      connectedWallets.filter((wallet) => wallet.chain !== chainToRemove)
    );
  };

  const handleConnect = () => {
    if (newWalletChain && newWalletAddress) {
      if (!connectedWallets.some((wallet) => wallet.chain === newWalletChain)) {
        setConnectedWallets([
          ...connectedWallets,
          { chain: newWalletChain, address: newWalletAddress },
        ]);
        setIsConnectDialogOpen(false);
        setNewWalletChain("");
        setNewWalletAddress("");
      } else {
        alert("You can only connect one wallet per chain.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white  text-gray-800 ">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Connected Wallets</h1>

        <Alert className="mb-8 bg-blackCustom rounded-none border-2 border-black  ">
          <AlertTriangle className="h-4 w-4" stroke="white" />
          <AlertTitle className="text-white font-black ">Disclaimer</AlertTitle>
          <AlertDescription className="text-white text-sm">
            The wallet addresses you connect will be associated with your public
            profile and may be visible to others. These wallets will also be
            used for notifications, if enabled, to inform you about information
            related to the tokens you hold.
          </AlertDescription>
        </Alert>

        <Card className="bg-white  mb-8 border-2 rounded-none border-blackCustom ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800 ">
              Your Wallets
            </CardTitle>
            <Dialog
              open={isConnectDialogOpen}
              onOpenChange={setIsConnectDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blackCustom border-2 border-blackCustom hover:bg-brownCustom rounded-none text-white">
                  <Plus className="mr-2 h-4 w-4" /> Connect New Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white  text-gray-800 ">
                <DialogHeader>
                  <DialogTitle>Connect a New Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Select onValueChange={setNewWalletChain}>
                    <SelectTrigger className="bg-white text-gray-800  border-gray-300">
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent className="bg-white  text-gray-800 ">
                      <SelectItem value="Ethereum">Ethereum</SelectItem>
                      <SelectItem value="Solana">Solana</SelectItem>
                      <SelectItem value="Polygon">Polygon</SelectItem>
                      <SelectItem value="Binance Smart Chain">
                        Binance Smart Chain
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Enter wallet address"
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    className="bg-white  text-gray-800  border-gray-300 "
                  />
                  <Button
                    onClick={handleConnect}
                    className="w-full bg-blackCustom hover:bg-brownCustom text-white rounded-none border-2 border-blackCustom"
                  >
                    Connect Wallet
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600  font-bold">
                    Blockchain
                  </TableHead>
                  <TableHead className="text-gray-600  font-bold">
                    Wallet Address
                  </TableHead>
                  <TableHead className="text-gray-600  font-bold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectedWallets.map((wallet, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-gray-800 ">
                      {wallet.chain}
                    </TableCell>
                    <TableCell className="text-gray-800 ">
                      {wallet.address}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDisconnect(wallet.chain)}
                        className="bg-blackCustom hover:bg-brownCustom rounded-none border-2 border-blackCustom text-white"
                      >
                        Disconnect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletsPage;
