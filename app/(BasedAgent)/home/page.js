"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  PlusCircle,
  Rocket,
  Search,
  ListFilter,
  RotateCcw,
  X,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  platformOptions,
  deploymentOptions,
  sourceTypeOptions,
  capabilityOptions,
} from "@/utils/Constants";
import Link from "next/link";
import FilterDropdown from "@/components/FilterDropdown";
import Loader from "@/components/Loader";

const fetchProjects = async () => {
  try {
    const response = await fetch("/api/agents");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("data of agents:", data);
    return data.map((agent) => ({
      id: agent.id,
      name: agent.name,
      summary: agent.description,
      skills: agent.skills,
      marketCap: agent.marketCap || 0,
      price: agent.price || "+0.00%",
      logo: agent.logo || "/placeholder.svg",
      featured: agent.featured || false,
      createdAt: agent.createdAt,
      platform: agent.platform || "OpenAI (GPT)",
      deploymentOption:
        agent.deploymentOption ||
        "Cloud-based (e.g., AWS, Azure, Google Cloud)",
      sourceType: agent.sourceType || "Closed Source",
      tokenSymbol: agent.tokenSymbol,
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; // Return an empty array or handle the error as needed
  }
};

const Index = () => {
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedDeploymentOption, setSelectedDeploymentOption] =
    useState("all");
  const [selectedSourceType, setSelectedSourceType] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const [displayedProjectsCount, setDisplayedProjectsCount] = useState(4);

  useEffect(() => {
    if (projects) {
      const filteredSuggestions = projects
        .filter(
          (project) =>
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedItems.includes(project.name)
        )
        .map((project) => project.name);
      setSuggestions(filteredSuggestions);
    }
  }, [searchTerm, projects, selectedItems]);

  // projects that are rendered on the page
  const sortProjects = (totalProjects, sortBy) => {
    let projects = totalProjects.slice(0, displayedProjectsCount);
    switch (sortBy) {
      case "marketCapLow":
        return [...projects].sort((a, b) => a.marketCap - b.marketCap);
      case "marketCapHigh":
        return [...projects].sort((a, b) => b.marketCap - a.marketCap);
      case "recent":
        return [...projects].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "featured":
        return [...projects].sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
      default:
        return projects;
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItems([...selectedItems, item]);
    setSearchTerm("");
  };

  const handleRemoveItem = (item) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  const filteredProjects = projects
    ? projects.filter(
        (project) =>
          (selectedItems.length === 0 ||
            selectedItems.includes(project.name)) &&
          (selectedCapabilities.length === 0 ||
            selectedCapabilities.some((cap) => project.skills.includes(cap))) &&
          (selectedPlatform === "all" ||
            project.platform === selectedPlatform) &&
          (selectedDeploymentOption === "all" ||
            project.deploymentOption === selectedDeploymentOption) &&
          (selectedSourceType === "all" ||
            project.sourceType === selectedSourceType)
      )
    : [];

  const sortedProjects = sortProjects(filteredProjects, sortBy);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedItems([]);
    setSelectedCapabilities([]);
    setSelectedPlatform("all");
    setSelectedDeploymentOption("all");
    setSelectedSourceType("all");
    setSortBy("recent");
  };

  const Error = ({ message }) => (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold text-red-600 ">{message}</p>
    </div>
  );

  if (isLoading) return <Loader message={"Loading AI agents..."} />;
  if (error) return <Error message="Error fetching data" />;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <main className="container mx-auto mt-8">
        <section className="text-left mb-12">
          <h2 className="text-4xl font-bold mb-4 mx-8 text-gray-900">
            BasedAgent
          </h2>
          <p className="text-xl mb-6 max-w-3xl mx-8 text-gray-700">
            Step into the future with your personal AI Agent. As AI
            revolutionizes the digital landscape, owning and leveraging these
            intelligent entities will become essential. BasedAgent empowers you
            to discover, engage with, and create AI Agents designed to enhance
            lives—yours and others'—through improved well-being, health, and
            prosperity.
          </p>
          <Link href="/launch">
            <Button
              size="lg"
              className="bg-blackCustom hover:bg-brownCustom text-white mx-8 rounded-none"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create AI Agent
            </Button>
          </Link>
        </section>

        <div className="mb-6 mx-8 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-wrap">
          <div className="relative flex-grow w-full sm:w-auto mb-2 sm:mb-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10 bg-white border-2 border-black w-full text-black rounded-none"
              placeholder="Search for tokens or agents"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-none border-2 border-gray-300 rounded-md shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSelectItem(suggestion)}
                    className="w-full text-left text-gray-800 hover:bg-gray-100 px-4 py-2"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
          </div>
          {/* Advanced Filters Button */}
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="bg-blackCustom text-white border-2 border-black rounded-none hover:bg-brownCustom w-full sm:w-auto"
          >
            Advanced Filters <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex space-x-2 w-full sm:w-auto justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-blackCustom  text-white  border-black  hover:bg-brownCustom rounded-none "
                >
                  <ListFilter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white mx-5  border-gray-200 rounded-none ">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none text-gray-900 ">
                      Sort by
                    </h4>
                    <RadioGroup defaultValue={sortBy} onValueChange={setSortBy}>
                      {[
                        {
                          value: "marketCapLow",
                          label: "Market Cap (Low to High)",
                        },
                        {
                          value: "marketCapHigh",
                          label: "Market Cap (High to Low)",
                        },
                        { value: "recent", label: "Most Recent" },
                        { value: "featured", label: "Featured" },
                      ].map(({ value, label }) => (
                        <div
                          key={value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={value} id={value} />
                          <label htmlFor={value} className="text-gray-700 ">
                            {label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="icon"
              className="bg-blackCustom  text-white  border-2 border-black  hover:bg-brownCustom rounded-none "
              onClick={resetFilters}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="mx-8 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterDropdown
              value={selectedCapabilities}
              onValueChange={setSelectedCapabilities}
              options={capabilityOptions}
              isMultiSelect={true}
            />
            <FilterDropdown
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
              options={platformOptions}
            />
            <FilterDropdown
              value={selectedDeploymentOption}
              onValueChange={setSelectedDeploymentOption}
              options={deploymentOptions}
              defaultValue="All Deployment Types"
            />
            <FilterDropdown
              value={selectedSourceType}
              onValueChange={setSelectedSourceType}
              options={sourceTypeOptions}
              defaultValue="All Source Types"
            />
          </div>
        )}

        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedItems.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-200 text-gray-800 "
              >
                {item}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveItem(item)}
                  className="ml-1 p-0 h-auto bg-blackCustom text-white hover:bg-brownCustom rounded-none"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 mx-8 rounded-none md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <p className="text-gray-700">Loading AI agents...</p>
          ) : error ? (
            <p className="text-red-600">Error loading AI agents</p>
          ) : (
            sortedProjects.map((project) => (
              <Card
                key={project.id}
                className="border-2 border-blackCustom rounded-none flex flex-col h-full"
              >
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={project.logo}
                      alt={`${project.name} logo`}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ${project.tokenSymbol}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{project.summary}</p>
                  <p className="text-gray-700 mb-2">
                    <strong>Skills:</strong>
                  </p>
                  <ul className="flex flex-wrap gap-2 mb-2">
                    {project.skills.map((skill, index) => (
                      <li
                        key={index}
                        className="text-xs text-center font-semibold bg-blackCustom px-2 py-1 text-white rounded-full"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-700">
                    <strong>Market Cap:</strong> $
                    {project.marketCap?.toLocaleString() || "N/A"}
                  </p>
                  <p className="text-green-600">{project.price}</p>
                  <div className="mt-auto">
                    <Link href={`/agent/${project.id}`}>
                      <Button
                        size="sm"
                        className="w-full bg-blackCustom hover:bg-brownCustom text-white rounded-none border-2 border-blackCustom"
                      >
                        <Rocket className="mr-1 h-4 w-4" /> View Agent
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          {/* Show load more only if all projects are not displayed */}
          {displayedProjectsCount < filteredProjects.length && (
            <Button
              onClick={() =>
                setDisplayedProjectsCount(displayedProjectsCount + 6)
              }
              size="lg"
              className="bg-blackCustom hover:bg-brownCustom rounded-none border-2 border-blackCustom text-white"
            >
              Load More
            </Button>
          )}
        </div>
      </main>

      {/* <footer className="bg-gray-100 p-4 mt-12">
        <div className="text-center text-gray-700 ">
          <p>
            &copy; {new Date().getFullYear()} BasedAgent. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default Index;
