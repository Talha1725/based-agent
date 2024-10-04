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
import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

const AllTransactions = () => {
  const transactions = [
    {
      type: "Received",
      amount: "+1,000 MATIC",
      date: "2023-05-01 14:30",
      status: "Completed",
      hash: "0x1234...5678",
    },
    {
      type: "Sent",
      amount: "-500 POL",
      date: "2023-04-30 09:15",
      status: "Completed",
      hash: "0xabcd...efgh",
    },
    {
      type: "Received",
      amount: "+2,000 ETH",
      date: "2023-04-29 11:45",
      status: "Completed",
      hash: "0x9876...5432",
    },
    {
      type: "Sent",
      amount: "-100 USDC",
      date: "2023-04-28 16:20",
      status: "Completed",
      hash: "0xijkl...mnop",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 ">
            All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700">Type</TableHead>
                <TableHead className="text-gray-700">Amount</TableHead>
                <TableHead className="text-gray-700">Date</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">
                  Transaction Hash
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center">
                    {transaction.type === "Received" ? (
                      <ArrowUp className="text-green-500 mr-2" />
                    ) : (
                      <ArrowDown className="text-red-500 mr-2" />
                    )}
                    <span className="text-gray-900 ">{transaction.type}</span>
                  </TableCell>{" "}
                  <TableCell className="text-gray-900">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {transaction.date}
                  </TableCell>
                  <TableCell className="text-green-500 ">
                    {transaction.status}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://etherscan.io/tx/${transaction.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blackCustom hover:text-brownCustom flex items-center"
                    >
                      {transaction.hash}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
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

export default AllTransactions;
