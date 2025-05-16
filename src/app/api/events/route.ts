import { NextRequest, NextResponse } from "next/server";

let events: any[] = [];

export function GET() {
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const newEvent = {
    id: Date.now().toString(),
    ...data,
    invited: data.invited.map((user: any) => ({ ...user, status: "pending" })),
  };
  events.push(newEvent);
  return NextResponse.json(newEvent, { status: 201 });
}

export { events };
