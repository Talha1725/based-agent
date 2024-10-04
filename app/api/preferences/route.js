import { NextResponse } from "next/server";
import { users, referrals, preferences } from "@/lib/db/schema";
import { db } from "@/lib/db/connect";
import { eq } from "drizzle-orm";

export async function GET(req) {
  try {
    // Extract userId from the query string
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.error({ message: "User ID is required" });
    }

    // Check if the verification exists in the preferences table
    const preference = await db
      .select()
      .from(preferences)
      .where(eq(preferences.userId, userId))
      .limit(1);

    // If preferences exist, return the existing preferences
    if (preference.length > 0) {
      return NextResponse.json({ preference });
    }

    // If the verification does not exist in preferences, fetch the verification from the users table
    const user = await db
      .select({
        email: users.email,
        emailNotification: users.emailNotifications,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.error({ message: "User not found in users table" });
    }

    // Insert a new preference entry with userId, email, and emailNotification
    const newPreference = {
      userId,
      preferenceEmail: user[0].email,
      emailNotification: user[0].emailNotification,
    };

    const insertedPreference = await db
      .insert(preferences)
      .values(newPreference)
      .returning();

    // Return the newly inserted preference
    return NextResponse.json({ insertedPreference });
  } catch (error) {
    console.error(error);
    return NextResponse.error({ message: "Error fetching or inserting data" });
  }
}

export async function PUT(req) {
  try {
    // Parse the request body to get userId and new preferences
    const data = await req.json();
    console.log(data);
    if (!data) {
      return NextResponse.error({
        message: "User ID and new preferences are required",
      });
    }

    // Check if the verification already has preferences set
    const existingPreference = await db
      .select()
      .from(preferences)
      .where(eq(preferences.userId, data.userId))
      .limit(1); // Check if the verification already exists in the preferences table

    // If verification preferences exist, update them
    if (existingPreference.length > 0) {
      const updatedPreference = await db
        .update(preferences)
        .set({
          preferenceEmail: data.preferenceEmail,
          emailNotification: data.emailNotification,
          tokenHitting: data.tokenHitting,
        })
        .where(eq(preferences.userId, data.userId));

      return NextResponse.json({ updatedPreference });
    }
  } catch (error) {
    console.error("Error updating or inserting preferences:", error);
    return NextResponse.error({
      message: "Error updating or inserting preferences",
    });
  }
}
