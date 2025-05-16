import { NextRequest, NextResponse } from "next/server";
import { events } from "../../route";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { email, status } = await req.json();
  const event = events.find((e: any) => e.id === id);
  if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  const user = event.invited.find((u: any) => u.email === email);
  if (!user) return NextResponse.json({ error: "Usuario no invitado" }, { status: 404 });
  user.status = status;
  return NextResponse.json({ success: true });
}
