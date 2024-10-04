import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TokenHolderDistribution = () => {
  const holders = [
    { wallet: '0x1234...5678', tokensHeld: 1000000, percentageOfSupply: '10%' },
    { wallet: '0xabcd...efgh', tokensHeld: 500000, percentageOfSupply: '5%' },
    { wallet: '0x9876...5432', tokensHeld: 250000, percentageOfSupply: '2.5%' },
  ];

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100">Token Holder Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Wallet</TableHead>
              <TableHead className="text-gray-300">Tokens Held</TableHead>
              <TableHead className="text-gray-300">% of Supply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holders.map((holder, index) => (
              <TableRow key={index}>
                <TableCell className="text-gray-300">{holder.wallet}</TableCell>
                <TableCell className="text-gray-300">{holder.tokensHeld.toLocaleString()}</TableCell>
                <TableCell className="text-gray-300">{holder.percentageOfSupply}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};