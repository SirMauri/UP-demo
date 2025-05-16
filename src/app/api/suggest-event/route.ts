import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { users } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    // Llamada real a OpenAI
    const gustos = users.map((u: any) => u.gustos.join(", ")).join(", ");
    const prompt = `Sugiere un evento presencial en CDMX para empleados remotos con estos gustos: ${gustos}. Dame lugar, temática, etapas y horarios. Responde en JSON con las claves: lugar, tematica, etapas, horarios, resumen.`;
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });
    const data = await openaiRes.json();
    try {
      const json = JSON.parse(data.choices[0].message.content);
      return NextResponse.json(json);
    } catch {
      return NextResponse.json({ error: "Error al parsear respuesta de OpenAI", raw: data }, { status: 500 });
    }
  }
  // Simulación de respuesta de IA
  const response = {
    lugar: "Parque México, CDMX",
    tematica: "Picnic y juegos de integración",
    etapas: ["Bienvenida y rompehielos", "Picnic grupal", "Juegos de integración", "Cierre y despedida"],
    horarios: ["10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00"],
    resumen: "Un evento para que los empleados remotos se conozcan y convivan en un ambiente relajado y divertido.",
  };
  return NextResponse.json(response);
}
