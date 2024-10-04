"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { useSession } from "next-auth/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: session, status } = useSession();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
    const res = await signIn("credentials", {
      redirect: false,
      // email,
      // password,
      address,
    });

    setLoading(false); // Stop loading after response

    if (res.error) {
      setError(res.error);
      toast.error("Login failed: " + res.error); // Show error toast
    } else {
      toast.success("Login successful!"); // Show success toast
      router.push("/"); // Redirect to the homepage after success
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true); // Set loading for social login
    const res = await signIn(provider);

    setLoading(false); // Stop loading after response

    if (res.error) {
      setError("Failed to sign in with GitHub");
      toast.error("Failed to sign in with GitHub"); // Show error toast for GitHub
    } else {
      toast.success("Signed in successfully!"); // Show success toast
      router.push("/");
    }
  };

  // if loading or session is pending return loading spinner

  if (loading || status === "loading") {
    return <Loader message="Signing in..." />;
  }

  return (
    <>
      <div className="flex min-h-screen items-left justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm border border-gray-300 p-8 shadow-md bg-white">
          <div className="text-left">
            <h2 className="text-5xl font-bold text-gray-800">Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 py-10">
            {error && <p className="text-red-600">{error}</p>}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className="bg-white-50 text-gray-800 border-2 border-black shadow-lg rounded-none"
                disabled={loading} // Disable input during loading
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                className="bg-white-50 text-gray-800 border-2 border-black shadow-lg rounded-none"
                disabled={loading} // Disable input during loading
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blackCustom text-white hover:bg-brownCustom hover:text-white rounded-none border-2 border-black shadow-lg"
              disabled={loading} // Disable button during loading
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="my-4 flex items-center">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <div className="space-y-4 mt-6">
              <Button
                className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 rounded-none"
                onClick={() => handleSocialLogin("github")} // Use GitHub provider
                disabled={loading} // Disable button during loading
              >
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4" /> Continue with GitHub
                  </>
                )}
              </Button>
            </div>

            <div className="text-center mt-4">
              <span className="text-gray-600">Don't have an account?</span>
              <Link
                href="/register"
                className="text-black-600 hover:underline ml-1"
              >
                Register
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
                  ? "  flex justify-center items-center p-2"
                  : "flex justify-center items-center p-2"
              }`}
            >
              <w3m-button />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
