import { NextResponse } from 'next/server';
import { AgentService } from '@/services/agent.service';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    let updatedAgent;
    
    if (body.availability) {
      updatedAgent = AgentService.updateAvailability(id, body.availability);
    }
    
    if (body.location) {
      updatedAgent = AgentService.updateLocation(id, body.location);
    }
    
    if (!updatedAgent) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    return NextResponse.json(updatedAgent);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
