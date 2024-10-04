// components/ConsentDialog.tsx

'use client';
import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";

const ConsentDialog = ({
												 showConsentDialog,
												 setShowConsentDialog,
												 email,
												 setEmail,
												 agreeToEmails,
												 setAgreeToEmails,
												 handleConsentSubmit,
												 loading
											 }) => {
	return (
		<Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
			<DialogContent className="bg-white text-gray-800">
				<DialogHeader>
					<DialogTitle className="text-gray-900">Email Preferences</DialogTitle>
					<DialogDescription className="text-gray-600">
						Provide your email to receive updates about testnet access and other notifications from BasedAgent
						(optional).
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleConsentSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right text-gray-700">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="col-span-3 bg-gray-50 text-gray-900"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="agree-to-emails"
								checked={agreeToEmails}
								onCheckedChange={() => setAgreeToEmails(!agreeToEmails)} // Toggle state
							/>
							<Label htmlFor="agree-to-emails" className="text-sm text-gray-700">
								I agree to receive email updates about testnet access and other notifications from BasedAgent.
							</Label>
						</div>
					</div>
					<DialogFooter>
						
						<Button
							type="submit"
							className={`w-full p-2 rounded-none border-2 shadow-lg
    					${loading ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blackCustom text-white hover:bg-brownCustom hover:text-white border-black'}`}
							disabled={loading}
							onClick={handleConsentSubmit}
						>
							{loading ? 'Saving...' : 'Continue'}
						</Button>
					
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ConsentDialog;
