"use client";

import { useState } from "react";

export default function TestEmailPage() {

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function sendTest() {

    setLoading(true);
    setResult("");

    const res = await fetch("/api/test-email", {
      method: "POST",
    });

    const data = await res.json();

    setLoading(false);

    setResult(JSON.stringify(data, null, 2));
  }

  return (

    <main
      style={{
        maxWidth: 700,
        margin: "80px auto",
        fontFamily: "Arial",
      }}
    >

      <h1>Fluido Credit SMTP Test</h1>

      <button
        onClick={sendTest}
        style={{
          padding: 15,
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        {loading ? "Sending..." : "Send Test Email"}
      </button>

      <pre
        style={{
          marginTop: 30,
          background: "#111",
          color: "#0f0",
          padding: 20,
          borderRadius: 10,
          whiteSpace: "pre-wrap",
        }}
      >
        {result}
      </pre>

    </main>

  );

}