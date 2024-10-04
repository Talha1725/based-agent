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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Github, ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "@/components/Loader";

const fetchLeaderboardData = async () => {
  // This would be replaced with an actual API call
  return Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    githubName: `user${i + 1}`,
    githubLink: `https://github.com/user${i + 1}`,
    avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=user${i + 1}`,
    walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
    globalWeight: Math.floor(Math.random() * 1000),
    rank: i + 1,
    skills: ["JavaScript", "React", "Node.js", "Python", "Solidity"]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1),
  }));
};

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [sortBy, setSortBy] = useState("rank_asc");
  const [skillFilter, setSkillFilter] = useState("all");
  const pageSize = 10;

  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leaderboardData"],
    queryFn: fetchLeaderboardData,
  });

  if (isLoading) return <Loader message={"Loading leaderboard data"} />;
  if (error)
    return <div className="text-red-600">Error loading leaderboard data</div>;
  const filteredData = leaderboardData
    .filter(
      (contributor) =>
        contributor.githubName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (skillFilter === "all" || contributor.skills.includes(skillFilter))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.githubName.localeCompare(b.githubName);
        case "rank_asc":
          return a.rank - b.rank;
        case "rank_desc":
          return b.rank - a.rank;
        default:
          return 0;
      }
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const allSkills = Array.from(
    new Set(leaderboardData.flatMap((contributor) => contributor.skills))
  );

  return (
    <div className="bg-gray-50   px-4 py-8 ">
      <Card className="lg:w-[70%] mx-auto bg-white  shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Contributor Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder="Search contributors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white  text-gray-800  w-48"
              />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] bg-white  text-gray-800 ">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="w-[180px] bg-white  text-gray-800 ">
                  <SelectValue placeholder="Filter by Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {allSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white  text-gray-800 ">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rank_asc">Rank (Ascending)</SelectItem>
                  <SelectItem value="rank_desc">Rank (Descending)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-600 ">Rank</TableHead>
                <TableHead className="text-gray-600 ">Contributor</TableHead>
                <TableHead className="text-gray-600 ">Wallet Address</TableHead>
                <TableHead className="text-gray-600 ">Global Weight</TableHead>
                <TableHead className="text-gray-600 ">Skills</TableHead>
                <TableHead className="text-gray-600 ">GitHub</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((contributor) => (
                <TableRow key={contributor.id}>
                  <TableCell className="text-gray-800">
                    {contributor.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={contributor.avatarUrl}
                          alt={contributor.githubName}
                        />
                        <AvatarFallback>
                          {contributor.githubName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-blackCustom ">
                        {contributor.githubName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {contributor.walletAddress}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {contributor.globalWeight}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {contributor.skills ? contributor.skills.join(", ") : "N/A"}
                  </TableCell>
                  <TableCell>
                    <a
                      href={contributor.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blackCustom hover:text-brownCustom font-black  "
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600 ">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-200  hover:bg-gray-300 text-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-gray-200  hover:bg-gray-300 text-gray-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
