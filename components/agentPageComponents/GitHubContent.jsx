import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Lock, Unlock, ExternalLink, Star, GitFork } from 'lucide-react';

export const GitHubContent = ({ agent }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const repoStats = { stars: 1234, forks: 567 };

  const handleGitHubAuth = () => {
    // Implement GitHub authentication logic here
    setIsAuthenticated(true);
  };

  const ContributorsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-600 ">Contributor</TableHead>
          <TableHead className="text-gray-600 ">Status</TableHead>
          <TableHead className="text-gray-600 ">Contribution Score</TableHead>
          <TableHead className="text-gray-600 ">Profile</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { id: 1, name: 'Alice', avatar: 'https://github.com/alice.png', profile: 'https://github.com/alice', score: 120, status: 'Owner' },
          { id: 2, name: 'Bob', avatar: 'https://github.com/bob.png', profile: 'https://github.com/bob', score: 85, status: 'Admin' },
          { id: 3, name: 'Charlie', avatar: 'https://github.com/charlie.png', profile: 'https://github.com/charlie', score: 62, status: 'Contributor' },
        ].map((contributor) => (
          <TableRow key={contributor.id}>
            <TableCell className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={contributor.avatar} alt={contributor.name} />
                <AvatarFallback>{contributor.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-gray-800 ">{contributor.name}</span>
            </TableCell>
            <TableCell className={`font-semibold ${contributor.status === 'Owner' ? 'text-purple-600 ' :
              contributor.status === 'Admin' ? 'text-blackCustom font-black ' :
                'text-green-600 '
              }`}>
              {contributor.status}
            </TableCell>
            <TableCell className="text-gray-800 ">{contributor.score}</TableCell>
            <TableCell>
              <a
                href={contributor.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blackCustom font-black hover:text-brownCustom flex items-center"
              >
                View Profile
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-8">
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800 ">GitHub Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Input
              value={agent?.github}
              readOnly
              className="bg-white/50  text-gray-800  flex-grow"
            />
            <Button className="bg-blackCustom hover:bg-brownCustom border-2 border-black rounded-none">
              <a href={agent?.github} target="_blank" rel="noopener noreferrer" className="  text-white flex items-center">
                <Github className="mr-2 h-4 w-4 text-white" />
                View on GitHub
              </a>
            </Button>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary" className={`${agent?.isPrivate ? 'bg-yellow-100 text-yellow-800 ' : 'bg-green-100 text-green-800 '}`}>
              {agent?.isPrivate ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
              {agent?.isPrivate ? 'Private' : 'Public'} Repository
            </Badge>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="text-gray-600 ">{repoStats.stars} stars</span>
            </div>
            <div className="flex items-center">
              <GitFork className="h-5 w-5 text-blue-400 mr-1" />
              <span className="text-gray-600 ">{repoStats.forks} forks</span>
            </div>
          </div>
          <Card className="bg-white/50  backdrop-blur-sm mt-4 relative">
            <CardHeader>
              <CardTitle className="text-gray-800 ">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              {isAuthenticated ? (
                <ContributorsTable />
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Button onClick={handleGitHubAuth} className="bg-blackCustom hover:bg-brownCustom border-2 border-black rounded-none text-white">
                      <Github className="mr-2 h-5 w-5" />
                      Authenticate with GitHub
                    </Button>
                  </div>
                  <div className="opacity-20">
                    <ContributorsTable />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};