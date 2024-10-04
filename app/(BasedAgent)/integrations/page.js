"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Github, MessageSquare, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState({
    github: { connected: false, profile: "", username: "" },
    telegram: { connected: false, profile: "", username: "" },
  });

  const handleConnect = (service) => {
    console.log(`Connecting to ${service}`);
    const profiles = {
      github: "johndoe",
      telegram: "@jane_doe",
    };
    setIntegrations({
      ...integrations,
      [service]: {
        connected: true,
        profile: `https://${service}.com/${profiles[service]}`,
        username: profiles[service],
      },
    });
  };

  const handleDisconnect = (service) => {
    console.log(`Disconnecting from ${service}`);
    setIntegrations({
      ...integrations,
      [service]: { connected: false, profile: "", username: "" },
    });
  };

  const handleSave = () => {
    console.log("Saving integrations:", integrations);
  };

  const renderServiceButton = (service, icon) => (
    <div>
      <Label
        htmlFor={service}
        className="flex items-center  text-gray-700 mb-2"
      >
        {icon}
        {service.charAt(0).toUpperCase() + service.slice(1)}
        {(service === "github" || service === "telegram") && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4  text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className=" bg-white text-gray-800 border-gray-200 max-w-xs">
                {service === "github" ? (
                  <p>
                    When authenticated, this will pull in data from GitHub for
                    analytics purposes that will be displayed on your public
                    profile.
                  </p>
                ) : (
                  <p>
                    When authenticated, this allows you to receive messages from
                    BasedAgent directly on your Telegram. It also allows other
                    community members to message you through the Telegram
                    application.
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Label>
      {integrations[service].connected ? (
        <div className="flex items-center mt-2">
          <span className="text-blackCustom mr-2">Connected</span>
          <a
            href={integrations[service].profile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blackCustom hover:text-brownCustom mr-2"
          >
            {integrations[service].username}
          </a>
          <Button
            onClick={() => handleDisconnect(service)}
            variant="destructive"
            size="sm"
            className="rounded-none border-2 border-blackCustom text-white bg-blackCustom hover:bg-brownCustom"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => handleConnect(service)}
          className="mt-2 rounded-none border-2 border-blackCustom text-white bg-blackCustom hover:bg-brownCustom"
        >
          Connect {service.charAt(0).toUpperCase() + service.slice(1)}
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen  bg-white text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Integrations</h1>
          <Card className="mb-8  bg-white">
            <CardHeader>
              <CardTitle className="text-gray-800">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderServiceButton(
                "github",
                <Github className="mr-2 h-4 w-4" />
              )}
              {renderServiceButton(
                "telegram",
                <MessageSquare className="mr-2 h-4 w-4" />
              )}
            </CardContent>
          </Card>

          <Button
            onClick={handleSave}
            className="rounded-none border-2 border-blackCustom text-white bg-blackCustom hover:bg-brownCustom w-full"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
