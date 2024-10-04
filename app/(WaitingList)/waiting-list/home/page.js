"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";

const fetchWaitlistData = async () => {
  const response = await fetch("/api/waiting-list");
  let { waiting_list_users } = await response.json();

  return waiting_list_users;
};

const WaitlistLeaderboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: waitlistData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["waitlistData"],
    queryFn: fetchWaitlistData,
  });

  const Error = ({ message }) => (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold text-red-600">{message}</p>
    </div>
  );

  if (isLoading) return <Loader message="Loading waitlist data" />;
  if (error) {
    console.log(error);
    return <Error message="Error fetching waitlist data" />;
  }

  const filteredData = waitlistData.filter((member) =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100  text-gray-800 ">
      <main className="container mx-auto px-4 py-16">
        <Card className="bg-white  text-gray-800  mb-8 rounded-none border-2 border-black">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 ">
              Waitlist Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Filter by username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-2 border-black rounded-none text-gray-800 flex-grow"
              />
            </div>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left text-gray-600 font-bold py-5 border-b border-silverCustom">
                    Rank
                  </TableHead>
                  <TableHead className="text-left text-gray-600  font-bold py-5 border-b border-silverCustom">
                    Username
                  </TableHead>
                  <TableHead className="text-left text-gray-600  font-bold py-5 border-b border-silverCustom">
                    Referrals
                  </TableHead>
                  <TableHead className="text-left text-gray-600 font-bold py-5 border-b border-silverCustom">
                    Join Position
                  </TableHead>
                  {/* <TableHead className="text-gray-600 dark:text-gray-500">N-Ref</TableHead>
									<TableHead className="text-gray-600 dark:text-gray-500">N-Join</TableHead>
									<TableHead className="text-gray-600 dark:text-gray-500">WS</TableHead> */}
                  <TableHead className="text-left text-gray-600  font-bold py-5 border-b border-silverCustom">
                    Wallet Address
                  </TableHead>
                  <TableHead className="text-left text-gray-600  font-bold py-5 border-b border-silverCustom">
                    Points
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="text-gray-800  py-5 border-b border-silverCustom">
                      {member.rank}
                    </TableCell>
                    <TableCell className="text-gray-800  py-5 border-b border-silverCustom">
                      {member.username}
                    </TableCell>
                    <TableCell className="text-gray-800  py-5 border-b border-silverCustom">
                      {member.referralsCount}
                    </TableCell>
                    <TableCell className="text-gray-800  py-5 border-b border-silverCustom">
                      {member.joinPosition}
                    </TableCell>
                    {/* <TableCell className="text-gray-800 dark:text-gray-200">{member.nRef}</TableCell>
										<TableCell className="text-gray-800 dark:text-gray-200">{member.nJoin}</TableCell>
										<TableCell className="text-gray-800 dark:text-gray-200">{member.weightedScore}</TableCell> */}
                    <TableCell className="text-gray-800  py-5 border-b border-silverCustom">
                      {member.walletAddress}
                    </TableCell>
                    <TableCell className="text-gray-800  py-5 border-b border-silverCustom">
                      {member.weightedScore}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      {/* <footer className="bg-gray-100  p-4 mt-12">
        <div className="text-center text-gray-700 ">
          <p>
            &copy; {new Date().getFullYear()} Your App. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default WaitlistLeaderboard;
