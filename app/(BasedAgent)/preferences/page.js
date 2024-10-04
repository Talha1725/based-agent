"use client";
import React, { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Switch from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ThemeContext from "@/context/ThemeContext"; // Import the theme context

const NotificationPreference = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between text-black ">
    <Label htmlFor={label.toLowerCase().replace(/\s+/g, "-")}>{label}</Label>
    <Switch
      id={label.toLowerCase().replace(/\s+/g, "-")}
      checked={checked}
      onCheckedChange={onChange}
    />
  </div>
);

// const JobPreferences = ({ preferences, handlePreferenceChange }) => (
//   <div className="space-y-4">
//     <div>
//       <Label htmlFor="desired-positions" className="mb-2 block text-black ">
//         Desired Positions
//       </Label>
//       <Select
//         id="desired-positions"
//         value={preferences.desiredPositions}
//         onValueChange={(value) =>
//           handlePreferenceChange("desiredPositions", value)
//         }
//       >
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder="Add desired positions" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="frontend">Frontend Developer</SelectItem>
//           <SelectItem value="backend">Backend Developer</SelectItem>
//           <SelectItem value="fullstack">Full Stack Developer</SelectItem>
//           <SelectItem value="ai">AI Engineer</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//     <div className="flex items-center justify-between text-black">
//       <Label htmlFor="help-build-basedagent">
//         Are you available to help develop and build BasedAgent?
//       </Label>
//       <Switch
//         id="help-build-basedagent"
//         checked={preferences.helpBuildBasedAgent}
//         onCheckedChange={(checked) =>
//           handlePreferenceChange("helpBuildBasedAgent", checked)
//         }
//       />
//     </div>
//     <div className="flex items-center justify-between text-black ">
//       <Label htmlFor="help-other-agent-devs">
//         Are you available to help other Agent Devs build their own Agents?
//       </Label>
//       <Switch
//         id="help-other-agent-devs"
//         checked={preferences.helpOtherAgentDevs}
//         onCheckedChange={(checked) =>
//           handlePreferenceChange("helpOtherAgentDevs", checked)
//         }
//       />
//     </div>
//   </div>
// );

const PreferencesPage = () => {
  const [preferences, setPreferences] = useState({
    bondingCurveNotification: false,
    newsletterNotification: false,
    desiredPositions: [],
    helpBuildBasedAgent: false,
    helpOtherAgentDevs: false,
    email: "verification@example.com",
  });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const { theme, toggleTheme } = useContext(ThemeContext); // Use theme context

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = () => {
    console.log("Saving preferences:", preferences);
    // Here you would typically call an API to save the preferences
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
    setNewEmail(preferences.email);
  };

  const handleSaveEmail = () => {
    setPreferences((prev) => ({ ...prev, email: newEmail }));
    setIsEditingEmail(false);
  };

  return (
    <div className="min-h-screen bg-white ">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 ">Preferences</h1>

        <Card className="bg-gray-50  mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800 ">
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="">
                Email Address
              </Label>
              {isEditingEmail ? (
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-grow "
                  />
                  <Button
                    onClick={handleSaveEmail}
                    className="bg-blackCustom hover:bg-brownCustom border-2 border-blackCustom rounded-none text-white"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600 ">{preferences.email}</p>
                  <Button
                    className="text-black hover:text-brownCustom "
                    onClick={handleEditEmail}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
            <NotificationPreference
              label="Get notified when a token you hold hits 100% on the bonding curve"
              checked={preferences.bondingCurveNotification}
              onChange={(checked) =>
                handlePreferenceChange("bondingCurveNotification", checked)
              }
            />
            <NotificationPreference
              label="Receive email notifications from BasedAgent as well as product and protocol updates"
              checked={preferences.newsletterNotification}
              onChange={(checked) =>
                handlePreferenceChange("newsletterNotification", checked)
              }
            />
          </CardContent>
        </Card>
        {/* 
        <Card className="bg-gray-50  mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800 ">Job Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <JobPreferences
              preferences={preferences}
              handlePreferenceChange={handlePreferenceChange}
            />
          </CardContent>
        </Card> */}

        {/* <Card className="bg-gray-50 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800 ">Theme Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode-toggle" className="">
                Dark Mode
              </Label>
              <Switch
                id="dark-mode-toggle"
                checked={false} // Assuming you handle theme toggling elsewhere
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <p className="text-sm text-gray-600 ">
              Dark mode is currently {false ? "enabled" : "disabled"}.{" "}
            </p>
          </CardContent>
        </Card> */}

        <Button
          onClick={handleSavePreferences}
          className="w-full bg-blackCustom hover:bg-brownCustom border-2 border-blackCustom rounded-none text-white"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default PreferencesPage;
