"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ReferredByModal = ({
  email,
  showReferredByModal,
  setShowReferredByModal,
  handleNext,
}) => {
  console.log("data passed in reference Modal : ", {
    email,
    handleNext,
    showReferredByModal,
    setShowReferredByModal,
  });

  return (
    <Dialog open={showReferredByModal} onOpenChange={setShowReferredByModal}>
      <DialogContent className="bg-white text-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            You Are Referred By {email}
          </DialogTitle>
        </DialogHeader>
        <Button
          onClick={handleNext}
          className="bg-blackCustom text-white p-2 rounded-none border-2 border-black hover:bg-brownCustom"
        >
          Next
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ReferredByModal;
