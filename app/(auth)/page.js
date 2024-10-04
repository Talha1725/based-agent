"use client";

import React, {useState, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import HowItWorksModal from "@/components/modals/HowItWorksModal";

import FeatureCard from "@/components/LandingPageComponents/FeatureCard";
import DynamicHeadline from "@/components/LandingPageComponents/DynamicHeadline";
import SimpleHeader from "@/components/LandingPageComponents/SimpleHeader";
import {useConnect} from "wagmi";
import {useAccount} from "wagmi";
import {useDisconnect} from "wagmi";
import Image from "next/image";
import HeaderLandingPage from "@/components/HeaderLandingPage";
import {toast} from "react-toastify";
import {signIn} from "next-auth/react";
import {registerUser} from "@/services/register";

import Loader from "@/components/Loader";
import JoinWaitListModal from "@/components/modals/JoinWaitListModal";
import EmailModal from "@/components/modals/emailModal";
import ConsentDialog from "@/components/ConsentDialog";
import {getReferralSource} from "@/serverActions/functions";

const LandingPage = () => {
	const router = useRouter();
	const {address, isConnected} = useAccount();
	const {disconnect} = useDisconnect();
	const account = useAccount();
	const searchParams = useSearchParams();
	
	const [showWalletModal, setShowWalletModal] = useState(false);
	const [agreeToTerms, setAgreeToTerms] = useState(false);
	
	const referralCode = searchParams.get("ref");
	const [LoginLoading, setLoginLoading] = useState(false);
	
	const [showEmailModal, setShowEmailModal] = useState(false);
	const [verificationCode, setVerificationCode] = useState("");
	const [showVerificationInput, setShowVerificationInput] = useState(false);
	const [email, setEmail] = useState("");
	const [showConsentDialog, setShowConsentDialog] = useState(false);
	const [agreeToEmails, setAgreeToEmails] = useState(false);
	const [loading, setLoading] = useState(false);
	const [referralSource, setReferralSource] = useState(null);
	
	
	const handleJoinWaitlist = () => {
		if (!isConnected) {
			toast.error('please Connect Wallet First ')
			return
		}
		setShowWalletModal(true);
	};
	
	
	const handleLogin = async () => {
		setLoginLoading(true);
		
		try {
			const res = await signIn("credentials", {
				redirect: false,
				address,
			});
			console.log('res of login', res);
			
			if (res && res.ok) {
				toast.success("Login successful!");
				router.push("/home");
			} else if (res?.error) {
				toast.error("User does not exist. Please Register");
				setLoginLoading(false);
			} else {
				toast.error("Login failed!");
				disconnect();
			}
		} catch (error) {
			toast.error("An unexpected error occurred. Please try again.");
			console.error("Login error:", error);
			disconnect();
		}
	};
	
	
	useEffect(() => {
		console.log('account.status', account.status)
		if (account.status === "connected") {
			handleLogin();
		}
	}, [account.status]);
	
	const validateForm = () => {
		console.log('email', email)
		if (!email) {
			toast.error("Please Enter Email");
			return false;
		}
		return true;
	};
	
	const handleEmailModal = () => {
		setShowEmailModal(true);
		setShowWalletModal(false);
		setAgreeToEmails(false)
	};
	
	useEffect(() => {
		const fetchReferralSource = async () => {
			const response = await getReferralSource(referralCode);
			setReferralSource(response);
			console.log("Referral Source:", response);
			if (response.error) {
				toast.error(response.error);
				return;
			}
		};
		
		if (referralCode) {
			fetchReferralSource();
		}
	}, [referralCode]);
	
	const handleGetCode = async () => {
		if (validateForm()) {
			setLoading(true)
			try {
				const response = await fetch(`/api/new-registration/get-code`, {
					method: "POST", headers: {
						"Content-Type": "application/json",
					}, body: JSON.stringify({email: email}),
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
				toast.error("An error occurred while trying to get the verification code.");
			} finally {
				setLoading(false)
			}
		}
	};
	
	const handleVerifyCode = async () => {
		setLoading(true)
		try {
			const response = await fetch(`/api/new-registration/verification`, {
				method: "POST", headers: {
					"Content-Type": "application/json",
				}, body: JSON.stringify({
					email: email, verificationCode: verificationCode, address: address, emailNotifications: agreeToEmails,
				}),
			});
			
			console.log("response of verification: " + response);
			// Check if the response is successful
			if (response.ok) {
				const data = await response.json();
				
				console.log("verification code from state: " + typeof verificationCode);
				if (data) {
					setLoginLoading(true);
					setShowEmailModal(false);
					setShowWalletModal(false);
					setLoginLoading(false);
					setShowConsentDialog(true);
				}
			} else {
				const errorData = await response.json();
				console.error("Server error:", errorData.message || errorData);
				toast.error("Verification failed. Please try again later.");
			}
		} catch (error) {
			console.error("Error during verification:", error);
			toast.error("An error occurred while verifying the code. Please try again.");
		} finally {
			setLoading(false)
		}
	};
	
	const handleConsentSubmit = async (e) => {
		e.preventDefault();
		setLoginLoading(true); // Start LoginLoading spinner
		try {
			const response = await registerUser({
				email, walletAddress: address, emailNotifications: agreeToEmails, referralSourceId: referralSource?.id
			});
			
			if (response.error) {
				toast.error(response.error);
				setLoginLoading(false);
				return;
			}
			
			toast.success("User Registered Successfully");
			setShowConsentDialog(false); // Close the dialog after successful registration
			handleLogin();
		} catch (error) {
			console.error("Error:", error);
			toast.error(error.message || "Something went wrong");
			setLoginLoading(false);
		}
	};
	
	const handleSkipEmail = () => {
		setShowConsentDialog(false);
		handleLogin(); // Redirect to login page when the verification skips
	};
	
	
	return (
		<>
			{LoginLoading ? (
				<Loader message="Signing in..."/>
			) : (
				<div className=" relative">
					<HeaderLandingPage/>
					
					<div className="absolute top-0 left-0 -z-10 hidden lg:block">
						<Image
							className="w-full h-full object-cover"
							src="/Cover.svg"
							alt="BasedAgent Logo"
							width={1200}
							height={1200}
						/>
					</div>
					
					<div className="flex flex-col-reverse md:flex-row items-center md:justify-center md:gap-10 md:p-10">
						<div className="hidden md:block w-full md:w-[50%] mx-auto">
							<Image
								className="w-full h-full object-cover"
								src="/banner.png"
								alt="BasedAgent Logo"
								width={800}
								height={800}
							/>
						</div>
						
						<div className="w-full md:w-[50%] lg:ml-20  text-center md:text-left px-5 md:px-0">
							<div className="px-4 py-16 text-blackCustom">
								<h2 className="text-3xl sm:text-6xl md:text-7xl font-semibold -mt-8 uppercase">
									Launching the next era of AI
								</h2>
								<p className="text-2xl md:mb-8 text-gray-500 mt-8">
									Join the waitlist to access BasedAgents before everyone else.
								</p>
								
								<div className=" w-full my-4 md:hidden mx-auto">
									<Image
										className="w-full h-full object-cover"
										src="/banner.png"
										alt="BasedAgent Logo"
										width={800}
										height={800}
									/>
								</div>
								
								<div className="flex flex-col sm:flex-row gap-4 lg:mt-20">
									<Button
										onClick={handleJoinWaitlist}
										size="lg"
										className="border-2 text-wrap border-black border-b-8 rounded-none text-blackCustom py-6 px-4 text-xl hover:bg-brownCustom"
									>
										Sign Up to join Waitlist
									</Button>
									<HowItWorksModal/>
								</div>
							</div>
						</div>
					</div>
					
					<JoinWaitListModal
						showWalletModal={showWalletModal}
						setShowWalletModal={setShowWalletModal}
						agreeToTerms={agreeToTerms}
						setAgreeToTerms={setAgreeToTerms}
						handleEmailModal={handleEmailModal}
					/>
					
					<EmailModal
						referralEmail={referralSource?.email || null}
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
					
					
					<ConsentDialog
						loading={loading}
						showConsentDialog={showConsentDialog}
						setShowConsentDialog={setShowConsentDialog}
						email={email}
						setEmail={setEmail}
						agreeToEmails={agreeToEmails}
						setAgreeToEmails={setAgreeToEmails}
						handleConsentSubmit={handleConsentSubmit}
						handleSkipEmail={handleSkipEmail}
					/>
				
				
				</div>
			
			)}
		</>
	
	);
};

export default LandingPage;
