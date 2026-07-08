"use client";

import { useState } from "react";

export default function PhysicalCardRequestForm() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/cards/physical/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, city, deliveryAddress }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to request physical card.");
        return;
      }

      setMessage(data.message);
      setCountry("");
      setCity("");
      setDeliveryAddress("");
    } catch {
      setError("Unable to request physical card.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submitRequest} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-[#06183A]">Physical VIP Card</h2>
      <p className="mt-2 text-sm text-slate-500">Delivery usually takes up to 2 weeks.</p>

      {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      {message && <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{message}</div>}

      <div className="mt-5 space-y-4">
        <input required value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="w-full rounded-2xl border bg-slate-50 px-4 py-4 font-semibold outline-none" />
        <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full rounded-2xl border bg-slate-50 px-4 py-4 font-semibold outline-none" />
        <textarea required value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="Delivery address" className="min-h-28 w-full rounded-2xl border bg-slate-50 px-4 py-4 font-semibold outline-none" />
      </div>

      <button disabled={loading} className="mt-5 w-full rounded-2xl bg-[#062B8C] py-4 font-black text-white disabled:opacity-60">
        {loading ? "Requesting card..." : "Request Physical Card"}
      </button>
    </form>
  );
}