import localFont from "next/font/local";
import "../globals.css";  // Reuse global styles from the main app
import Providers from '../providers';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {cookieToInitialState} from "wagmi";
import {config} from "@/config/wagmiConfig";
import {cookies} from "next/headers";
import AppKitProvider from '@/context/wagmiContext';
import Footer from "@/components/Footer";


// Font setup
const geistSans = localFont({
	src: "../fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

const geistMono = localFont({
	src: "../fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata = {
	title: "Auth - Based Agent",
	description: "Authentication for Based Agent",
};

export default function AuthLayout({children}) {
	const cookieHeader = cookies().getAll();
	const cookieString = cookieHeader.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
	const initialState = cookieToInitialState(config, cookieString);
	
	// Log the full initialState to inspect the structure
	console.log("Initial State:", initialState);
	
	// Extracting wallet address from the initialState Map structure
	let walletAddress;
	if (initialState?.connections) {
		const connectionsMap = initialState.connections;
		const currentConnection = connectionsMap.get(initialState.current);
		
		// Safely accessing the accounts array and getting the first account (wallet address)
		if (currentConnection?.accounts && currentConnection.accounts.length > 0) {
			walletAddress = currentConnection.accounts[0];  // This should now correctly get the wallet address
		}
	}
	
	console.log("Wallet Address from state:", walletAddress);
	
	return (
		<html lang="en">
		<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
		<ToastContainer
			position="bottom-right"
			autoClose={5000}
			hideProgressBar={true}
			newestOnTop={false}
			rtl={false}
			pauseOnFocusLoss
			draggable
			theme="light"
			bodyClassName="toastBody"
			icon={false}
		/>
		<Providers>
			<AppKitProvider initialState={initialState}>
				
				{children}
				<Footer/>
			</AppKitProvider>
		</Providers>
		</body>
		</html>
	);
}
