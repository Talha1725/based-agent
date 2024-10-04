"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const newRegister = () => {
  const [showDialog, setShowDialog] = useState(true);
  const [email, setEmail] = useState(""); // assuming you have this state
  const [verificationCode, setVerificationCode] = useState("");

  const handleGetCode = () => {
    // function for sending code
  };

  return (
    <>
      <Dialog open={showDialog}>
        <DialogContent className="bg-white text-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Referral Registration
            </DialogTitle>
            <DialogDescription className="text-gray-900">
              Please Enter your Email
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Label htmlFor="email" className="text-sm text-gray-700">
              Email:
            </Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded-none w-full"
                placeholder="Enter your email"
              />
              <Button
                onClick={handleGetCode}
                className="bg-blackCustom text-white p-2 rounded-none border-2 border-black hover:bg-brownCustom whitespace-nowrap"
              >
                Send Code
              </Button>
            </div>
            <div>
              <Input id="verificationCode" value={verificationCode} />
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleGetCode}
                className="bg-blackCustom text-white p-2 rounded-none border-2 border-black hover:bg-brownCustom"
              >
                Register
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default newRegister;
