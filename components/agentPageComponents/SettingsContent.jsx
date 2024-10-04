import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FilterDropdown from '@/components/FilterDropdown';
import { toast } from "react-toastify";
import { Info, Upload } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const validateUrl = (url, domain) => {
  if (!url) return true; // Allow empty fields
  if (domain === '.*') {
    // For website, use a general URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  }
  const regex = new RegExp(`^https?://(www\\.)?${domain}/.*`);
  return regex.test(url);
};

export const SettingsContent = ({ agent, onUpdateAgent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgent, setEditedAgent] = useState({
    ...agent,
    skills: agent?.skills || ["Natural Language Processing", "Machine Learning", "Data Analysis"],
    platform: agent?.platform ? (Array.isArray(agent?.platform) ? agent?.platform : [agent?.platform]) : [],
    deploymentOption: agent?.deploymentOption ? (Array.isArray(agent?.deploymentOption) ? agent?.deploymentOption : [agent?.deploymentOption]) : [],
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAgent(prev => ({
      ...prev,
      [name]: name === 'name' ? value.slice(0, 50) :
        name === 'longDescription' ? value.slice(0, 200) : value
    }));

    // Clear error when verification starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleMultiSelectChange = (name, value) => {
    setEditedAgent({ ...editedAgent, [name]: value });
  };

  const handleSkillsChange = (skills) => {
    setEditedAgent({ ...editedAgent, skills: skills.slice(0, 3) });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image size should be less than 4MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedAgent(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateSocialLinks = () => {
    const newErrors = {};
    if (!validateUrl(editedAgent?.website, '.*')) {
      newErrors.website = 'Invalid website URL';
    }
    if (!validateUrl(editedAgent?.telegram, 't\\.me')) {
      newErrors.telegram = 'Invalid Telegram URL (should contain t.me)';
    }
    if (!validateUrl(editedAgent?.twitter, '(twitter\\.com|x\\.com)')) {
      newErrors.twitter = 'Invalid Twitter/X URL (should contain twitter.com or x.com)';
    }
    if (!validateUrl(editedAgent?.github, 'github\\.com')) {
      newErrors.github = 'Invalid GitHub URL (should contain github.com)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateSocialLinks()) {
      if (typeof onUpdateAgent === 'function') {
        onUpdateAgent(editedAgent);
        setIsEditing(false);
        toast.success("Agent information updated successfully");
      } else {
        console.warn('onUpdateAgent is not a function. Agent information not saved.');
      }
    } else {
      toast.error("Please correct the errors in the form");
    }
  };

  const platformOptions = [
    "OpenAI (GPT)", "Anthropic (Claude)", "Google DeepMind (Gemini)", "Microsoft Azure OpenAI",
    "Hugging Face Transformers", "Cohere", "Mistral AI", "xAI (Elon Musk's AI)",
    "Aleph Alpha", "Stability AI", "Databricks Dolly"
  ];

  const deploymentOptions = [
    "Cloud-based (e.g., AWS, Azure, Google Cloud)",
    "Local (Windows)",
    "Local (Mac)",
    "On-premise (Private Servers)"
  ];

  const sourceTypeOptions = ["Open Source", "Closed Source", "Hybrid"];

  const skillOptions = [
    "Natural Language Processing", "Computer Vision", "Reinforcement Learning",
    "Speech Recognition", "Machine Translation", "Sentiment Analysis",
    "Chatbot Development", "Image Generation", "Text-to-Speech",
    "Anomaly Detection", "Recommendation Systems", "Predictive Analytics",
    "Machine Learning", "Data Analysis", "Deep Learning"
  ];

  return (
    <Card className="bg-white/50  backdrop-blur-sm border-2 border-blackCustom rounded-none ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-800 ">Agent Information and Social Links</CardTitle>
        {isEditing ? (
          <Button onClick={handleSave} className="bg-blackCustom hover:bg-brownCustom border-2 border-black rounded-none text-white">Save Changes</Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="bg-blackCustom hover:bg-brownCustom border-2 border-black rounded-none text-white">Edit</Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="agent-image" className="text-gray-700 ">Agent Image</Label>
          {isEditing ? (
            <div className="mt-2">
              <Input
                id="agent-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="bg-white/50  text-gray-800 "
              />
              <p className="text-sm text-gray-600  mt-1">JPEG/PNG/WEBP/GIF, less than 4MB</p>
            </div>
          ) : (
            <div className="mt-2">
              <img src={editedAgent.image || "/placeholder.svg"} alt="Agent" className="w-32 h-32 object-cover rounded-full" />
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="agent-name" className="text-gray-700 ">Agent Name</Label>
          {isEditing ? (
            <Input
              id="agent-name"
              name="name"
              value={editedAgent?.name}
              onChange={handleInputChange}
              maxLength={50}
              className="bg-white/50  text-gray-800 "
            />
          ) : (
            <p id="agent-name" className="text-gray-600 ">{editedAgent?.name}</p>
          )}
          {isEditing && <p className="text-sm text-gray-600  mt-1">{editedAgent?.name.length}/50 characters</p>}
        </div>
        <div>
          <Label htmlFor="long-description" className="text-gray-700 ">Long Description</Label>
          {isEditing ? (
            <Textarea
              id="long-description"
              name="longDescription"
              value={editedAgent?.longDescription}
              onChange={handleInputChange}
              maxLength={200}
              className="bg-white rounded-none border-2 border-black text-gray-800 "
            />
          ) : (
            <p id="long-description" className="text-gray-600 ">{editedAgent?.longDescription}</p>
          )}
          {isEditing && <p className="text-sm text-gray-600  mt-1">{editedAgent?.longDescription.length}/200 characters</p>}
        </div>
        <div>
          <Label htmlFor="skills" className="text-gray-700 ">Skills (Select up to 3)</Label>
          {isEditing ? (
            <FilterDropdown
              value={editedAgent?.skills}
              onValueChange={handleSkillsChange}
              options={skillOptions}
              isMultiSelect={true}
            />
          ) : (
            <p id="skills" className="text-gray-600 ">{editedAgent?.skills.join(', ')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="platform" className="text-gray-700 ">Platform</Label>
          {isEditing ? (
            <FilterDropdown
              value={editedAgent?.platform}
              onValueChange={(value) => handleMultiSelectChange('platform', value)}
              options={platformOptions}
              isMultiSelect={true}
            />
          ) : (
            <p id="platform" className="text-gray-600 ">{editedAgent?.platform.join(', ')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="deployment" className="text-gray-700 ">Deployment</Label>
          {isEditing ? (
            <FilterDropdown
              value={editedAgent?.deploymentOption}
              onValueChange={(value) => handleMultiSelectChange('deploymentOption', value)}
              options={deploymentOptions}
              isMultiSelect={true}
            />
          ) : (
            <p id="deployment" className="text-gray-600 ">{editedAgent?.deploymentOption.join(', ')}</p>
          )}
        </div>
        <div>
          <Label htmlFor="source-type" className="text-gray-700 ">Source Type</Label>
          {isEditing ? (
            <FilterDropdown
              value={editedAgent?.sourceType}
              onValueChange={(value) => handleMultiSelectChange('sourceType', value)}
              options={sourceTypeOptions}
              isMultiSelect={false}
            />
          ) : (
            <p id="source-type" className="text-gray-600 ">{editedAgent?.sourceType}</p>
          )}
        </div>
        <div>
          <Label htmlFor="website" className="text-gray-700  flex items-center">
            Website
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-2 h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-white text-gray-800 ">
                  <p>This website is linked to the "Launch Agent" button</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          {isEditing ? (
            <>
              <Input
                id="website"
                name="website"
                value={editedAgent.website}
                onChange={handleInputChange}
                className={`bg-white/50  text-gray-800  ${errors.website ? 'border-red-500' : ''}`}
              />
              {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
            </>
          ) : (
            <p id="website" className="text-gray-600 ">{editedAgent?.website}</p>
          )}
        </div>
        {['telegram', 'twitter', 'github'].map((link) => (
          <div key={link}>
            <Label htmlFor={link} className="text-gray-700  capitalize">{link}</Label>
            {isEditing ? (
              <>
                <Input
                  id={link}
                  name={link}
                  value={editedAgent[link]}
                  onChange={handleInputChange}
                  className={`bg-white/50  text-gray-800  ${errors[link] ? 'border-red-500' : ''}`}
                />
                {errors[link] && <p className="text-red-500 text-sm mt-1">{errors[link]}</p>}
              </>
            ) : (
              <p id={link} className="text-gray-600 ">{editedAgent[link]}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};