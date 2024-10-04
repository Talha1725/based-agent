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
      <p className="text-lg font-semibold text-red-600 ">{message}</p>
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
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white  shadow-md rounded-none border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 ">
              Waitlist Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Filter by username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white  border-gray-300 w-full text-gray-800 "
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 ">Rank</TableHead>
                  <TableHead className="text-gray-600 ">Username</TableHead>
                  <TableHead className="text-gray-600 ">Referrals</TableHead>
                  <TableHead className="text-gray-600 ">
                    Join Position
                  </TableHead>
                  <TableHead className="text-gray-600 ">N-Ref</TableHead>
                  <TableHead className="text-gray-600 ">N-Join</TableHead>
                  <TableHead className="text-gray-600 ">WS</TableHead>
                  <TableHead className="text-gray-600 ">
                    Wallet Address
                  </TableHead>
                  <TableHead className="text-gray-600 ">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="text-gray-800 ">
                      {member.rank}
                    </TableCell>
                    <TableCell className="text-gray-800 ">
                      {member.username}
                    </TableCell>
                    <TableCell className="text-gray-800 ">
                      {member.referralsCount}
                    </TableCell>
                    <TableCell className="text-gray-800 ">
                      {member.joinPosition}
                    </TableCell>
                    <TableCell className="text-gray-800 ">
                      {member.nRef}
                    </TableCell>
                    <TableCell className="text-gray-800 ">
                      {member.nJoin}
                    </TableCell>
                    <TableCell className="text-gray-800 ">
                      {member.weightedScore}
                    </TableCell>
                    <TableCell className="text-gray-800 ">
                      {member.walletAddress}
                    </TableCell>
                    <TableCell className="text-gray-800 ">
                      {member.points}
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
