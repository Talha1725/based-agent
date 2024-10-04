"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Twitter, Facebook, Linkedin, Copy } from "lucide-react";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const columns = [
  { key: "name", label: "Name" },
  { key: "wallet", label: "Wallet" },
  { key: "status", label: "Status" },
  { key: "inviteDate", label: "Invite Date" },
];

const WelcomeReferralsPage = () => {
  const { data: session, status } = useSession();
  const [referralLink, setReferralLink] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const id = session?.user?.id;

  useEffect(() => {
    if (!id) return;

    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/referrals/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.referredUsers);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [id]);

  const copyReferralLink = async () => {
    const referralCode = session?.user?.referralCode;
    const baseUrl = window.location.origin;

    try {
      await navigator.clipboard.writeText(
        `${baseUrl}?ref=${referralCode}`
      );
      toast.success("Text Copied Successfully");
    } catch (error) {
      toast.error("Failed to copy text");
      console.error("Error copying to clipboard:", error);
    }
  };

  const shareOnSocialMedia = (platform) => {
    if (!referralLink) return toast.error("Referral link is not available");

    let shareUrl;
    const message = encodeURIComponent(
      "Join me on BasedAgent and get early access!"
    );

    switch (platform) {
      case "X":
        shareUrl = `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(
          referralLink
        )}`;
        break;
      case "discord":
        shareUrl = `https://www.discord.com/sharer/sharer.php?u=${encodeURIComponent(
          referralLink
        )}`;
        break;
      case "github":
        shareUrl = `https://www.github.com/shareArticle?mini=true&url=${encodeURIComponent(
          referralLink
        )}&title=${message}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  useEffect(() => {
    if (status === "authenticated") {
      setReferralLink(
        `${window.location.origin}?ref=${session?.user?.referralCode}`
      );
    }
  }, [status, session]);
  console.log(session?.user?.rank);
  if (loading) return <Loader message="loading..." />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-white text-gray-800 mb-8 rounded-none border-2 border-black">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-4">Welcome to BasedAgents</h1>
            <p className="text-xl mb-4">
              You are now #{session?.user?.rank} on the waitlist.
            </p>
            <p className="text-lg mb-4">
              Share your referral link to move up and gain earlier access!
            </p>
            <div className="flex space-x-2 mb-4">
              <Input
                value={referralLink}
                readOnly
                className="bg-transparent border-2 border-black rounded-none text-gray-800 flex-grow"
              />
              <Button
                onClick={copyReferralLink}
                className="bg-blackCustom hover:bg-brownCustom text-white rounded-none border-2 border-black"
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
            <div className="flex flex-col flex-wrap md:flex-row gap-4">
              <Button
                onClick={() => shareOnSocialMedia("X")}
                className="bg-silverCustom hover:bg-brownCustom hover:text-white rounded-none border-2 border-black text-blackCustom"
              >
                <FaXTwitter
                  className=" text-blackCustom hover:text-brownCustom"
                  size={25}
                />
                Share on X
              </Button>
              <Button
                onClick={() => shareOnSocialMedia("discord")}
                className="bg-silverCustom hover:bg-brownCustom hover:text-white rounded-none border-2 border-black text-blackCustom"
              >
                <FaDiscord
                  className=" text-blackCustom hover:text-brownCustom"
                  size={25}
                />
                Share on Discord
              </Button>
              <Button
                onClick={() => shareOnSocialMedia("github")}
                className="bg-silverCustom hover:bg-brownCustom hover:text-white rounded-none border-2 border-black text-blackCustom"
              >
                <FaGithub
                  className="text-blackCustom hover:text-brownCustom"
                  size={25}
                />
                Share on GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm rounded-none border-2 border-black">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Your Referrals
            </h2>
            <table className="w-full">
              <thead>
                <tr>
                  {columns.map(({ key, label }) => (
                    <th
                      key={key}
                      className="text-left text-gray-600 font-bold py-5 border-b border-silverCustom"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {columns.map(({ key }) => (
                      <td
                        key={key}
                        className="text-gray-800 py-5  border-b border-silverCustom"
                      >
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-8 text-right">
              <p className="text-xl font-bold text-brownCustom ">
                Total Referrals:{" "}
                <span className="text-blackCustom">{data.length}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeReferralsPage;
