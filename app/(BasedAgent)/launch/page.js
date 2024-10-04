"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Github, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FilterDropdown from "@/components/FilterDropdown";
import { toast } from "react-toastify"; // Import toast
import { useAccount, useWriteContract } from "wagmi";
import { abi } from "@/config/abi";
import { config } from "@/config/config";
import { useCoin } from "@/context/coinContext";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import Switch from "@/components/ui/switch";

const Launch = () => {
  // Form state management
  const [formValues, setFormValues] = useState({
    agentName: "",
    agentDescription: "",
    website: "",
    telegram: "",
    twitter: "",
    github: "",
    tokenName: "",
    tokenSymbol: "",
    initialBuyAmount: "",
  });
  const [enterTokenInfo, setTokenInfo] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [contributorPoolPercentage, setContributorPoolPercentage] = useState(0);
  const [formErrors, setFormErrors] = useState({}); // To store form validation errors
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { address, isConnected } = useAccount();
  const { coin } = useCoin();
  const { data: session } = useSession();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Skills change handler
  const handleSkillsChange = (skills) => {
    setSelectedSkills(skills.slice(0, 3)); // Limit to 3 skills
  };

  const totalSupply = 1000000000; // 1 billion tokens
  const dexLiquidityPercentage = 20;
  const dexLiquidityTokens = totalSupply * (dexLiquidityPercentage / 100);
  const contributorPoolTokens = totalSupply * (contributorPoolPercentage / 100);
  const bondingCurveTokens =
    totalSupply - dexLiquidityTokens - contributorPoolTokens;

  const skillOptions = [
    "Natural Language Processing",
    "Computer Vision",
    "Reinforcement Learning",
    "Speech Recognition",
    "Machine Translation",
    "Sentiment Analysis",
    "Chatbot Development",
    "Image Generation",
    "Text-to-Speech",
    "Anomaly Detection",
    "Recommendation Systems",
    "Predictive Analytics",
    "Machine Learning",
    "Data Analysis",
    "Deep Learning",
  ];

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!formValues.agentName) errors.agentName = "Agent Name is required.";
    if (!formValues.agentDescription)
      errors.agentDescription = "Agent Description is required.";
    if (!formValues.tokenName) errors.tokenName = "Token Name is required.";
    if (!formValues.tokenSymbol)
      errors.tokenSymbol = "Token Symbol is required.";
    if (selectedSkills.length === 0)
      errors.skills = "Please select at least one skill.";
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleLaunchAgent = async () => {
    if (validateForm()) {
      try {
        toast.success(
          "Agent deployment initiated. Please wait for confirmation.",
          { autoClose: 3000 }
        ); // Initial success toast
        console.log("Launching agent with data:", formValues);

        // You might want to calculate or define these values as per your platform requirements
        const vEth = 100; // Placeholder for the vEth value
        const vToken = 200; // Placeholder for the vToken value

        const metadata = {
          name: formValues.agentName,
          description: formValues.agentDescription,
          website: formValues.website || "", // Handle optional fields
          telegram: formValues.telegram || "",
          twitter: formValues.twitter || "",
          github: formValues.github || "",
          logo: "ipfs://agentLogoHash", // Placeholder for logo IPFS hash
        };

        // Save the agent data to the API
        const saveAgent = await fetch("/api/launch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formValues,
            selectedSkills,
            metadata,
            vEth,
            vToken,
            coin,
            contributorPoolPercentage,
            dexLiquidityPercentage,
            userId: session.user.id,
          }),
        });

        const data = await saveAgent.json();

        // Handle error in API response
        if (data.error === "Agent already exists") {
          toast.error(
            "Agent with the same name already exists. Please choose a different name.",
            { autoClose: 3000 }
          );
          return;
        }

        // Perform the contract write
        console.log("Transaction start");
        // const tx = await writeContract({
        // 	address: "0x6f121d0d10145d1b069511d989d08db62778d9c8",  // Replace with your AgentFactory contract address
        // 	abi, functionName: 'setGreeting', args: ['helloworld'
        // 	],
        // });

        const args = [
          formValues.agentName,
          formValues.tokenSymbol,
          address,
          Number(totalSupply),
          Number(vEth),
          Number(vToken),
          { name: formValues.agentName, url: formValues.agentDescription },
        ];

        console.log(
          "Types of args:",
          args.map((arg) => typeof arg)
        );
        console.log("Values of args:", args);

        const tx = await writeContract({
          address: "0x246f7A82F230ea12bF678d87665EE1EBafdbA08f",
          abi,
          functionName: "createAgent",
          args: args,
        });
        console.log("data hash : ", hash);
        // Handle successful transaction
        if (tx) {
          toast.success("Agent successfully launched!", { autoClose: 3000 });
          console.log("Transaction response:", tx);
        }
      } catch (error) {
        // Handle error in transaction
        toast.error("Error launching agent. Please try again.", {
          autoClose: 3000,
        });
        console.error("Error launching agent:", error);
      }
    } else {
      toast.error("Please fill in all required fields.", { autoClose: 3000 });
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 text-gray-800 flex justify-center">
      <div className="lg:w-[50%] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          Launch your Agent on BasedAgent
        </h1>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-2xl font-bold mb-4">Agent Information</h2>
          {/* Agent Image */}
          <div className="flex flex-col gap-4">
            <div className="w-full sm:w-1/3">
              <label className="block mb-2">Agent Image *</label>
              <ImageUploader />
            </div>

            {/* Agent Name */}
            <InputField
              label="Agent Name *"
              maxLength={50}
              name="agentName"
              value={formValues.agentName}
              onChange={handleInputChange}
              error={formErrors.agentName}
            />

            {/* Agent Description */}
            <InputField
              label="Agent Description *"
              maxLength={200}
              isTextarea
              name="agentDescription"
              value={formValues.agentDescription}
              onChange={handleInputChange}
              error={formErrors.agentDescription}
            />
          </div>
          {/* Skills */}
          <div>
            <label className="block mb-2">Skills *</label>
            <FilterDropdown
              value={selectedSkills}
              onValueChange={handleSkillsChange}
              options={skillOptions}
              isMultiSelect={true}
            />
            {formErrors.skills && (
              <p className="text-red-500">{formErrors.skills}</p>
            )}
            <p className="text-sm text-gray-600  mt-1">Select up to 3 skills</p>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-200  text-gray-800 "
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {/* Optional Fields */}
          <InputField
            label="Website"
            placeholder="Optional"
            name="website"
            value={formValues.website}
            onChange={handleInputChange}
          />
          <InputField
            label="Telegram"
            placeholder="Optional"
            name="telegram"
            value={formValues.telegram}
            onChange={handleInputChange}
          />
          <InputField
            label="Twitter"
            placeholder="Optional"
            name="twitter"
            value={formValues.twitter}
            onChange={handleInputChange}
          />
          <InputField
            label="GitHub"
            placeholder="Optional"
            name="github"
            value={formValues.github}
            onChange={handleInputChange}
          />
          <div className="flex items-center justify-between text-black ">
            <Label htmlFor={"do you also want to issue a token ?"}>
              {"do you also want to issue a token ?"}
            </Label>
            <Switch
              id={"do you also want to issue a token ?"}
              checked={enterTokenInfo}
              onChange={setTokenInfo}
            />
          </div>
          {enterTokenInfo && (
            <div>
              <h2 className="text-2xl font-bold mb-4 mt-8">
                Token Information
              </h2>
              {/* Token Name */}
              <InputField
                label="Token Name *"
                maxLength={20}
                name="tokenName"
                value={formValues.tokenName}
                onChange={handleInputChange}
                error={formErrors.tokenName}
              />
              {/* Token Symbol */}
              <InputField
                label="Token Symbol ($Ticker) *"
                maxLength={10}
                name="tokenSymbol"
                value={formValues.tokenSymbol}
                onChange={handleInputChange}
                error={formErrors.tokenSymbol}
              />
              {/* Contributor Pool Allocation */}
              <div>
                <label className="block mb-2 flex items-center">
                  Contributor Pool Allocation
                  <Popover>
                    <PopoverTrigger>
                      <Info className="ml-2 h-4 w-4 text-gray-400 " />
                    </PopoverTrigger>
                    <PopoverContent className="bg-white text-gray-800 ">
                      <p>
                        The Contributor Pool allows you to reward people who
                        contribute to your Agent's development with your token.
                      </p>
                      <p className="mt-2">
                        Tokens will start vesting to the Contributor Pool
                        immediately after token creation, over a period of 1,000
                        days.
                      </p>
                    </PopoverContent>
                  </Popover>
                </label>
                <div className="flex items-center">
                  <Slider
                    value={[contributorPoolPercentage]}
                    onValueChange={(value) =>
                      setContributorPoolPercentage(value[0])
                    }
                    max={30}
                    step={1}
                    className="flex-grow mr-4"
                  />
                  <span>{contributorPoolPercentage}%</span>
                </div>
              </div>
              {/* Token Allocation Summary */}
              <div className="bg-gray-100  p-4 rounded-md mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Token Allocation Summary
                </h3>
                <p className="font-bold italic">
                  Total Supply: 1,000,000,000 tokens
                </p>
                <p>
                  Contributor Pool: {contributorPoolTokens.toLocaleString()}{" "}
                  tokens ({contributorPoolPercentage}%)
                </p>
                <p>
                  DEX Liquidity: {dexLiquidityTokens.toLocaleString()} tokens (
                  {dexLiquidityPercentage}%)
                </p>
                <p>
                  Bonding Curve: {bondingCurveTokens.toLocaleString()} tokens (
                  {((bondingCurveTokens / totalSupply) * 100).toFixed(2)}%)
                </p>
              </div>
              {/* Initial Buy */}
              <div>
                <label className="block mb-2">
                  Initial Buy{" "}
                  <span className="text-sm text-gray-600 ">
                    be the first person to buy your token
                  </span>
                </label>
                <div className="relative">
                  <Input
                    className="pr-16 bg-white text-gray-800 "
                    placeholder="Optional. Enter the amount"
                    name="initialBuyAmount"
                    value={formValues.initialBuyAmount}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-sm font-semibold uppercase">
                      {coin}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Balance: 0 {coin.toUpperCase()}
                </p>
              </div>
            </div>
          )}
          {/* Submit Button */}
          <Button
            className="w-full bg-blackCustom hover:bg-brownCustom border-2 border-blackCustom rounded-none  text-white "
            size="lg"
            onClick={handleLaunchAgent}
          >
            {isPending ? "Launching..." : "Launch Agent"}
          </Button>
          {hash && <div>Transaction Hash: {hash}</div>}
          <p className="text-sm text-center text-gray-600 mt-2">
            When your Agent completes its bonding curve, you receive 0.5{" "}
            {coin.toUpperCase()} as a reward.
          </p>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  maxLength,
  placeholder,
  isTextarea = false,
  name,
  value,
  onChange,
  error,
  description,
}) => (
  <div>
    <label className="block mb-2">{label}</label>
    {isTextarea ? (
      <Textarea
        className="w-full text-gray-800 "
        maxLength={maxLength}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
      />
    ) : (
      <Input
        className="w-full text-gray-800 "
        maxLength={maxLength}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    {description && (
      <p className="text-sm text-gray-600  mt-1">{description}</p>
    )}
  </div>
);

const ImageUploader = () => (
  <div className="p-4 text-center cursor-pointer hover:bg-gray-50  transition-colors border-2 border-blackCustom rounded-none">
    <Upload className="h-12 w-12 mx-auto mb-2 text-blackCustom font-black" />
    <p className="text-blackCustom font-black mb-2">JPEG/PNG/WEBP/GIF</p>
    <p className="text-sm text-gray-600 ">Less than 4MB</p>
  </div>
);

export default Launch;
