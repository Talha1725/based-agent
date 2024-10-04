// pages/register.tsx

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { registerUser } from "@/services/register";
import ConsentDialog from "@/components/ConsentDialog"; // Importing the new dialog component

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [agreeToEmails, setAgreeToEmails] = useState(false);

  const router = useRouter();
  const { address, isConnected } = useAccount();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validateForm = () => {
    if (!username) {
      toast.error("Username is required");
      return false;
    }
    if (!email || !email.includes("@")) {
      toast.error("Invalid email format");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!isConnected) {
      toast.error("Please connect your wallet");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Show the consent dialog after successful form validation
    setShowConsentDialog(true);
  };

  // Handling consent dialog submission
  const handleConsentSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading spinner
    try {
      const response = await registerUser({
        username,
        email,
        password,
        walletAddress: address,
        emailNotifications: agreeToEmails, // Store email consent value
      });

      if (response.error) {
        toast.error(response.error);
        setLoading(false);
        return;
      }

      toast.success("User Registered Successfully");
      setShowConsentDialog(false); // Close the dialog after successful registration
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  // Handling skip email option
  const handleSkipEmail = () => {
    setShowConsentDialog(false);
    router.push("/login"); // Redirect to login page when the verification skips
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm border border-gray-300 p-8 rounded-lg shadow-md bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Waiting Referral Register
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-800">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                className="bg-gray-50 text-gray-800 border border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className="bg-gray-50 text-gray-800 border border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className="bg-gray-50 text-gray-800 border border-gray-300"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-800">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="bg-gray-50 text-gray-800 border border-gray-300"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <div className="text-center mt-4">
              <span className="text-gray-600">Already have an account?</span>
              <Link
                href="/login"
                className="text-blue-600 hover:underline ml-1"
              >
                Login
              </Link>
            </div>

            <div className="my-4 flex items-center">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500">Connected Wallet</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <div
              className={`${
                isConnected
                  ? "rounded-lg shadow-md border border-gray-300 flex justify-center items-center p-2"
                  : "flex justify-center items-center p-2"
              }`}
            >
              <w3m-button />
            </div>
          </form>
        </div>
      </div>

      {/* Using the ConsentDialog */}
      <ConsentDialog
        showConsentDialog={showConsentDialog}
        setShowConsentDialog={setShowConsentDialog}
        email={email}
        setEmail={setEmail}
        agreeToEmails={agreeToEmails}
        setAgreeToEmails={setAgreeToEmails}
        handleConsentSubmit={handleConsentSubmit}
        handleSkipEmail={handleSkipEmail}
      />
    </>
  );
};

export default Register;
