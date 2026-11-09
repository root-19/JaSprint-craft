"use client";

import { useEffect, useRef, useState } from "react";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import type { GenericId } from "convex/values";

const EMAIL = "rensacuna1@gmail.com";
const FACEBOOK = "https://www.facebook.com/renswashie.acunabelga";
const ITEMS = ["T-Shirt", "Mug / Tumbler", "Cap", "Tote Bag", "Souvenirs / Giveaways", "Photo Gift", "Something else"];
const MAX_FILES = 3;
const MAX_MB = 8;

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const genUploadUrl = makeFunctionReference<"mutation", Record<string, never>, string>("orders:generateUploadUrl");
const createOrder = makeFunctionReference<
  "mutation",
  { name: string; contact: string; item: string; qty: string; neededBy: string; notes: string; designs: GenericId<"_storage">[] },
  { code: string; urls: string[] }
>("orders:create");

type Picked = { file: File; preview: string };
type Result = { code: string | null; urls: string[]; warning?: string };

export default function OrderSlip() {
  const [form, setForm] = useState({ name: "", contact: "", item: ITEMS[0], qty: "", date: "", notes: "" });
  const [files, setFiles] = useState<Picked[]>([]);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // free object URLs on unmount
  useEffect(() => () => filesRef.current.forEach((f) => URL.revokeObjectURL(f.preview)), []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFileError("");
    const next = [...files];
    for (const file of Array.from(list)) {
      if (next.length >= MAX_FILES) {
        setFileError(`Up to ${MAX_FILES} images only.`);
        break;
      }
      if (!file.type.startsWith("image/")) {
        setFileError("Images only (JPG, PNG, WEBP…).");
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setFileError(`${file.name} is over ${MAX_MB} MB.`);
        continue;
      }
      next.push({ file, preview: URL.createObjectURL(file) });
    }
    setFiles(next);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (i: number) => {
    URL.revokeObjectURL(files[i].preview);
    setFiles(files.filter((_, j) => j !== i));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Please write your name.");
    if (!form.contact.trim()) return setError("Please add a contact (mobile no., FB name or email).");

    setStatus("sending");
    if (!CONVEX_URL) {
      setResult({ code: null, urls: [], warning: "Online saving isn't set up yet — send your design photos in the chat." });
      setStatus("done");
      return;
    }
    try {
      const client = new ConvexHttpClient(CONVEX_URL);
      const ids: GenericId<"_storage">[] = [];
      for (let i = 0; i < files.length; i++) {
        setProgress(`Uploading design ${i + 1} of ${files.length}…`);
        const url = await client.mutation(genUploadUrl, {});
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": files[i].file.type }, body: files[i].file });
        if (!res.ok) throw new Error("upload failed");
        const { storageId } = (await res.json()) as { storageId: GenericId<"_storage"> };
        ids.push(storageId);
      }
      setProgress("Saving your order…");
      const saved = await client.mutation(createOrder, {
        name: form.name,
        contact: form.contact,
        item: form.item,
        qty: form.qty,
        neededBy: form.date,
        notes: form.notes,
        designs: ids,
      });
      setResult(saved);
    } catch {
      setResult({
        code: null,
        urls: [],
        warning: "We couldn't save your order online. No worries — send it below and attach your design photos in the chat.",
      });
    } finally {
      setProgress("");
      setStatus("done");
    }
  };

  const message = [
    `Hi JaSprint & Craft! ${result?.code ? `Order ${result.code}` : "New order"}:`,
    `• Name: ${form.name}`,
    `• Contact: ${form.contact}`,
    `• Item: ${form.item}`,
    `• Quantity: ${form.qty || "—"}`,
    `• Needed by: ${form.date || "—"}`,
    `• Details: ${form.notes || "—"}`,
    ...(result?.urls.length ? ["• Design images:", ...result.urls.map((u, i) => `  ${i + 1}. ${u}`)] : []),
  ].join("\n");

  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(
    `Order ${result?.code ?? "inquiry"}: ${form.item}`,
  )}&body=${encodeURIComponent(message)}`;

  const toFacebook = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      /* clipboard blocked — still open Facebook */
    }
    window.open(FACEBOOK, "_blank", "noopener,noreferrer");
  };

  const startOver = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setForm({ name: "", contact: "", item: ITEMS[0], qty: "", date: "", notes: "" });
    setResult(null);
    setCopied(false);
    setStatus("idle");
  };

  const label = "block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/55";
  const locked = status !== "idle";

  return (
    <div className="receipt relative px-5 pb-12 pt-7 shadow-2xl sm:px-9">
      <div className="flex items-start justify-between gap-4 border-b-2 border-dashed border-ink/25 pb-5">
        <div>
          <p className="font-display text-3xl uppercase leading-none">Order Slip</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink/55 sm:text-[11px]">JaSprint &amp; Craft · Custom Print</p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-ink/55">
          NO. <span className="text-brand">{result?.code ?? "— — —"}</span>
        </p>
      </div>

      <form onSubmit={submit} className="mt-6">
        <fieldset disabled={locked} className="grid gap-6 disabled:opacity-60 sm:grid-cols-2">
          <label>
            <span className={label}>Your name *</span>
            <input className="slip-field" value={form.name} onChange={set("name")} placeholder="Juan Dela Cruz" autoComplete="name" required />
          </label>
          <label>
            <span className={label}>Mobile / FB / email *</span>
            <input className="slip-field" value={form.contact} onChange={set("contact")} placeholder="09XX XXX XXXX" autoComplete="tel" required />
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
            <textarea className="slip-field resize-none" rows={3} value={form.notes} onChange={set("notes")} placeholder="Colors, text, size, placement…" />
          </label>

          {/* design upload */}
          <div className="sm:col-span-2">
            <span className={label}>
              Design images <span className="normal-case tracking-normal text-ink/40">(up to {MAX_FILES}, {MAX_MB} MB each)</span>
            </span>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (!locked) addFiles(e.dataTransfer.files);
              }}
              className={`mt-2 border-2 border-dashed p-3 transition ${dragging ? "border-brand bg-brand/5" : "border-ink/25"}`}
            >
              <div className="grid max-w-md grid-cols-3 gap-3">
                {files.map((f, i) => (
                  <figure key={f.preview} className="group relative aspect-square bg-paper-2 shadow-[2px_2px_0_rgba(0,0,0,0.25)]" style={{ rotate: `${[-2, 1.5, -1][i]}deg` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                    <img src={f.preview} alt={`Design ${i + 1}: ${f.file.name}`} className="h-full w-full object-cover" />
                    <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rotate-[-4deg] bg-brand/70" />
                    {!locked && (
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        aria-label={`Remove ${f.file.name}`}
                        className="absolute right-1 top-1 grid h-7 w-7 place-items-center bg-ink font-mono text-sm text-paper hover:bg-brand"
                      >
                        ×
                      </button>
                    )}
                  </figure>
                ))}
                {files.length < MAX_FILES && (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-1 border border-ink/20 text-center text-ink/55 transition hover:border-brand hover:text-brand"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-7 w-7" aria-hidden>
                      <path d="M12 16V4M7 9l5-5 5 5" />
                      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                    </svg>
                    <span className="px-1 font-mono text-[9px] uppercase tracking-[0.15em] sm:text-[10px]">Add image</span>
                  </button>
                )}
              </div>
              <p className="mt-3 hidden font-mono text-[10px] text-ink/45 sm:block">Tap to add, or drag &amp; drop your logo / photo / sketch here.</p>
              <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} tabIndex={-1} />
            </div>
            {fileError && <p className="mt-2 font-mono text-[11px] text-brand">{fileError}</p>}
          </div>
        </fieldset>

        {status !== "done" && (
          <>
            <button
              type="submit"
              disabled={status === "sending"}
              className="group mt-8 flex w-full items-center justify-between bg-ink px-5 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-paper transition hover:bg-brand disabled:cursor-wait disabled:bg-ink/70"
            >
              {status === "sending" ? progress || "Sending…" : "Submit order slip"}
              <span aria-hidden className="transition group-hover:translate-x-1">→</span>
            </button>
            <p className="mt-3 min-h-5 font-mono text-[11px] text-brand" aria-live="polite">
              {error}
            </p>
          </>
        )}
      </form>

      {status === "done" && result && (
        <div className="relative mt-8 border-t-2 border-dashed border-ink/25 pt-6" aria-live="polite">
          {result.code && (
            <span className="stamp absolute -top-5 right-2 rotate-[-10deg] bg-paper px-3 py-1 font-display text-2xl uppercase tracking-wider">
              Received
            </span>
          )}
          <p className="font-display text-2xl uppercase leading-tight">
            {result.code ? (
              <>
                Order <span className="text-brand">{result.code}</span> saved.
              </>
            ) : (
              "Almost done."
            )}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            {result.warning ??
              "Send it to us on Facebook or email so we can reply faster with your mockup and quote. Your design images are linked in the message."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={toFacebook}
              className="group flex items-center justify-between bg-brand px-5 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-brand-deep"
            >
              Send on Facebook <span aria-hidden className="transition group-hover:translate-x-1">→</span>
            </button>
            <a
              href={mailto}
              className="group flex items-center justify-between border-2 border-ink px-5 py-4 font-mono text-xs font-semibold uppercase tracking-widest transition hover:border-brand hover:text-brand"
            >
              Send via Email <span aria-hidden className="transition group-hover:translate-x-1">→</span>
            </a>
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink/55">
            {copied ? "✓ Order copied — paste it in the Messenger chat." : "Facebook: we copy your order so you can paste it in chat."}
          </p>
          <button type="button" onClick={startOver} className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ink/55 underline underline-offset-4 hover:text-brand">
            New order slip
          </button>
        </div>
      )}
    </div>
  );
}
