"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function EventoPage() {
  const params = useParams();
  const search = useSearchParams();
  const [evento, setEvento] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const email = search.get("email");

  useEffect(() => {
    fetch(`/api/events`)
      .then((r) => r.json())
      .then((evs) => {
        setEvento(evs.find((e: any) => e.id === params.id));
      });
  }, [params.id]);

  const handleRespond = async (resp: string) => {
    setLoading(true);
    await fetch(`/api/events/${params.id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, status: resp }),
    });
    setStatus(resp);
    setLoading(false);
    fetch(`/api/events`)
      .then((r) => r.json())
      .then((evs) => {
        setEvento(evs.find((e: any) => e.id === params.id));
      });
  };

  if (!evento) return <div>Cargando evento...</div>;

  const invitado = evento.invited.find((u: any) => u.email === email);

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
      <h1>{evento.tematica}</h1>
      <p>
        <b>Lugar:</b> {evento.lugar}
      </p>
      <p>
        <b>Horarios:</b> {evento.horarios.join(", ")}
      </p>
      <p>
        <b>Resumen:</b> {evento.resumen}
      </p>
      <h3>Invitados</h3>
      <ul>
        {evento.invited.map((u: any) => (
          <li key={u.email}>
            {u.name} ({u.email}) - <b>{u.status}</b>
          </li>
        ))}
      </ul>
      {email && invitado && (
        <div style={{ marginTop: 24 }}>
          <p>Hola, {invitado.name}. ¿Asistirás al evento?</p>
          <button onClick={() => handleRespond("aceptado")} disabled={loading || invitado.status === "aceptado"}>
            Aceptar
          </button>
          <button onClick={() => handleRespond("denegado")} disabled={loading || invitado.status === "denegado"} style={{ marginLeft: 8 }}>
            Denegar
          </button>
          {status && (
            <p style={{ marginTop: 12 }}>
              Respuesta registrada: <b>{status}</b>
            </p>
          )}
        </div>
      )}
      {email && !invitado && <p>No estás invitado a este evento.</p>}
    </main>
  );
}
