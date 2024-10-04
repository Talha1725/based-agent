"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, MessageSquare, ExternalLink, Camera } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/Loader";

const fetchUserData = async () => {
  // This would be replaced with an actual API call
  return {
    id: 1,
    githubName: "alice",
    avatarUrl: "https://github.com/alice.png",
    githubUrl: "https://github.com/alice",
    bio: "AI enthusiast and software developer",
    globalWeight: 156,
    walletAddress: "0x1234...5678",
    agents: [
      {
        name: "ChatGPT Assistant",
        weight: 80,
        percentageOfSupply: "8%",
        type: "developed",
      },
      {
        name: "Image Generator",
        weight: 45,
        percentageOfSupply: "4.5%",
        type: "developed",
      },
      {
        name: "AI Task Manager",
        weight: 20,
        percentageOfSupply: "2%",
        type: "contributing",
      },
      {
        name: "Smart City Planner",
        weight: 11,
        percentageOfSupply: "1.1%",
        type: "contributing",
      },
    ],
    topLanguages: ["JavaScript", "Python", "Rust"],
    rankHistory: [
      { date: "2023-01-01", rank: 10 },
      { date: "2023-02-01", rank: 8 },
      { date: "2023-03-01", rank: 5 },
      { date: "2023-04-01", rank: 3 },
      { date: "2023-05-01", rank: 1 },
    ],
  };
};

const UserProfile = () => {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);

  // Simulated current verification's wallet address
  const currentUserWalletAddress = "0x1234...5678";

  if (isLoading) return <Loader message={"Loading verification data"} />;
  if (error)
    return <div className="text-gray-800">Error loading user data</div>;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleSave = () => {
    console.log("Saving updated verification data:", editedData);
    console.log("New profile photo:", newProfilePhoto);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image size should be less than 4MB");
        return;
      }
      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type
        )
      ) {
        toast.error(
          "Unsupported file type. Please use JPEG, PNG, WEBP, or GIF."
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePhoto(reader.result);
        setEditedData((prev) => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isProfileOwner = userData.walletAddress === currentUserWalletAddress;

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-50 mb-8 shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={newProfilePhoto || userData.avatarUrl}
                  alt={userData.githubName}
                />
                <AvatarFallback>
                  {userData.githubName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-blackCustom border-2 border-black rounded-none hover:bg-brownCustom p-2 cursor-pointer">
                  <label
                    htmlFor="profile-photo-upload"
                    className="cursor-pointer"
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </label>
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden "
                    onChange={handleProfilePhotoChange}
                  />
                </div>
              )}
            </div>
            <div className="flex-grow">
              {isEditing ? (
                <Input
                  name="githubName"
                  value={editedData.githubName}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-blackCustom  bg-white border-2 rounded-none  border-black "
                />
              ) : (
                <CardTitle className="text-2xl font-bold text-gray-800 ">
                  {userData.githubName}
                </CardTitle>
              )}
              {isEditing ? (
                <Textarea
                  name="bio"
                  value={editedData.bio}
                  onChange={handleInputChange}
                  className="text-gray-600  bg-white mt-2"
                />
              ) : (
                <p className="text-gray-600 ">{userData.bio}</p>
              )}
              <div className="flex flex-col md:flex-row flex-wrap gap-3 md:items-center mt-2 space-x-4">
                <a
                  href={`https://etherscan.io/address/${userData.walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-brownCustom   flex items-center"
                >
                  {userData.walletAddress}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
                <a
                  href={userData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blackCustom hover:text-brownCustom"
                >
                  <Github className="h-6 w-6" />
                </a>
                <Button className="bg-blackCustom hover:bg-brownCustom border-2 border-blackCustom rounded-none text-white">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                {isProfileOwner &&
                  (isEditing ? (
                    <Button
                      onClick={handleSave}
                      className="bg-blackCustom hover:bg-brownCustom border-2 border-blackCustom rounded-none text-white"
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      onClick={handleEdit}
                      className="bg-blackCustom hover:bg-brownCustom border-2 border-backCustom rounded-none text-white"
                    >
                      Edit Profile
                    </Button>
                  ))}
              </div>
              {isEditing && (
                <p className="text-sm text-gray-500  mt-2">
                  Supported image formats: JPEG, PNG, WEBP, GIF. Max file size:
                  4MB.
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-4 text-gray-800 ">
              Global Weight:{" "}
              <span className="font-bold">{userData.globalWeight}</span>
            </p>
            <p className="text-lg mb-4 text-gray-800 ">
              Top Languages: {userData.topLanguages.join(", ")}
            </p>
            <div className="bg-white  p-4 rounded-none border-2 border-blackCustom">
              <h3 className="text-lg font-semibold text-gray-800 ">
                Agent Rankings
              </h3>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Percentage of Supply</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.agents.map((agent) => (
                    <TableRow key={agent.name}>
                      <TableCell>{agent.name}</TableCell>
                      <TableCell>{agent.weight}</TableCell>
                      <TableCell>{agent.percentageOfSupply}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            agent.type === "developed" ? "default" : "outline"
                          }
                        >
                          {agent.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-8 border-2 border-blackCustom rounded-none  p-4 bg-white">
              <h3 className="text-lg font-semibold  text-gray-800 ">
                Ranking History
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={userData.rankHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rank" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
