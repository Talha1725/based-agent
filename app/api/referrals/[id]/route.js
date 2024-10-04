import {NextResponse} from "next/server";
import {users, referrals} from "@/lib/db/schema";
import {db} from "@/lib/db/connect";
import {eq} from "drizzle-orm";

export async function GET(req, {params}) {
	try {
		// Log request params to check incoming data
		console.log("Request params:", params);
		
		// Assuming you have a way to get the logged-in verification's ID
		const userID = params.id;
		
		// Log the userID to confirm it's being extracted correctly
		console.log("Logged-in verification ID:", userID);
		
		// Fetch only the required fields: name, wallet, status, invite date
		const referredUsers = await db
			.select({
				name: users.username, // Name of the verification
				wallet: users.wallet, // Wallet address
				status: referrals.status, // Referral status
				inviteDate: referrals.createdAt, // Invite (referral) date
			})
			.from(referrals)
			.innerJoin(users, eq(referrals.userId, users.id)) // Join users table to fetch referred verification's data
			.where(eq(referrals.referredByUserId, userID)); // Filter based on the current verification's ID
		
		// Format the invite date
		const formattedUsers = referredUsers.map((user) => ({
			...user,
			inviteDate: new Date(user.inviteDate).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}) + " " + new Date(user.inviteDate).toLocaleTimeString('en-US'),
		}));
		
		// Log the result of the query
		console.log("Formatted referred users data:", formattedUsers);
		
		return NextResponse.json({referredUsers: formattedUsers});
	} catch (error) {
		// Log the error if any occurs
		console.error("Error fetching referrals:", error);
		return NextResponse.json(
			{message: "Error fetching referrals", error},
			{status: 500}
		);
	}
}
