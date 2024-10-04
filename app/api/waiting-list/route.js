import {NextResponse} from 'next/server';
import {calculateWeightedScore} from "@/serverActions/functions";
import {users, referrals} from "@/lib/db/schema";
import {db} from "@/lib/db/connect";
import {eq, and} from "drizzle-orm";

export async function GET(request) {
	try {
		// fetch users with currentStatus waiting_list
		const waiting_list_users = await db.select()
			.from(users)
			.where(eq(users.currentStatus, 'waiting_list'))
			.orderBy(users.rank); // Sorting by rank in ascending order
		
		return NextResponse.json({waiting_list_users});
		
	} catch (error) {
		console.error(error);
		return NextResponse.error({message: 'Error fetching data'});
	}
}

