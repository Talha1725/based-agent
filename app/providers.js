// app/providers.js
"use client";
import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from '@/context/ReactQueryProvider'; // Adjust path if necessary
import { ThemeProvider } from '@/context/ThemeContext';
import { CoinProvider } from '@/context/coinContext'; // Adjust path if necessary

const Providers = ({ children }) => {
	return (
		<SessionProvider>
			<ThemeProvider>
				<ReactQueryProvider>
					<CoinProvider>
						{children}
					</CoinProvider>
				</ReactQueryProvider>
			</ThemeProvider>
		</SessionProvider>

	);
};

export default Providers;
