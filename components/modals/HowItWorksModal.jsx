import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const HowItWorksModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-2 border-black border-b-8 rounded-none text-blackCustom py-6 px-4 text-xl hover:bg-brownCustom">
          How it Works
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-4">How It Works</DialogTitle>
        </DialogHeader>
        <ol className="list-decimal list-inside text-left max-w-md mx-auto text-xl">
          <li className="mb-2">Connect your web3 wallet.</li>
          <li className="mb-2">Secure your spot on the waitlist.</li>
          <li className="mb-2">Invite others to move up the queue.</li>
          <li>Gain early access to testnet and mainnet releases.</li>
        </ol>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksModal;
