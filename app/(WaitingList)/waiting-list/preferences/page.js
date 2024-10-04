"use client";
import React, {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Switch from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useSession} from "next-auth/react";
import {toast} from "react-toastify";
import Loader from "@/components/Loader";

const NotificationPreference = ({label, checked, onChange}) => (
	<div className="flex items-center justify-between">
		<Label
			className="text-black "
			htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
		>
			{label}
		</Label>
		<Switch
			className="bg-gray-300 data-[state=checked]:bg-blackCustom"
			id={label.toLowerCase().replace(/\s+/g, "-")}
			checked={checked}
			onChange={(e) => onChange(e.target.checked)}
		/>
	</div>
);

const PreferencesPage = () => {
	const {data: session} = useSession();
	
	const [preferences, setPreferences] = useState({
		email: "",
		newsLetterNotification: false,
		bondingCurveNotification: false,
	});
	
	const [originalPreferences, setOriginalPreferences] = useState(null);
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [newEmail, setNewEmail] = useState(session?.user?.email);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	
	// Fetch preferences when session is available
	useEffect(() => {
		const fetchPreferences = async () => {
			setLoading(true);
			try {
				if (session?.user?.id) {
					const res = await fetch(`/api/preferences?userId=${session.user.id}`);
					if (!res.ok) {
						throw new Error("Failed to fetch preferences");
					}
					const {preference} = await res.json();
					if (preference && preference.length > 0) {
						const pref = preference[0];
						const initialPreferences = {
							email: pref.preferenceEmail,
							newsLetterNotification: pref.emailNotification,
							bondingCurveNotification: pref.tokenHitting,
						};
						console.log("Fetched preferences", pref);
						setPreferences(initialPreferences);
						setOriginalPreferences(initialPreferences); // Store original preferences
					}
				}
			} catch (error) {
				console.error("Error fetching preferences:", error);
			} finally {
				setLoading(false);
			}
		};
		
		fetchPreferences();
	}, [session]);
	
	const handlePreferenceChange = (key, value) => {
		setPreferences((prev) => ({...prev, [key]: value}));
	};
	
	const handleSavePreferences = async () => {
		setLoading(true);
		try {
			if (!session?.user?.id) {
				toast.error("Session expired, please log in again.");
				return;
			}
			
			const updatedPreferences = {
				userId: session?.user?.id,
				preferenceEmail: preferences.email,
				emailNotification: preferences.newsLetterNotification,
				tokenHitting: preferences.bondingCurveNotification,
			};
			
			const response = await fetch(`/api/preferences`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedPreferences),
			});
			
			if (!response.ok) {
				throw new Error("Failed to save preferences");
			}
			
			const result = await response.json();
			toast.success("Preferences saved successfully.");
			console.log("Preferences saved successfully:", result);
			setOriginalPreferences(preferences); // Update original preferences after saving
		} catch (error) {
			setError(error);
			toast.error("Error saving preferences: " + error.message);
			console.error("Error saving preferences:", error);
		} finally {
			setLoading(false);
		}
	};
	
	const handleEditEmail = () => {
		setIsEditingEmail(true);
		setNewEmail(preferences.email);
	};
	
	const handleSaveEmail = () => {
		if (newEmail) {
			setPreferences((prev) => ({...prev, email: newEmail}));
			setIsEditingEmail(false);
		}
	};
	
	const hasChanges = JSON.stringify(preferences) !== JSON.stringify(originalPreferences);
	
	return (
		<>
			{loading ? (
				<Loader message="loading..."/>
			) : (
				<div className="min-h-screen bg-whiteCustom">
					<div className="container mx-auto px-4 py-8 max-w-3xl">
						<h1 className="text-3xl font-bold mb-8 text-black">Preferences</h1>
						
						<Card className="bg-white text-gray-800 mb-8 rounded-none border-2 border-black">
							<CardHeader>
								<CardTitle className="text-gray-800 ">
									Email Notifications
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="email" className="text-black">
										Email Address
									</Label>
									{isEditingEmail ? (
										<div className="flex space-x-2">
											<Input
												id="email"
												type="email"
												value={newEmail}
												onChange={(e) => setNewEmail(e.target.value)}
												placeholder="Enter your email address"
												className="flex-grow"
											/>
											<Button
												onClick={handleSaveEmail}
												className="bg-blackCustom hover:bg-brownCustom text-white rounded-none border-2 border-black"
											>
												Save
											</Button>
										</div>
									) : (
										<div className="flex items-center space-x-2">
											<p className="text-gray-600 font-jetbrains">
												{preferences.email}
											</p>
											<Button
												className="text-black hover:text-brownCustom"
												onClick={handleEditEmail}
											>
												Edit
											</Button>
										</div>
									)}
								</div>
								<NotificationPreference
									label="Get notified when a token you hold hits 100% on the bonding curve"
									checked={preferences.bondingCurveNotification}
									onChange={(checked) =>
										handlePreferenceChange("bondingCurveNotification", checked)
									}
								/>
								<NotificationPreference
									label="Receive email notifications from BasedAgent as well as product and protocol updates"
									checked={preferences.newsLetterNotification}
									onChange={(checked) =>
										handlePreferenceChange("newsLetterNotification", checked)
									}
								/>
							</CardContent>
						</Card>
						
						<Button
							onClick={handleSavePreferences}
							disabled={!hasChanges || loading}
							className={`w-full ${
								hasChanges && !loading
									? "bg-blackCustom hover:bg-brownCustom text-white"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							} rounded-none border-2 border-black`}
						>
							{loading ? "Saving Preferences..." : "Save Preferences"}
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default PreferencesPage;
