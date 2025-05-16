import { NextResponse } from "next/server";

const users = [
  {
    name: "Ana Luisa",
    email: "0266043@up.edu.mx",
    gustos: ["Yoga", "Fotografía"],
  },
  {
    name: "Uriel",
    email: "0256933@up.edu.mx",
    gustos: ["Senderismo", "Música en vivo"],
  },
  {
    name: "Nicolás",
    email: "0222998@up.edu.mx",
    gustos: ["Videojuegos", "Arte"],
  },
  {
    name: "Emiliano",
    email: "0261310@up.edu.mx",
    gustos: ["Cocina", "Deportes"],
  },
  {
    name: "Roberto",
    email: "0255943@up.edu.mx",
    gustos: ["Lectura", "Cine"],
  },
  {
    name: "Mauricio",
    email: "mauricio@prettysmartlabs.com",
    gustos: ["Tecnología", "Viajes"],
  },
];

export function GET() {
  return NextResponse.json(users);
}
