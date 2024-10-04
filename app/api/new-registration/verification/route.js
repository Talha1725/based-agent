import { NextResponse } from "next/server";
import { preferences, userCode, users } from "@/lib/db/schema";
import { db } from "@/lib/db/connect";
import { and, eq, or } from "drizzle-orm";
import { subMinutes } from "date-fns";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid"; // For date manipulation

export async function POST(req) {
  console.log("running verification api end point");

  try {
    const { email, verificationCode, address, emailNotifications } =
      await req.json();
    const currentTime = new Date();
    const expiryTime = subMinutes(currentTime, 10); // Set expiration time to 10 minutes ago

    console.log(
      `Received request with email: ${email}, verificationCode: ${verificationCode}, address: ${address}, and emailNotifications: ${emailNotifications}`
    );

    // Check if the provided verification code exists for the given email
    const codeRecord = await db
      .select()
      .from(userCode)
      .where(
        and(eq(userCode.email, email), eq(userCode.code, verificationCode))
      )
      .limit(1);

    console.log(`Code record for email ${email}:`, codeRecord);

    if (codeRecord.length === 0) {
      console.log("No matching code found or invalid verification code.");
      return NextResponse.json(
        { error: "Invalid email or verification code." },
        { status: 400 }
      );
    }

    const codeData = codeRecord[0];
    console.log(`Found code data:`, codeData);

    // Check if the code is expired
    if (new Date(codeData.createdAt) < expiryTime) {
      console.log("Verification code has expired.");
      return NextResponse.json(
        { error: "Verification code has expired." },
        { status: 400 }
      );
    }

    console.log("Verification code is valid, proceeding to user registration.");
    return NextResponse.json(
      { error: "Verification Successful.", codeData },
      { status: 200 }
    );
    //the bellow code is already handled by register
    // // Check if the username, email, or wallet already exists
    // const existingUser = await db
    //   .select()
    //   .from(users)
    //   .where(or(eq(users.email, email), eq(users.wallet, address)))
    //   .then((result) => result[0]);

    // console.log("Existing verification result:", existingUser);

    // if (existingUser) {
    //   console.log("User already exists, returning 409 status.");
    //   return NextResponse.json(
    //     { error: "User already exists", user: existingUser },
    //     { status: 200 }
    //   );
    // }

    // const userId = crypto.randomBytes(4).toString("hex");
    // const referralCode = uuidv4(); // Generates an 8-character referral code

    // console.log("Generated userId:", userId);
    // console.log("Generated referral code:", referralCode);

    // // Insert new user into users table
    // const newUser = await db.insert(users).values({
    //   id: userId,
    //   email,
    //   wallet: address,
    //   referralCode,
    //   emailNotifications: emailNotifications,
    // });

    // console.log("User registered successfully:", newUser);

    // // Insert user preferences into preferences table
    // const preference = await db.insert(preferences).values({
    //   userId: userId,
    //   email,
    //   emailNotification: emailNotifications,
    // });

    // console.log("User preference successfully added:", preference);

    // return NextResponse.json(
    //   { message: "User registered successfully", user: newUser },
    //   { status: 200 }
    // );
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { error: "Error inserting data" },
      { status: 500 }
    );
  }
}
