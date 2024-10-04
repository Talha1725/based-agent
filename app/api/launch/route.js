import { NextResponse } from 'next/server';
import { agents } from "@/lib/db/schema";
import { db } from "@/lib/db/connect";
import { eq, or, and } from "drizzle-orm";

export async function POST(request) {
    try {
        const data = await request.json()
        console.log("Received request body:", data);
        let { userId, agentName, agentDescription, website, telegram, github, tokenName, tokenSymbol, initialBuyAmount, selectedSkills, metadata, vEth, vToken, coin, contributorPoolPercentage, dexLiquidityPercentage } = data;

        // check if agent with same name exists
        const existingAgent = await db.select()
            .from(agents)
            .where(eq(agents.name, data.agentName))
            .then(result => result[0]);

        if (existingAgent) {
            return NextResponse.json({ error: 'Agent already exists' }, { status: 409 });
        }

        // insert new agent
        const newAgent = await db.insert(agents).values({
            name: agentName,
            description: agentDescription,
            userId,
            website,
            telegram,
            github,
            tokenName,
            tokenSymbol,
            initialBuyAmount,
            skills: selectedSkills,
            metaData: metadata,
            vEth,
            vToken,
            coinCurrency: coin,
            contributorPoolPercentage,
        }).then(result => result[0]);

        console.log("New agent created:", newAgent);
        console.log("Received request body:", data);

        return NextResponse.json({ message: 'Agent created successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.error({ message: 'Error fetching data' });
    }
}