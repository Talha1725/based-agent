"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Globe, Send, Twitter, Github, Rocket } from "lucide-react";
import Link from "next/link";

import { DashboardContent } from "@/components/agentPageComponents/DashboardContent";
import { GovernanceContent } from "@/components/agentPageComponents/GovernanceContent";
import WalletContent from "@/components/agentPageComponents/WalletContent";
import { SettingsContent } from "@/components/agentPageComponents/SettingsContent";
import { GitHubContent } from "@/components/agentPageComponents/GitHubContent";
import Loader from "@/components/Loader";
import axios from "axios";

const fetchAgentData = async (id) => {

    let dummyData =
    {
        id: 1,
        name: "ChatGPT Assistant",
        creator: "OpenAI",
        contract: "0x1234...5678",
        shortDescription: "AI-powered language model for natural conversations",
        longDescription:
            "ChatGPT Assistant is a state-of-the-art AI language model designed to engage in natural conversations, answer questions, and assist with various tasks.",
        category: "AI",
        capabilities: [
            "Natural Language Processing",
            "Question Answering",
            "Task Assistance",
        ],
        website: "https://openai.com",
        telegram: "https://t.me/chatgpt",
        twitter: "https://twitter.com/openai",
        github: "https://github.com/openai",
        platform: "OpenAI (GPT)",
        deploymentOption: "Cloud-based (e.g., AWS, Azure, Google Cloud)",
        sourceType: "Closed Source",
    };

    try {
        const response = await axios.get(`/api/agents/${id}`);
        console.log('response:', response.data)
        return response.data;
    }
    catch (error) {
        console.log('error:', error)
    }
    // Simulated API call
    // return {
    //     id: 1,
    //     name: "ChatGPT Assistant",
    //     creator: "OpenAI",
    //     contract: "0x1234...5678",
    //     shortDescription: "AI-powered language model for natural conversations",
    //     longDescription:
    //         "ChatGPT Assistant is a state-of-the-art AI language model designed to engage in natural conversations, answer questions, and assist with various tasks.",
    //     category: "AI",
    //     capabilities: [
    //         "Natural Language Processing",
    //         "Question Answering",
    //         "Task Assistance",
    //     ],
    //     website: "https://openai.com",
    //     telegram: "https://t.me/chatgpt",
    //     twitter: "https://twitter.com/openai",
    //     github: "https://github.com/openai",
    //     platform: "OpenAI (GPT)",
    //     deploymentOption: "Cloud-based (e.g., AWS, Azure, Google Cloud)",
    //     sourceType: "Closed Source",
    // };
};

const AgentPage = ({ params }) => {
    const [activeTab, setActiveTab] = useState("dashboard");

    const {
        data: agent,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["agentData", params.id],
        queryFn: () => fetchAgentData(params.id),
    });

    if (isLoading) return <Loader message={"Loading data"} />;
    if (error) return <p className="text-gray-800 ">Error loading data</p>;

    const SocialLink = ({ href, icon }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 "
        >
            {icon}
        </a>
    );

    const TabTrigger = ({ value, label }) => (
        <TabsTrigger
            value={value}
            className={`text-gray-800 
        ${activeTab === value ? "bg-blue-600 text-white " : "hover:bg-gray-100 "
                } 
        transition-colors duration-200 ease-in-out flex-shrink-0`}
            onClick={() => setActiveTab(value)}
        >
            {label}
        </TabsTrigger>
    );

    return (
        <div className="px-4 py-8 bg-white ">
            <div className="lg:w-[70%] mx-auto ">
                <Card className="  border-2 border-black rounded-none mb-8 bg-white">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                            <div className="flex items-center mb-4 md:mb-0">
                                <img
                                    src="/placeholder.svg"
                                    alt={agent?.name}
                                    className="w-16 h-16 rounded-full mr-4"
                                />
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 ">
                                        {agent?.name}
                                    </h1>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        Created by{" "}
                                        <Link
                                            href="/profile"
                                            className="text-blackCustom font-black hover:underline "
                                        >
                                            {agent?.userId}
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <Button className="bg-blackCustom hover:bg-brownCustom rounded-none border-2 border-black text-white">
                                <Rocket className="mr-2 h-5 w-5" /> Launch Agent
                            </Button>
                        </div>
                        <p className="text-lg mb-4 text-gray-800">
                            {agent?.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {agent?.skills.map((capability, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-blackCustom border-2 border-black text-white"
                                >
                                    {capability}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-start gap-4">
                            <SocialLink
                                href={agent?.website}
                                icon={<Globe className="h-5 w-5" />}
                            />
                            <SocialLink
                                href={agent?.telegram}
                                icon={<Send className="h-5 w-5" />}
                            />
                            <SocialLink
                                href={agent?.twitter}
                                icon={<Twitter className="h-5 w-5" />}
                            />
                            <SocialLink
                                href={agent?.github}
                                icon={<Github className="h-5 w-5" />}
                            />
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            <p>Platform: {agent?.platform}</p>
                            <p>Deployment: {agent?.deploymentOption}</p>
                            <p>Source Type: {agent?.sourceType}</p>
                        </div>
                    </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="bg-white  flex flex-nowrap overflow-x-auto whitespace-nowrap">
                        <TabTrigger value="dashboard" label="Dashboard" />
                        <TabTrigger value="governance" label="Governance" />
                        <TabTrigger value="wallets" label="Wallets" />
                        <TabTrigger value="github" label="GitHub" />
                        <TabTrigger value="settings" label="Settings" />
                    </TabsList>

                    <TabsContent value="dashboard">
                        <DashboardContent agent={agent} />
                    </TabsContent>
                    <TabsContent value="governance">
                        <GovernanceContent />
                    </TabsContent>
                    <TabsContent value="wallets">
                        <WalletContent />
                    </TabsContent>
                    <TabsContent value="github">
                        <GitHubContent agent={agent} />
                    </TabsContent>
                    <TabsContent value="settings">
                        <SettingsContent agent={agent} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AgentPage;
