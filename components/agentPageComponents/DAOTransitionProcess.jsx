import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export const DAOTransitionProcess = ({ step, setStep, onCancel, onComplete }) => {
  const [daoType, setDaoType] = useState('');
  const [daoSettings, setDaoSettings] = useState({
    votingPeriod: '',
    quorumRequirement: '',
  });

  const handleNext = () => setStep(prevStep => prevStep + 1);
  const handleBack = () => setStep(prevStep => prevStep - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-100">Select DAO Type</h3>
            <Select onValueChange={setDaoType} value={daoType}>
              <SelectTrigger className="w-full bg-gray-700 text-white">
                <SelectValue placeholder="Choose DAO type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="aragon">Aragon DAO</SelectItem>
                <SelectItem value="compound">Compound Governor</SelectItem>
                <SelectItem value="custom">Custom DAO</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleNext} disabled={!daoType}>Next</Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-100">Configure DAO Settings</h3>
            <Input
              placeholder="Voting Period (in days)"
              value={daoSettings.votingPeriod}
              onChange={(e) => setDaoSettings({ ...daoSettings, votingPeriod: e.target.value })}
              className="bg-gray-700 text-white"
            />
            <Input
              placeholder="Quorum Requirement (%)"
              value={daoSettings.quorumRequirement}
              onChange={(e) => setDaoSettings({ ...daoSettings, quorumRequirement: e.target.value })}
              className="bg-gray-700 text-white"
            />
            <div className="flex space-x-2">
              <Button onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={!daoSettings.votingPeriod || !daoSettings.quorumRequirement}>Next</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-100">Review Transition Details</h3>
            <p className="text-gray-300">DAO Type: {daoType}</p>
            <p className="text-gray-300">Voting Period: {daoSettings.votingPeriod} days</p>
            <p className="text-gray-300">Quorum Requirement: {daoSettings.quorumRequirement}%</p>
            <div className="flex space-x-2">
              <Button onClick={handleBack}>Back</Button>
              <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">Confirm Transition</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Progress value={(step / 3) * 100} className="w-full" />
      {renderStep()}
      <Button onClick={onCancel} variant="outline" className="mt-4">Cancel Transition</Button>
    </div>
  );
};