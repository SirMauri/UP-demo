import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { event } = await req.json();
  event.invited.forEach((user: any) => {
    console.log(`Enviando invitación a: ${user.email}`);
    console.log(`Link de confirmación: https://up-eventos.vercel.app/evento/${event.id}?email=${encodeURIComponent(user.email)}`);
  });
  return NextResponse.json({ success: true });
}
