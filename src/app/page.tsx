"use client";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  gustos: string[];
}

interface Event {
  id: string;
  lugar: string;
  tematica: string;
  etapas: string[];
  horarios: string[];
  resumen: string;
  invited: (User & { status: string })[];
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents);
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers);
  }, []);

  const handleSuggest = async () => {
    setLoading(true);
    const res = await fetch("/api/suggest-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users: selectedUsers }),
    });
    setSuggestion(await res.json());
    setLoading(false);
  };

  const handleCreateEvent = async () => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...suggestion,
        invited: selectedUsers,
      }),
    });
    const event = await res.json();
    await fetch("/api/send-invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
    });
    setShowCreate(false);
    setSuggestion(null);
    setSelectedUsers([]);
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents);
  };

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
      <h1>Organizador de Eventos Remotos</h1>
      <button onClick={() => setShowCreate(true)} style={{ margin: "16px 0" }}>
        Crear evento
      </button>
      {showCreate && (
        <div style={{ border: "1px solid #ccc", padding: 16, marginBottom: 24 }}>
          <h2>Selecciona usuarios a invitar</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {users.map((u) => (
              <label key={u.email} style={{ border: "1px solid #eee", padding: 8, borderRadius: 4 }}>
                <input
                  type="checkbox"
                  checked={selectedUsers.some((su) => su.email === u.email)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedUsers((s) => [...s, u]);
                    else setSelectedUsers((s) => s.filter((su) => su.email !== u.email));
                  }}
                />
                {u.name} ({u.gustos.join(", ")})
              </label>
            ))}
          </div>
          <button onClick={handleSuggest} disabled={selectedUsers.length === 0 || loading} style={{ marginTop: 16 }}>
            {loading ? "Cargando..." : "Sugerir evento con IA"}
          </button>
          {suggestion && (
            <div style={{ marginTop: 16 }}>
              <h3>Resumen sugerido</h3>
              <p>
                <b>Lugar:</b> {suggestion.lugar}
              </p>
              <p>
                <b>Temática:</b> {suggestion.tematica}
              </p>
              <p>
                <b>Etapas:</b> {suggestion.etapas.join(", ")}
              </p>
              <p>
                <b>Horarios:</b> {suggestion.horarios.join(", ")}
              </p>
              <p>
                <b>Resumen:</b> {suggestion.resumen}
              </p>
              <button onClick={handleCreateEvent} style={{ marginTop: 12 }}>
                Mandar invitaciones
              </button>
            </div>
          )}
        </div>
      )}
      <h2>Eventos</h2>
      {events.length === 0 && <p>No hay eventos aún.</p>}
      {events.map((ev) => (
        <div key={ev.id} style={{ border: "1px solid #eee", padding: 16, marginBottom: 16 }}>
          <h3>{ev.tematica}</h3>
          <p>
            <b>Lugar:</b> {ev.lugar}
          </p>
          <p>
            <b>Horarios:</b> {ev.horarios.join(", ")}
          </p>
          <p>
            <b>Resumen:</b> {ev.resumen}
          </p>
          <h4>Invitados</h4>
          <ul>
            {ev.invited.map((u) => (
              <li key={u.email}>
                {u.name} ({u.email}) - <b>{u.status}</b>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
