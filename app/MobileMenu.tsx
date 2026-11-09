"use client";

import { useEffect, useState } from "react";

const LINKS = [
  ["01", "Menu", "#menu"],
  ["02", "Process", "#process"],
  ["03", "Order slip", "#order"],
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="grid h-11 w-11 place-items-center border border-paper/20 transition hover:border-brand"
      >
        <span className="relative block h-3 w-5">
          <span className={`absolute left-0 h-0.5 w-5 bg-paper transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-paper transition ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 h-0.5 w-5 bg-paper transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
        </span>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-paper/10 bg-ink/95 backdrop-blur-md"
      >
        <ul className="mx-auto max-w-7xl px-5 py-2">
          {LINKS.map(([n, t, h]) => (
            <li key={h} className="border-b border-paper/10 last:border-0">
              <a href={h} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4 font-display text-3xl uppercase">
                <span className="font-mono text-xs text-brand">{n}</span> {t}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
