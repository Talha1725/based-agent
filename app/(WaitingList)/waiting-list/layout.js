import localFont from "next/font/local";
import "../../globals.css";
import Providers from '../../providers';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/HeaderWaitingList';

import {cookieToInitialState} from "wagmi";
import {config} from "@/config/wagmiConfig";
import {headers} from "next/headers";
import AppKitProvider from '@/context/wagmiContext';
import Footer from "@/components/Footer";

// Font setup
const geistSans = localFont({
	src: "../../fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

const geistMono = localFont({
	src: "../../fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata = {
	title: "Based Agent - Website",
	description: "Market Place for AI Agents",
};

export default function WebsiteLayout({children}) {
	const initialState = cookieToInitialState(config, headers().get('cookie'))
	
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
		/> <Providers>
			<AppKitProvider initialState={initialState}>
				<Header/>
				{children}
				<Footer/>
			</AppKitProvider>
		
		</Providers>
		</body>
		</html>
	);
}
