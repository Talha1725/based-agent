import {NextResponse} from 'next/server';
import {agents} from "@/lib/db/schema";
import {db} from "@/lib/db/connect";
import {eq, or, and} from "drizzle-orm";

export async function GET(request) {
	try {
		// fetch all agents
		const allAgents = await db.select()
			.from(agents)
			.then(result => result);
		console.log('allAgents:', allAgents)
		return NextResponse.json(allAgents);
		
	} catch (error) {
		console.error(error);
		return NextResponse.error({message: 'Error fetching data'});
	}
}