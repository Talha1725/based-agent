import { NextResponse } from "next/server";
import { users, referrals } from "@/lib/db/schema";
import { db } from "@/lib/db/connect";
import { eq } from "drizzle-orm";

export async function GET(req) {
  try {
    // Assuming you have a way to get the logged-in verification's ID
    const { userID } = await req.json();
    console.log("userID", userID);
    return NextResponse.json({ message: "Referrals fetched" });

    // Fetch referred users
    const referredUsers = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referredByUserId, userID))


    return NextResponse.json({ referredUsers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching referrals", error },
      { status: 500 }
    );
  }
}
