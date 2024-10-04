export default function ConnectButton() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<p className="mb-4 text-lg">Please connect your wallet to continue:</p>
			<w3m-button/>
		</div>
	);
}
