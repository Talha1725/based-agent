import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AllTokens = () => {
  const tokens = [
    {
      name: "Polygon Ecosystem Token",
      symbol: "POL",
      amount: "16M",
      price: "$0.37",
      value: "$6,151,073.10",
      change: "-1.22%",
    },
    {
      name: "Matic Token",
      symbol: "MATIC",
      amount: "8M",
      price: "$0.37",
      value: "$3,129,890.19",
      change: "-1.29%",
    },
    // Add more tokens as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50  p-8">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 ">
            All Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700">Token</TableHead>
                <TableHead className="text-gray-700">Amount</TableHead>
                <TableHead className="text-gray-700">Price</TableHead>
                <TableHead className="text-gray-700">Value</TableHead>
                <TableHead className="text-gray-700">24h Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-gray-900 ">
                    {token.name} ({token.symbol})
                  </TableCell>
                  <TableCell className="text-gray-700">{token.price}</TableCell>
                  <TableCell className="text-gray-700">{token.value}</TableCell>
                  <TableCell className="text-gray-700">
                    {token.amount}
                  </TableCell>
                  <TableCell
                    className={
                      token.change.startsWith("-")
                        ? "text-red-500 "
                        : "text-green-500"
                    }
                  >
                    {token.change}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllTokens;
