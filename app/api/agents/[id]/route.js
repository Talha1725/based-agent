import { NextResponse } from 'next/server';
import { agents } from "@/lib/db/schema";
import { db } from "@/lib/db/connect";
import { eq, or, and } from "drizzle-orm";

export async function GET(request, { params }) {
    try {
        const agentId = params.id;
        // fetch agent by id
        const agent = await db.select()
            .from(agents)
            .where(eq(agentId, agents.id))
            .then(result => result[0]);
        return NextResponse.json(agent);

    } catch (error) {
        console.error(error);
        return NextResponse.error({ message: 'Error fetching data' });
    }
}