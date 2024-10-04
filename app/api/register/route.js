import {NextResponse} from "next/server";
import {users, referrals, preferences} from "@/lib/db/schema";
import {db} from "@/lib/db/connect";
import {eq, or, and} from "drizzle-orm";
import bcrypt from "bcryptjs";
import {v4 as uuidv4} from "uuid";
import crypto from "crypto";
import {calculateWeightedScore} from "@/serverActions/functions";

export async function POST(req) {
	try {
		const {
			email,
			walletAddress,
			referralSourceId,
			emailNotifications,
		} = await req.json();
		console.log("Received request body:", {
			email,
			walletAddress,
			referralSourceId,
			emailNotifications,
		});
		
		// Validate required fields
		if (!email || !walletAddress) {
			return NextResponse.json(
				{error: "Email and Wallet Address are required"},
				{status: 400}
			);
		}
		
		// Check if the username, email, or wallet already exists
		const existingUser = await db
			.select()
			.from(users)
			.where(or(eq(users.email, email), eq(users.wallet, walletAddress)))
			.then((result) => result[0]);
		
		console.log("Existing verification:", existingUser);
		
		if (existingUser) {
			console.log("User already exists, returning 409 status");
			return NextResponse.json(
				{error: "User already exists"},
				{status: 409}
			);
		}
		
		// Hash the password using argon2
		// const hashedPassword = await bcrypt.hash(password, 10);
		// console.log("Hashed password:", hashedPassword);
		
		// Generate UUID for verification ID
		const userId = crypto.randomBytes(4).toString("hex");
		
		// Generate a random alphanumeric referral code
		const referralCode = uuidv4(); // Generates an 8-character code
		
		// Insert the new verification into the database
		const newUser = await db.insert(users).values({
			id: userId,
			// username,
			email,
			// hashedPassword,
			wallet: walletAddress,
			referralCode,
			referredBy: referralSourceId,
			emailNotifications: emailNotifications,
		});
		//inserting relevant data to preferences too
		const preference = await db.insert(preferences).values({
			userId: userId,
			email,
			emailNotification: emailNotifications,
			preferenceEmail: email
			
		});
		// Insert the referral source into the database
		if (referralSourceId) {
			const referralSource = await db
				.select()
				.from(users)
				.where(eq(users.id, referralSourceId))
				.then((result) => result[0]);
			if (referralSource) {
				await db.insert(referrals).values({
					userId: userId,
					referredByUserId: referralSourceId,
					referralCode: referralSource.referralCode,
					status: "active",
				});
			}
			console.log("New referral created:", referralSource);
		}
		
		// calculate weighted score for all waiting users since new verification is added and will change the order
		const waiting_list_users = await calculateWeightedScore();
		
		// update the waiting list users
		// 		rank: integer('rank').default(0),
		//   referralsCount: integer('referrals_count').default(0),
		//   joinPosition: integer('join_position').default(0),
		//   nRef: integer('n_ref').default(0),
		//   nJoin: integer('n_join').default(0),
		//   weightedScore: integer('weighted_score').default(0),
		//   points: integer('points').default(0),
		// if they have been changed
		for (let i = 0; i < waiting_list_users.length; i++) {
			const user = waiting_list_users[i];
			await db
				.update(users)
				.set({
					rank: user.rank,
					referralsCount: user.referrals,
					joinPosition: user.joinPosition,
					nRef: user.nRef,
					nJoin: user.nJoin,
					weightedScore: user.ws,
					points: user.points,
				})
				.where(eq(users.id, user.id));
		}
		
		console.log("New verification created:", newUser);
		
		return NextResponse.json({user: newUser}, {status: 201});
	} catch (error) {
		console.error("Error during registration:", error.message);
		console.error("Stack trace:", error.stack);
		return NextResponse.json(
			{error: "Internal Server Error"},
			{status: 500}
		);
	}
}
