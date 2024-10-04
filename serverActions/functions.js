"use server"

import { users, referrals } from "@/lib/db/schema";
import { db } from "@/lib/db/connect";
import { eq, and } from "drizzle-orm";

export async function getReferralSource(referralCode) {
    try {
        // Fetch verification based on referral code
        const validUser = await db.select()
            .from(users)
            .where(eq(users.referralCode, referralCode))
            .then(result => result[0]);

        // Log the result of the database query
        console.log("Fetched verification from database: ", validUser);

        // Check if the verification exists
        if (!validUser) {
            console.log("User not found.");
            return { error: 'User not found with the provided referral code.' };
        }

        return {
            id: validUser.id,
            name: validUser.username,
            email: validUser.email,
            currentStatus: validUser.currentStatus,
            referralCode: validUser.referralCode,

        };

    } catch (err) {
        // Log the error for debugging purposes
        console.error('Error during referral source:', err);
        return { error: 'An error occurred during referral source. Please try again later.' };
    }
}

export async function calculateWeightedScore() {
    try {


        // get all users whose current_status waiting_list in order of creation date
        let waiting_list_users = await db.select()
            .from(users)
            .where(eq(users.currentStatus, 'waiting_list'))
            .orderBy(users.createdAt, 'asc')
            .then(result => result);

        // for each verification in waiting list get number of referrals from referrals table using referredByUserId
        for (let i = 0; i < waiting_list_users.length; i++) {
            const referrals_count = await db.select()
                .from(referrals)
                .where(eq(referrals.referredByUserId, waiting_list_users[i].id))
                .then(result => result.length);

            waiting_list_users[i].referrals = referrals_count;
        }

        // define constants for calculating weighted score
        const weight_for_referrals = 0.7
        const weight_for_join_order = 0.3

        // get total number of users in waiting list
        let total_users = waiting_list_users.length
        if (total_users === 1) total_users = 2

        // get largest number of referrals by any one verification
        let max_referrals = Math.max(...waiting_list_users.map(user => user.referrals))
        if (max_referrals === 0) max_referrals = 1

        // calculate weighted score for each verification
        const calculated_waiting_list_users = waiting_list_users.map((user, index) => ({
            id: user?.id,
            username: user?.username || 'Anonymous',
            walletAddress: user?.wallet,
            points: user?.points || 0,
            referrals: user?.referrals || 0,
            joinPosition: index + 1,
            nRef: parseFloat((user?.referrals / max_referrals).toFixed(2)),  // Make sure it's a float
            nJoin: parseFloat((1 - ((index - 1) / total_users - 1)).toFixed(2)),  // Make sure it's a float
            ws: parseFloat((
                (weight_for_referrals * (user?.referrals / max_referrals)) +
                (weight_for_join_order * (1 - ((index - 1) / total_users - 1)))
            ).toFixed(2))  // Ensure the final ws value is a float
        }));

        // sort users by weighted score
        const sorted_waiting_list_users = calculated_waiting_list_users.sort((a, b) => b.ws - a.ws)

        // add rank to each verification
        return sorted_waiting_list_users.map((user, index) => ({
            ...user,
            rank: index + 1
        }));
    } catch (error) {
        console.log('Error during weighted score calculation:', error);
        return { error: 'An error occurred during weighted score calculation. Please try again later.' };

    }
}