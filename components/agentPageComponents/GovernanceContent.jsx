import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Switch from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ExternalLink } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const GovernanceContent = () => {
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [roleAddresses, setRoleAddresses] = useState({
    aiAgentWallet: '',
    aiContributorWallet: '',
    tokenContractOwner: '',
    aiAgentSmartContractOwner: '',
  });
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [autopilotType, setAutopilotType] = useState('full');
  const [customAutopilotAddress, setCustomAutopilotAddress] = useState('');

  const currentOwnerAddress = '0x1234...5678'; // Replace with actual owner address

  const handleOwnershipTransfer = () => {
    console.log('Transferring ownership to:', newOwnerAddress);
    // Implement the actual ownership transfer logic here
  };

  const handleRoleAddressChange = (role, address) => {
    setRoleAddresses(prev => ({ ...prev, [role]: address }));
  };

  const handleSaveRoles = () => {
    console.log('Saving role addresses:', roleAddresses);
    // Implement the logic to save role addresses
  };

  const handleAutopilotToggle = () => {
    setAutopilotEnabled(!autopilotEnabled);
  };

  const handleAutopilotSave = () => {
    console.log('Saving Autopilot settings:', { enabled: autopilotEnabled, type: autopilotType, customAddress: customAutopilotAddress });
    // Implement the logic to save Autopilot settings
  };

  const getAutopilotConfirmationMessage = () => {
    const baseMessage = "Enabling Autopilot will transition the setup to a multisig system. This means:\n\n" +
      "• The current wallet will be converted to a multisig wallet.\n" +
      "• The Autopilot will be added as a signer to this multisig.\n";

    if (autopilotType === 'full') {
      return baseMessage +
        "• The Autopilot will have full control over the Agent's wallet and configuration.\n\n" +
        "WARNING: Full Autopilot mode is irreversible. Once enabled, it cannot be disabled or modified.";
    } else if (autopilotType === 'semi') {
      return baseMessage +
        "• The Autopilot will create proposals for actions, but these will require approval from other multisig signers.\n" +
        "• You will need to add additional human signers to the multisig for approving Autopilot proposals.";
    } else {
      return baseMessage +
        "• The custom Autopilot agent will be integrated into the multisig system based on its specific configuration.\n" +
        "• Please ensure you understand the implications of using a custom Autopilot agent.";
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white/50  backdrop-blur-sm border-2 border-black rounded-none">
        <CardHeader>
          <CardTitle className="text-gray-800 ">Governance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600  mb-4">
            Current Owner:
            <a
              href={`https://etherscan.io/address/${currentOwnerAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blackCustom font-black hover:underline ml-2 inline-flex items-center"
            >
              {currentOwnerAddress}
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </p>

          <div className="space-y-4">
            <Input
              placeholder="New owner address"
              value={newOwnerAddress}
              onChange={(e) => setNewOwnerAddress(e.target.value)}
              className="bg-white/50  text-gray-800 "
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-blackCustom hover:bg-brownCustom rounded-none border-2 border-black text-white">Transfer Ownership</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white  text-gray-800 ">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Ownership Transfer</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 ">
                    This action is irreversible. Are you sure you want to transfer ownership to {newOwnerAddress}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-200 text-gray-800 ">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleOwnershipTransfer} className="bg-blackCustom hover:bg-brownCustom rounded-none border-2 border-black text-white">
                    Confirm Transfer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <Label htmlFor="advanced-mode" className="text-gray-700 ">Advanced Mode</Label>
              <Switch
                id="advanced-mode"
                checked={isAdvancedMode}
                onCheckedChange={setIsAdvancedMode}
              />
            </div>
            {isAdvancedMode && (
              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 ">Role-Based Access Control</h3>
                {Object.entries(roleAddresses).map(([role, address]) => (
                  <div key={role}>
                    <Label htmlFor={role} className="text-gray-700  capitalize">{role.replace(/([A-Z])/g, ' $1').trim()}</Label>
                    <Input
                      id={role}
                      value={address}
                      onChange={(e) => handleRoleAddressChange(role, e.target.value)}
                      placeholder={`Enter ${role} address`}
                      className="bg-white/50  text-gray-800  mt-1"
                    />
                  </div>
                ))}
                <Button onClick={handleSaveRoles} className="w-full bg-blackCustom hover:bg-brownCustom rounded-none border-2 border-black text-white">
                  Save Role Addresses
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Card className="bg-white/50  backdrop-blur-sm rounded-none border-2 border-black">
              <CardHeader>
                <CardTitle className="text-gray-800 ">Autopilot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blackCustom rounded-none border-2 border-black p-4 mb-4">
                  <h4 className="text-white font-black mb-2">Warning: Experimental Feature</h4>
                  <p className="text-white text-sm">
                    Autopilot is a highly experimental feature that grants significant control to an AI system. When enabled, Autopilot will have full access to the AI Agent's wallet, including the ability to:
                  </p>
                  <ul className="list-disc list-inside text-white text-sm mt-2">
                    <li>Spend funds from the wallet autonomously</li>
                    <li>Add new signers to the wallet</li>
                    <li>Remove existing signers from the wallet</li>
                    <li>Modify all configuration options of the Agent</li>
                  </ul>
                  <p className="text-white text-sm mt-2">
                    Use with extreme caution and at your own risk. We recommend thoroughly testing in a controlled environment before activation.
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="enable-autopilot" className="text-gray-800  font-semibold">Enable Autopilot</Label>
                  <Switch
                    id="enable-autopilot"
                    checked={autopilotEnabled}
                    onCheckedChange={handleAutopilotToggle}
                  />
                </div>

                {autopilotEnabled && (
                  <div className="space-y-4">
                    <RadioGroup value={autopilotType} onValueChange={setAutopilotType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="full-autopilot" />
                        <Label htmlFor="full-autopilot" className="text-gray-700 ">Full Autopilot</Label>
                      </div>
                      <p className="text-sm text-gray-600  ml-6">Full autonomy for all decisions and actions. The Autopilot has complete control over the Agent's wallet and configuration.</p>
                      <p className="text-sm text-gray-600  ml-6">Wallet Address: 0x1234...5678 <a href="#" className="text-blackCustom font-black hover:underline">View on GitHub</a></p>

                      <div className="flex items-center space-x-2 mt-4">
                        <RadioGroupItem value="semi" id="semi-autopilot" />
                        <Label htmlFor="semi-autopilot" className="text-gray-700 ">Semi Autopilot</Label>
                      </div>
                      <p className="text-sm text-gray-600  ml-6">The Autopilot creates proposals for actions, but requires approval from other multisig signers before execution.</p>
                      <p className="text-sm text-gray-600  ml-6">Wallet Address: 0xabcd...efgh <a href="#" className="text-blackCustom font-black hover:underline">View on GitHub</a></p>

                      <div className="flex items-center space-x-2 mt-4">
                        <RadioGroupItem value="custom" id="custom-autopilot" />
                        <Label htmlFor="custom-autopilot" className="text-gray-700 ">Custom</Label>
                      </div>
                      <p className="text-sm text-gray-600  ml-6">Use a custom agent for decision-making. You'll need to specify the wallet address of the custom Autopilot agent.</p>
                    </RadioGroup>

                    {autopilotType === 'custom' && (
                      <Input
                        placeholder="Enter custom Autopilot wallet address"
                        value={customAutopilotAddress}
                        onChange={(e) => setCustomAutopilotAddress(e.target.value)}
                        className="bg-white/50  text-gray-800 "
                      />
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full bg-blackCustom hover:bg-brownCustom rounded-none border-2 border-black text-white">
                          Save Autopilot Settings
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white  text-gray-800 ">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Autopilot Setup</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600 ">
                            {getAutopilotConfirmationMessage()}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-200 text-gray-800 ">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleAutopilotSave} className="bg-blackCustom hover:bg-brownCustom rounded-none border-2 border-black text-white">
                            Confirm Setup
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};