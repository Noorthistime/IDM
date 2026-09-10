import { NextResponse } from 'next/server';
import { RouteService } from '@/services/route.service';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sequence = RouteService.getRouteSequence(id);
    return NextResponse.json(sequence);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
