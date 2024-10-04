import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

// Define paths that do not require authentication (like the login, register, and landing-page)
const publicPaths = ["/login", "/register", "/", /^\/docs\/.*/];

// Define routes restricted to users with `currentStatus = 'main_net'`
const mainNetRestrictedPaths = [
	"/home",
	"/agents",
	"/agent/[id]", // Include dynamic routes as well
	"/launch",
	"/agent",
	"/profile",
	"/wallets",
	"/referrals",
	"/leaderboard",
	"/integrations",
	"/all-tokens",
	"/all-transactions",
	"/preferences",
];

// Define routes restricted to users with `currentStatus = 'waiting_list'`
const waitingListRestrictedPaths = [/^\/waiting-list\/.*/];

export async function middleware(req) {
	const token = await getToken({
		req,
		secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
	});
	
	console.log("Secret: ", process.env.NEXT_PUBLIC_NEXTAUTH_SECRET);
	console.log("Request URL: ==>", req.nextUrl);
	console.log("Token: ==>", token);
	
	const {pathname} = req.nextUrl;
	
	// Check if the request is for a public path
	const isPublicPath = publicPaths.some((path) =>
		typeof path === "string" ? pathname === path : path.test(pathname)
	);
	
	// If verification is logged in and trying to access login, register, or landing-page, redirect based on their status
	if (token && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
		if (token.currentStatus === "main_net") {
			console.log("User is already logged in. Redirecting to home page.");
			return NextResponse.redirect(new URL("/home", req.url));
		} else if (token.currentStatus === "waiting_list") {
			console.log("User is already logged in. Redirecting to waiting list page.");
			return NextResponse.redirect(
				new URL("/waiting-list/welcome-referral", req.url)
			);
		}
	}
	
	// If the path is public (including landing-page), allow access
	if (isPublicPath) {
		return NextResponse.next();
	}
	
	// If no token (verification is not authenticated) and trying to access a non-public path, redirect to the landing page
	if (!token) {
		console.log("No token found. Redirecting to landing page.");
		return NextResponse.redirect(new URL("/", req.url));
	}
	
	// Get current status from token
	const currentStatus = token.currentStatus;
	
	// If the verification's status is 'waiting_list', restrict them to the waiting-list routes
	if (currentStatus === "waiting_list") {
		const isWaitingListPath = waitingListRestrictedPaths.some((path) =>
			typeof path === "string" ? pathname === path : path.test(pathname)
		);
		if (isWaitingListPath) {
			return NextResponse.next(); // Allow access to waiting-list routes
		} else {
			// If trying to access any other route, redirect to the waiting-list page
			console.log("User is on waiting list. Redirecting to waiting list page.");
			return NextResponse.redirect(
				new URL("/waiting-list/welcome-referral", req.url)
			);
		}
	}
	
	// If the verification's status is 'main_net', restrict them to the main_net restricted paths
	if (currentStatus === "main_net") {
		const isMainNetPath = mainNetRestrictedPaths.some((path) =>
			typeof path === "string" ? pathname === path : path.test(pathname)
		);
		if (isMainNetPath) {
			return NextResponse.next(); // Allow access to main_net restricted paths
		} else {
			// If trying to access any other route, redirect to the home page or another default page
			console.log("User is on main net. Redirecting to home page.");
			return NextResponse.redirect(new URL("/home", req.url));
		}
	}
	
	// If verification's status doesn't match any of the above, redirect to the home page as a fallback
	console.log("User status not recognized. Redirecting to home page.");
	return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
	matcher: [
		"/home", // Include all routes you want to match in the middleware
		"/agents",
		"/agent/[id]", // Include dynamic routes as well
		"/launch",
		"/agent",
		"/profile",
		"/wallets",
		"/referrals",
		"/leaderboard",
		"/integrations",
		"/all-tokens",
		"/all-transactions",
		"/login",
		"/register",
		"/docs/(.*)", // Match any docs-related paths
		"/",
		"/waiting-list/(.*)", // Match any waiting-list-related paths
		"/waiting-list",
		"/preferences",
	],
};
