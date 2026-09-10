import { NextResponse } from 'next/server';
import { OrderService } from '@/services/order.service';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }
    const updatedOrder = OrderService.updateDeliveryStatus(id, body.status);
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
