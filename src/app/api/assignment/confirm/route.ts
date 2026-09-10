import { NextResponse } from 'next/server';
import { AssignmentService } from '@/services/assignment.service';

export async function POST(request: Request) {
  try {
    const { orderId, agentId } = await request.json();
    if (!orderId || !agentId) {
      return NextResponse.json({ error: "orderId and agentId are required" }, { status: 400 });
    }
    const assignedOrder = AssignmentService.assignOrder(orderId, agentId);
    return NextResponse.json(assignedOrder);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
