// pages/register.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { registerUser } from "@/services/register";
import ConsentDialog from "@/components/ConsentDialog"; // Importing the new dialog component
import { useSearchParams } from "next/navigation";
import { getReferralSource } from "@/serverActions/functions";
import { LoaderCircle } from "lucide-react";
import ReferredByModal from "@/components/modals/referredBymodal";
import WalletModal from "@/components/modals/JoinWaitListModal";
import EmailModal from "@/components/modals/emailModal";
import Loader from "@/components/Loader";
import Image from "next/image";

const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [agreeToEmails, setAgreeToEmails] = useState(false);
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [showReferredByModal, setShowReferredByModal] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [loadingReferralSource, setLoadingReferralSource] = useState(
    referralCode ? true : false
  );
  const [referralSource, setReferralSource] = useState(null);

  const router = useRouter();
  const { address, isConnected } = useAccount();

  const handleConsentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner
    try {
      const response = await registerUser({
        // username,
        email,
        // password,
        walletAddress: address,
        emailNotifications: agreeToEmails,
      });

      if (response.error) {
        toast.error(response.error);
        setLoading(false);
        return;
      }

      toast.success("User Registered Successfully");
      setShowConsentDialog(false); // Close the dialog after successful registration
      handleLogin();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong");
      setLoading(false);
    }
  };
  // Handling skip email option
  const handleSkipEmail = () => {
    setShowConsentDialog(false);
    handleLogin(); // Redirect to login page when the verification skips
  };
  const handleEmailModal = async () => {
    setShowEmailModal(true);
    setShowWalletModal(false);
  };
  const handleVerifyCode = async () => {
    setShowConsentDialog(true);
    try {
      const response = await fetch(`/api/new-registration/verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          verificationCode: verificationCode,
          address: address,
          emailNotifications: agreeToEmails,
        }),
      });

      console.log("response of verification: " + response);
      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();

        console.log("verification code from state: " + typeof verificationCode);
        if (data) {
          toast.success("Verification successful!");
          setLoading(true);
          setShowEmailModal(false);
          setShowWalletModal(false);
          handleLogin();
          setLoading(false);
        } else {
          toast.error("Invalid verification code. Please try again.");
        }
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData.message || errorData);
        toast.error("Verification failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error(
        "An error occurred while verifying the code. Please try again."
      );
    }
  };

  const handleGetCode = async () => {
    if (!validateForm()) {
      try {
        const response = await fetch(`/api/new-registration/get-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        });

        // Check if the response is successful
        if (response.ok) {
          const data = await response.json();
          setShowVerificationInput(true);
          console.log("Response of registering User:", data);
        } else {
          // Handle response errors
          const errorData = await response.json();
          console.error("Error:", errorData);
          toast.error("Failed to get the verification code.");
        }
      } catch (error) {
        console.error("Error fetching the verification code:", error);
        toast.error(
          "An error occurred while trying to get the verification code."
        );
      }
    } else {
      toast.error("Please enter a valid email.");
    }
  };
  const handleWalletConnected = async () => {
    if (agreeToTerms) {
      try {
        toast.success("Wallet Connected");
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      toast.error("Please agree to the terms and conditions to continue.");
      return;
    }
    setShowEmailModal(true);
  };

  const validateForm = () => {
    if (!email || !email.includes("@")) {
      toast.error("Invalid email format");
      return false;
    }
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return false;
    }
    return true;
  };

  // Fetching referral source data
  useEffect(() => {
    const fetchReferralSource = async () => {
      setLoadingReferralSource(true);
      const response = await getReferralSource(referralCode);
      setReferralSource(response);
      console.log("Referral Source:", response);
      if (response.error) {
        toast.error(response.error);
        setLoadingReferralSource(false);
        return;
      }
      setLoadingReferralSource(false);
    };

    if (referralCode) {
      fetchReferralSource();
    }
  }, [referralCode]);
	
  const handelNext = async () => {
    setShowReferredByModal(false);
    setShowWalletModal(true);
  };

  if (loadingReferralSource) {
    return <Loader message="Loading..." />;
  }
  return (
    <>
      <ReferredByModal
        email={referralSource.email}
        showReferredByModal={showReferredByModal}
        setShowReferredByModal={setShowReferredByModal}
        handleNext={handelNext}
      />
      <WalletModal
        showWalletModal={showWalletModal}
        setShowWalletModal={setShowWalletModal}
        agreeToTerms={agreeToTerms}
        setAgreeToTerms={setAgreeToTerms}
        handleWalletConnected={handleWalletConnected}
        handleEmailModal={handleEmailModal}
      />
      {showEmailModal && (
        <EmailModal
          showEmailModal={showEmailModal}
          setShowEmailModal={setShowEmailModal}
          email={email}
          setEmail={setEmail}
          showVerificationInput={showVerificationInput}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handleGetCode={handleGetCode}
          handleVerifyCode={handleVerifyCode}
          showConsentDialog={showConsentDialog}
          loading={loading}
          agreeToEmails={agreeToEmails}
          setAgreeToEmails={setAgreeToEmails}
          handleConsentSubmit={handleConsentSubmit}
          handleSkipEmail={handleSkipEmail}
          setShowConsentDialog={setShowConsentDialog}
        />
      )}
    </>
  );
};

export default Register;
