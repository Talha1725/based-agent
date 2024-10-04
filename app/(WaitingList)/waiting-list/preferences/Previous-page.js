"use client";
import React, {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Switch from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
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
			onChange={onChange}
		/>
	</div>
);

// const JobPreferences = ({ preferences, handlePreferenceChange }) => (
//   <div className="space-y-4">
//     <div>
//       <Label htmlFor="desired-positions" className="mb-2 block text-black">
//         Desired Positions
//       </Label>

//       <Select
//         className="rounded-none"
//         id="desired-positions"
//         value={preferences.desiredPositions}
//         onValueChange={(value) =>
//           handlePreferenceChange("desiredPositions", value)
//         }
//       >
//         <SelectTrigger className="w-full rounded-none">
//           <SelectValue
//             className="text-black "
//             placeholder="Add desired positions"
//           />
//         </SelectTrigger>
//         <SelectContent className="bg-white rounded-none">
//           <SelectItem value="frontend">Frontend Developer</SelectItem>
//           <SelectItem value="backend">Backend Developer</SelectItem>
//           <SelectItem value="fullstack">Full Stack Developer</SelectItem>
//           <SelectItem value="ai">AI Engineer</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//     <div className="flex items-center justify-between">
//       <Label className="text-black" htmlFor="help-build-basedagent">
//         Are you available to help develop and build BasedAgent?
//       </Label>

//       <Switch
//         className="bg-gray-300 data-[state=checked]:bg-blackCustom"
//         id="help-build-basedagent"
//         checked={preferences.helpBuildBasedAgent}
//         onCheckedChange={(checked) =>
//           handlePreferenceChange("helpBuildBasedAgent", checked)
//         }
//       />
//     </div>
//     <div className="flex items-center justify-between">
//       <Label className="text-black" htmlFor="help-other-agent-devs">
//         Are you available to help other Agent Devs build their own Agents?
//       </Label>
//       <Switch
//         className="bg-gray-300 data-[state=checked]:bg-blackCustom"
//         id="help-other-agent-devs"
//         checked={preferences.helpOtherAgentDevs}
//         onCheckedChange={(checked) =>
//           handlePreferenceChange("helpOtherAgentDevs", checked)
//         }
//       />
//     </div>
//   </div>
// );

const PreferencesPage = () => {
	const {data: session} = useSession();
	
	const [preferences, setPreferences] = useState({
		email: "",
		newsLetterNotification: false,
		bondingCurveNotification: false,
	});
	
	useEffect(() => {
		// Define an async function to fetch preferences
		const fetchPreferences = async () => {
			setLoading(true)
			try {
				if (session?.user?.id) {
					// Fetch preferences from the API
					const res = await fetch(`/api/preferences?userId=${session.user.id}`);
					if (!res.ok) {
						throw new Error("Failed to fetch preferences");
					}
					
					const {preference} = await res.json();
					
					// Map the response fields to the state
					if (preference && preference.length > 0) {
						const pref = preference[0]; // Assuming preference is an array and taking the first element
						console.log('preference', pref)
						setPreferences({
							email: pref.preferenceEmail,
							newsLetterNotification: pref.emailNotification,
							bondingCurveNotification: pref.tokenHitting, // Assuming this maps to bondingCurveNotification
						});
					}
				}
			} catch (error) {
				console.error("Error fetching preferences:", error);
			} finally {
				setLoading(false)
			}
		};
		
		// Call the function to fetch preferences
		fetchPreferences();
	}, [session]);
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [newEmail, setNewEmail] = useState(session?.user?.email);
	const [loading, setLoading] = useState(false); // Loading state
	const [error, setError] = useState(null);
	
	const handlePreferenceChange = (key, value) => {
		setPreferences((prev) => ({...prev, [key]: value}));
	};
	
	const handleSavePreferences = async (e) => {
		setLoading(true);
		console.log("clicked");
		try {
			console.log("Saving preferences:", preferences);
			
			// Ensure verification ID is available
			if (!session?.user?.id) {
				setError(res.error);
				toast.error("Saving failed: " + res.error);
				return;
			}
			
			// Prepare the data to be sent in the request
			const updatedPreferences = {
				userId: session?.user?.id,
				preferenceEmail: preferences.email,
				emailNotification: preferences.newsLetterNotification,
				tokenHitting: preferences.bondingCurveNotification,
			};
			
			// Send a PUT request to update preferences
			const response = await fetch(`/api/preferences`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedPreferences),
			});
			
			// Check if the response is successful
			if (!response.ok) {
				throw new Error("Failed to save preferences");
			}
			const result = await response.json();
			console.log("Preferences saved successfully:", result);
		} catch (error) {
			setError(error);
			toast.error("Login failed: " + error);
			console.error("Error saving preferences:", error);
		}
		setLoading(false);
		toast.success("Save Preference Successful");
	};
	
	const handleEditEmail = () => {
		setIsEditingEmail(true);
		setNewEmail(preferences.email);
	};
	
	const handleSaveEmail = () => {
		setPreferences((prev) => ({...prev, email: newEmail}));
		setIsEditingEmail(false);
	};
	
	
	console.log('local state preferences:', preferences)
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
									checked={preferences.newsletterNotification}
									onChange={(checked) =>
										handlePreferenceChange("newsletterNotification", checked)
									}
								/>
							</CardContent>
						</Card>
						
						{/* <Card className="bg-white text-gray-800  mb-8 rounded-none border-2 border-black">
          <CardHeader>
            <CardTitle className="text-gray-800 ">Job Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <JobPreferences
              preferences={preferences}
              handlePreferenceChange={handlePreferenceChange}
            />
          </CardContent>
        </Card> */}
						
						<Button
							onClick={handleSavePreferences}
							disabled={loading}
							className="w-full bg-blackCustom hover:bg-brownCustom text-white rounded-none border-2 border-black"
						>
							{loading ? "Saving Preferences..." : "Save Preferences"}
						</Button>
					</div>
				</div>
			
			)}</>
	);
};

export default PreferencesPage;
