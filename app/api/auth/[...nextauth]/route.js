import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import {authenticateUser} from "@/serverActions/auth";
import {cookieToInitialState} from "wagmi";
import {config} from "@/config/wagmiConfig";
import {headers} from "next/headers";

const handler = (req, res) =>
	NextAuth(req, res, {
		providers: [
			GithubProvider({
				clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
				clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
			}),
			CredentialsProvider({
				name: "Credentials",
				credentials: {
					// email: { label: "Email", type: "email" },
					// password: { label: "Password", type: "password" },
				},
				async authorize(credentials) {
					try {
						console.log("Authorize credentials:", credentials);
						const user = await authenticateUser(
							credentials.address
						);
						
						console.log("Authenticated verification:", user);
						
						if (user && !user.error) {
							return user;
						} else {
							throw new Error("Authentication failed. Invalid credentials.");
						}
					} catch (error) {
						console.error("Error during authentication:", error.message || error);
						return null; // Return null in case of an error
					}
				},
			})
		
		],
		callbacks: {
			async jwt({token, user}) {
				const cookieState = cookieToInitialState(
					config,
					headers().get("cookie")
				);
				let walletAddress;
				
				if (cookieState?.connections) {
					const connectionsMap = cookieState.connections;
					const currentConnection = connectionsMap.get(cookieState.current);
					
					if (
						currentConnection?.accounts &&
						currentConnection.accounts.length > 0
					) {
						walletAddress = currentConnection.accounts[0];
					}
				}
				
				// console.log("JWT token before modification:", token);
				console.log("User in JWT callback:", user);
				
				if (user) {
					token.sub = user.id;
					token.currentStatus = user.currentStatus;
					token.referralCode = user.referralCode;
					token.rank = user.rank; // Ensure rank is added to the token
				}
				if (walletAddress) {
					token.walletAddress = walletAddress;
				}
				
				return token;
			},
			async session({session, token}) {
				session.user.id = token.sub ?? null;
				session.user.accessToken = token.accessToken ?? null;
				session.user.walletAddress = token.walletAddress ?? null;
				session.user.currentStatus = token.currentStatus ?? null;
				session.user.referralCode = token.referralCode ?? null;
				session.user.rank = token.rank ?? null; // Add rank to the session
				
				// console.log("Session after modification:", session);
				return session;
			},
			async redirect({url, baseUrl}) {
				// console.log("Redirect callback triggered");
				// console.log("URL:", url);
				// console.log("Base URL:", baseUrl);
				//
				if (url === "/api/auth/signout") {
					// console.log("Sign-out detected. Redirecting to landing page...");
					return "https://basedagents.co/landing-page";
				}
				
				if (url.startsWith("/")) {
					console.log(
						"Relative URL detected. Redirecting to:",
						`${baseUrl}${url}`
					);
					return `${baseUrl}${url}`;
				} else if (new URL(url).origin === baseUrl) {
					// console.log("URL is on the same origin. Redirecting to:", url);
					return url;
				}
				
				// console.log("Default redirection. Redirecting to base URL:", baseUrl);
				return baseUrl;
			},
		},
		pages: {
			signIn: "/auth/signin",
		},
	});

export {handler as GET, handler as POST};
