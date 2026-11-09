"use client";

import { useState } from "react";

const EMAIL = "rensacuna1@gmail.com";
const FACEBOOK = "https://www.facebook.com/renswashie.acunabelga";
const ITEMS = ["T-Shirt", "Mug / Tumbler", "Cap", "Tote Bag", "Souvenirs / Giveaways", "Photo Gift", "Something else"];

export default function OrderSlip() {
  const [form, setForm] = useState({ name: "", item: ITEMS[0], qty: "", date: "", notes: "" });
  const [copied, setCopied] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const message = [
    "Hi JaSprint & Craft! I'd like to order:",
    `• Item: ${form.item}`,
    `• Quantity: ${form.qty || "—"}`,
    `• Needed by: ${form.date || "—"}`,
    `• Details: ${form.notes || "—"}`,
    "",
    `— ${form.name || "(your name)"}`,
  ].join("\n");

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(`Order inquiry: ${form.item}`)}&body=${encodeURIComponent(message)}`;

  const toFacebook = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      /* clipboard blocked — still open Facebook */
    }
    window.open(FACEBOOK, "_blank", "noopener,noreferrer");
  };

  const label = "block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55";

  return (
    <div className="receipt relative px-6 pb-12 pt-7 shadow-2xl sm:px-9">
      <div className="flex items-start justify-between gap-4 border-b-2 border-dashed border-ink/25 pb-5">
        <div>
          <p className="font-display text-3xl uppercase leading-none">Order Slip</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink/55">JaSprint &amp; Craft · Custom Print</p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-ink/55">NO. <span className="text-brand">0001</span></p>
      </div>

      <form className="mt-6 grid gap-6 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <label className="sm:col-span-2">
          <span className={label}>Your name</span>
          <input className="slip-field" value={form.name} onChange={set("name")} placeholder="Juan Dela Cruz" autoComplete="name" />
        </label>
        <label>
          <span className={label}>Item</span>
          <select className="slip-field cursor-pointer" value={form.item} onChange={set("item")}>
            {ITEMS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
        <label>
          <span className={label}>Quantity</span>
          <input className="slip-field" value={form.qty} onChange={set("qty")} inputMode="numeric" placeholder="e.g. 25 pcs" />
        </label>
        <label className="sm:col-span-2">
          <span className={label}>Needed by</span>
          <input className="slip-field" type="date" value={form.date} onChange={set("date")} />
        </label>
        <label className="sm:col-span-2">
          <span className={label}>Design / details</span>
          <textarea
            className="slip-field resize-none"
            rows={3}
            value={form.notes}
            onChange={set("notes")}
            placeholder="Colors, text, size, or attach your design in the chat"
          />
        </label>
      </form>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={mailto}
          className="group flex items-center justify-between bg-ink px-5 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-paper transition hover:bg-brand"
        >
          Send via Email <span aria-hidden className="transition group-hover:translate-x-1">→</span>
        </a>
        <button
          type="button"
          onClick={toFacebook}
          className="group flex items-center justify-between border-2 border-ink px-5 py-4 font-mono text-xs font-semibold uppercase tracking-widest transition hover:border-brand hover:text-brand"
        >
          Send on Facebook <span aria-hidden className="transition group-hover:translate-x-1">→</span>
        </button>
      </div>
      <p className="mt-3 min-h-[1.25rem] font-mono text-[11px] text-ink/55" aria-live="polite">
        {copied ? "✓ Order copied — paste it in the Messenger chat." : "Facebook: we copy your order so you can paste it in chat."}
      </p>
    </div>
  );
}
