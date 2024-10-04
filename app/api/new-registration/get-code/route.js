import { userCode } from "@/lib/db/schema";
import { db } from "@/lib/db/connect";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/email.service";
import { randomInt } from "crypto";
import { subMinutes } from "date-fns";

export async function POST(req) {
  try {
    const { email } = await req.json(); // Use req.json() to parse the body
    const code = randomInt(100000, 999999);
    const currentTime = new Date();

    console.log(`Received request for email: ${email}`);

    if (!email) {
      console.log("Email is missing in request");
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Check if there's an existing code for the given email
    const existingCodeData = await db
      .select()
      .from(userCode)
      .where(eq(userCode.email, email))
      .limit(1);

    console.log(`Existing code data for email ${email}:`, existingCodeData);

    if (existingCodeData.length > 0) {
      const existingCode = existingCodeData[0];
      const expiryTime = subMinutes(currentTime, 10); // Subtracts 10 minutes from the current time

      console.log(`Existing code for email ${email}:`, existingCode);
      console.log(`Expiry time: ${expiryTime}`);
      console.log(`Current time: ${currentTime}`);

      if (existingCode.createdAt > expiryTime) {
        console.log("Code is still valid, updating the existing code");
        // Update the existing code since it's not expired
        await db
          .update(userCode)
          .set({ code, createdAt: currentTime }) // Update with the new code and current time
          .where(eq(userCode.email, email));
        console.log(`Updated code for email: ${email}`);
      } else {
        console.log("Code is expired, inserting a new code");
        // Insert a new code if the existing one is expired
        await db
          .update(userCode)
          .set({ code, createdAt: currentTime }) // Update with the new code and current time
          .where(eq(userCode.email, email));
        console.log(`Inserted new code for email: ${email}`);
      }
    } else {
      console.log(
        `No existing code found for email ${email}, inserting a new code`
      );
      // Insert a new code if no existing code found
      await db.insert(userCode).values({ email, code, createdAt: currentTime });
      console.log(`Inserted new code for email: ${email}`);
    }

    // Send the code via email
    await sendEmail(email, code);
    console.log(`Email sent to ${email}:`);

    // if (!res) {
    // 	console.log("Error occurred while sending email");
    // 	return NextResponse.json({error: "Error sending Email"}, {status: 400});
    // }

    // Return success response
    console.log(`Code sent successfully to email: ${email}, Code: ${code}`);
    return NextResponse.json({ message: "Code sent successfully", code });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
