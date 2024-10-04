"use server";
import {users} from "@/lib/db/schema";
import {db} from "@/lib/db/connect";
import {eq} from "drizzle-orm";

export async function authenticateUser(address) {
	try {
		
		if (!address) {
			console.log("Invalid data: Missing email, password, or address.");
			return {
				error: "Invalid data. Email, password, and address are required.",
			};
		}
		
		const validUser = await db
			.select()
			.from(users)
			.where(eq(users.wallet, address))
			.then((result) => result[0]);
		
		// Log the result of the database query
		// console.log("Fetched verification from database: ", validUser);
		
		// Check if the verification exists
		if (!validUser) {
			console.log("User not found.");
			return {
				error: "User not found with the provided email and wallet address.",
			};
		}
		
		// console.log("Authentication successful for verification:", validUser.username);
		return {
			id: validUser.id,
			email: validUser.email,
			rank: validUser.rank,
			currentStatus: validUser.currentStatus,
			referralCode: validUser.referralCode,
		};
		
	} catch (err) {
		// Log the error for debugging purposes
		console.error("Error during authentication:", err);
		return {
			error: "An error occurred during authentication. Please try again later.",
		};
	}
}
