"use client";

import {
	Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

const EmailModal = ({
											referralEmail,
											showEmailModal,
											setShowEmailModal,
											email,
											setEmail,
											showVerificationInput,
											setVerificationCode,
											verificationCode,
											handleGetCode,
											handleVerifyCode,
											loading,
										}) => {
	return (<>
		<Dialog
			open={showEmailModal}
			onOpenChange={setShowEmailModal}
			className="rounded-none border-2 border-black"
		>
			<DialogContent className="bg-white text-gray-800">
				
				{/* Header changes dynamically based on verification state */}
				<DialogHeader>
					{referralEmail && !showVerificationInput && (<DialogTitle className="text-gray-900 py-4 text-center">
						You Are Referred By
						<br/>
						<span className="text-brownCustom py-4 block">{referralEmail}</span>
					</DialogTitle>)}
					
					{/* Show registration header */}
					{!showVerificationInput && (<>
						<DialogTitle className="text-gray-900">Register Your Email</DialogTitle>
						<DialogDescription className="text-gray-600">
							Please enter your email to register.
						</DialogDescription>
					</>)}
					
					{/* Show verification header */}
					{showVerificationInput && (<>
						<DialogTitle className="text-gray-900">Verify Your Email</DialogTitle>
						<DialogDescription className="text-gray-600">
							Please enter the verification code sent to your email.
						</DialogDescription>
					</>)}
				</DialogHeader>
				
				{/* Email Registration Form */}
				{!showVerificationInput && (<div className="mt-4">
					<h2 className="text-lg font-semibold text-gray-900 mb-2">Email Registration</h2>
					<Label htmlFor="email" className="text-sm text-gray-700">
						Email:
					</Label>
					<Input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="mt-2 p-2 border rounded-none w-full"
						placeholder="Enter your email"
					/>
					<div className="flex justify-center mt-4">
						<Button
							onClick={handleGetCode}
							className={`p-2 rounded-none border-2 ${loading ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blackCustom text-white hover:bg-brownCustom border-black'}`}
							disabled={loading}
						>
							{loading ? 'Sending Code...' : 'Register'}
						</Button>
					</div>
				</div>)}
				
				{/* Email Verification Form */}
				{showVerificationInput && (<div className="mt-4">
					<h2 className="text-lg font-semibold text-gray-900 mb-2">Email Verification</h2>
					<Label htmlFor="verificationCode" className="text-sm text-gray-700">
						Verification Code:
					</Label>
					<Input
						id="verificationCode"
						type="text"
						value={verificationCode}
						onChange={(e) => setVerificationCode(e.target.value)}
						className="mt-2 p-2 border rounded-none w-full"
						placeholder="Enter 6-digit code"
					/>
					<div className="flex justify-center mt-4">
						<Button
							onClick={handleVerifyCode}
							className={`p-2 rounded-none border-2 ${loading ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blackCustom text-white hover:bg-brownCustom border-black'}`}
							disabled={loading}
						>
							{loading ? 'Verifying...' : 'Verify Code'}
						</Button>
					</div>
				</div>)}
			</DialogContent>
		</Dialog>
	</>);
};

export default EmailModal;
