import { NextResponse } from 'next/server';
import { AssignmentService } from '@/services/assignment.service';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }
    const result = AssignmentService.getSmartAssignment(orderId);
    return NextResponse.json(result);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
