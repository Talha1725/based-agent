"use client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {useAccount} from "wagmi";
import {Button} from "@/components/ui/button";

const JoinWaitListModal = ({
														 showWalletModal,
														 setShowWalletModal,
														 agreeToTerms,
														 setAgreeToTerms,
														 handleEmailModal,
													 }) => {
	const {address, isConnected} = useAccount();
	
	const getDialogTitle = () => {
		if (!isConnected) return "Connect Your Wallet";
		if (isConnected && !agreeToTerms) return "Agree to the Terms";
		if (isConnected && agreeToTerms) return "You're All Set!";
	};
	
	const getDialogDescription = () => {
		if (!isConnected)
			return "To proceed, please connect your wallet.";
		if (isConnected && !agreeToTerms)
			return "You’ve connected your wallet. Please agree to the Terms of Use and Privacy Policy.";
		if (isConnected && agreeToTerms)
			return "Everything is set! Click 'Next' to continue.";
	};
	
	return (
		<Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
			<DialogContent className="bg-white text-gray-800">
				<DialogHeader>
					<DialogTitle className="text-gray-900">{getDialogTitle()}</DialogTitle>
					<DialogDescription className="text-gray-600 ">
						{getDialogDescription()}
					</DialogDescription>
				</DialogHeader>
				
				<div className="flex items-center space-x-2 mt-4">
					<Checkbox
						id="terms"
						checked={agreeToTerms}
						onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
						disabled={!isConnected}
					/>
					<Label htmlFor="terms" className="text-sm text-gray-700">
						I agree to the{" "}
						<Link href="/terms" className="text-blackCustom font-black hover:underline">
							Terms of Use
						</Link>{" "}
						and{" "}
						<Link href="/privacy" className="text-blackCustom font-black hover:underline">
							Privacy Policy
						</Link>
						.
					</Label>
				</div>
				
				<div className="flex justify-center mt-4">
					<Button
						onClick={handleEmailModal}
						disabled={!isConnected || !agreeToTerms}
						className={`p-2 rounded-none border-2 px-4 ${
							isConnected && agreeToTerms
								? "bg-blackCustom text-white hover:bg-brownCustom border-black"
								: "bg-gray-400 text-gray-700 cursor-not-allowed"
						}`}
					>
						Next
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default JoinWaitListModal;
