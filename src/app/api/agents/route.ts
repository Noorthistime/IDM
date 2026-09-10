import { NextResponse } from 'next/server';
import { AgentService } from '@/services/agent.service';

export async function GET() {
  try {
    const agents = AgentService.getAllAgents();
    return NextResponse.json(agents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newAgent = AgentService.registerAgent(data);
    return NextResponse.json(newAgent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
