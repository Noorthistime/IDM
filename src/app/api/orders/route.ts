import { NextResponse } from 'next/server';
import { OrderService } from '@/services/order.service';

export async function GET() {
  try {
    const orders = OrderService.getAllOrders();
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newOrder = OrderService.createOrder(data);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
