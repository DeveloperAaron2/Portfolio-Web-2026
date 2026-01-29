"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded-xl border border-neutral-200 p-6 shadow-sm"
    >
      <h3 className="text-xl font-semibold">Contacto</h3>

      <input
        type="text"
        placeholder="Nombre o Empresa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
      />
        <input
        type="text"
        placeholder="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-neutral-900 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : "Enviar"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-600">
          ✔️ Mensaje enviado correctamente
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600">
          ❌ Error al enviar el mensaje
        </p>
      )}
    </form>
  );
}
