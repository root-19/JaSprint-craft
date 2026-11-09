import Image from "next/image";
import type { ReactNode } from "react";
import HeroPrint from "./HeroPrint";
import OrderSlip from "./OrderSlip";
import CropMarks from "./CropMarks";
import MobileMenu from "./MobileMenu";

const FACEBOOK = "https://www.facebook.com/renswashie.acunabelga";
const EMAIL = "rensacuna1@gmail.com";

/* ---------- icons ---------- */
function Icon({ children, className = "h-9 w-9" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}
const Shirt = () => <Icon><path d="M8 3 3 6l2 4 3-1.2V21h8V8.8L19 10l2-4-5-3a4 4 0 0 1-8 0Z" /></Icon>;
const Mug = () => <Icon><path d="M4 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" /><path d="M16 10h2a2 2 0 0 1 0 4h-2" /><path d="M8 3v2M12 3v2" /></Icon>;
const Cap = () => <Icon><path d="M4 15a8 8 0 0 1 16 0Z" /><path d="M4 15h16c2.5 0 2.5 3.5 0 3.5H9" /><path d="M12 7V5.5" /></Icon>;
const Bag = () => <Icon><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></Icon>;
const Gift = () => <Icon><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M5 12v9h14v-9" /><path d="M12 8c-2.5 0-4-1-4-2.5S9.5 3 12 8c2.5-5 4-3.5 4-2.5S14.5 8 12 8Z" /></Icon>;
const Photo = () => <Icon><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 9" /></Icon>;
const Arrow = ({ className = "h-6 w-6" }: { className?: string }) => (
  <Icon className={className}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);

/* ---------- content ---------- */
const menu = [
  { icon: <Shirt />, name: "T-Shirts", desc: "Single tees, team shirts, family reunions and class orders — heat pressed or sublimated.", tags: ["From 1 pc", "Heat press"] },
  { icon: <Mug />, name: "Mugs & Tumblers", desc: "Full-wrap photo, name and logo prints made for everyday use.", tags: ["Full wrap", "Sublimation"] },
  { icon: <Cap />, name: "Caps", desc: "Your logo or text on the front panel. Great for teams and staff.", tags: ["Front print", "Bulk ok"] },
  { icon: <Bag />, name: "Tote Bags", desc: "Event kits, shop merch and everyday carry with your artwork.", tags: ["Logo / art", "Bulk ok"] },
  { icon: <Gift />, name: "Souvenirs & Giveaways", desc: "Keychains, pins and small keepsakes for weddings, birthdays and company events.", tags: ["Events", "Packaging"] },
  { icon: <Photo />, name: "Photo Gifts & Crafts", desc: "Frames, pillows and handmade pieces built around your favorite memories.", tags: ["Personalized", "Handmade"] },
];

const steps = [
  { t: "Send the idea", d: "A photo, a logo, a sketch on tissue — anything works. Tell us the item and quantity." },
  { t: "Approve the mockup", d: "We send a preview first. Nothing gets pressed until you say go.", stamp: "Approved" },
  { t: "We press it", d: "Printed, pressed and checked one by one in the shop." },
  { t: "Pick up or ship", d: "Ready for pickup, or sent to your door." },
];

const occasions = [
  "Weddings", "Birthdays", "Debut", "Baptism", "Company events", "School orgs",
  "Team shirts", "Reunions", "Shop merch", "Christmas giveaways", "Graduation", "Just because",
];

const promises = [
  ["One piece is an order.", "No minimums. One gift or a whole batch for the barangay."],
  ["You see it before we press it.", "Every order starts with a free mockup you approve."],
  ["Rush job? Talk to us.", "Tell us your date and we'll tell you honestly if we can make it."],
];

/* ---------- bits ---------- */
function Wordmark({ size = "text-xl" }: { size?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image src="/mark.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
      <span className={`font-display uppercase leading-none tracking-wide ${size}`}>
        JaSprint <span className="text-brand">&amp;</span> Craft
      </span>
    </span>
  );
}

function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[11px] font-semibold uppercase tracking-[0.25em] ${className}`}>{children}</p>;
}

/** A tape band wider than the viewport, rotated around the page centre, with text scrolling inside. */
function Tape({ words, className, reverse = false }: { words: string[]; className: string; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {[...words, ...words, ...words].map((w, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6">{w}</span>
          <span className="text-[0.6em]">✶</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`absolute left-[-10%] top-1/2 w-[120%] -translate-y-1/2 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${className}`}>
      <div className="marquee flex w-max py-3 font-display text-3xl uppercase sm:text-4xl" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      {/* top strip */}
      <div className="border-b border-paper/10 bg-brand-deep/40 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-hot" /> Now pressing — orders open
          </span>
          <span className="hidden sm:block">Custom printing &amp; crafting solutions</span>
        </div>
      </div>

      {/* nav */}
      <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <a href="#top" aria-label="JaSprint & Craft home">
            <Wordmark />
          </a>
          <ul className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 md:flex">
            {[["01", "Menu", "#menu"], ["02", "Process", "#process"], ["03", "Order", "#order"]].map(([n, t, h]) => (
              <li key={h}>
                <a href={h} className="transition hover:text-paper">
                  <span className="text-brand">{n}</span> {t}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
          <a href="#order" className="group hidden items-center gap-2 bg-brand px-4 py-2.5 sm:flex font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-brand-hot">
            Order slip <Arrow className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <MobileMenu />
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ============ HERO ============ */}
        <section className="heat relative">
          <div aria-hidden className="halftone fade-l pointer-events-none absolute inset-y-0 left-0 w-1/2 text-paper/[0.07]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-12 lg:items-center lg:pt-20">
            <div className="lg:col-span-7">
              <Label className="text-paper/50">
                [ Job 001 <span className="text-brand">/</span> Custom print ]
              </Label>
              <h1 className="mt-6 font-display uppercase leading-[0.9] tracking-[-0.01em] text-[clamp(3.4rem,9vw,7.6rem)]">
                We press
                <br />
                <span className="text-brand">ideas</span> into
                <br />
                <span className="outline-text text-paper">things</span> you
                <br />
                keep.
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-paper/65">
                Custom shirts, mugs, caps, tote bags and souvenirs — designed with you, pressed by hand,
                one piece or a few hundred.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <a href="#order" className="group flex items-center gap-3 bg-brand px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[6px_6px_0_0_var(--paper)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_var(--paper)]">
                  Start an order <Arrow className="h-4 w-4" />
                </a>
                <a href="#menu" className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-paper/70 underline decoration-brand decoration-2 underline-offset-8 transition hover:text-paper">
                  See what we print
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <HeroPrint />
            </div>
          </div>

          {/* spec sheet row */}
          <dl className="relative mx-auto grid max-w-7xl grid-cols-2 border-t border-paper/10 px-5 md:grid-cols-4">
            {[
              ["Min. order", "1 piece"],
              ["Method", "Heat press / sublimation"],
              ["Proof", "Free mockup first"],
              ["Release", "Pickup or delivery"],
            ].map(([k, v], i) => (
              <div key={k} className={`py-6 ${i > 0 ? "md:border-l md:border-paper/10 md:pl-6" : ""} ${i % 2 === 1 ? "border-l border-paper/10 pl-6 md:pl-6" : ""}`}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">{k}</dt>
                <dd className="mt-1.5 font-display text-xl uppercase tracking-wide">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ============ CROSSED TAPE ============ */}
        <div aria-label="Products: t-shirts, mugs, tumblers, caps, tote bags, souvenirs, giveaways" className="relative h-44 overflow-hidden bg-ink sm:h-52">
          <Tape reverse className="rotate-[4deg] bg-paper text-ink" words={["Free mockup", "From 1 piece", "Bulk orders", "Rush jobs", "Made in the shop"]} />
          <Tape className="-rotate-[3deg] bg-linear-to-r from-brand via-brand to-brand-deep text-white" words={["T-Shirts", "Mugs", "Tumblers", "Caps", "Tote bags", "Souvenirs", "Giveaways"]} />
        </div>

        {/* ============ MENU (paper) ============ */}
        <section id="menu" className="relative bg-paper text-ink">
          <div aria-hidden className="halftone fade-r pointer-events-none absolute right-0 top-0 h-80 w-1/2 text-brand/25" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <Label className="text-brand">01 — The menu</Label>
                <h2 className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.9]">
                  What we put
                  <br />
                  your design on.
                </h2>
              </div>
              <p className="max-w-xs font-mono text-xs leading-relaxed text-ink/60 md:col-span-4 md:justify-self-end">
                Price depends on item, quantity and design. Send an order slip for a quote — it&apos;s free.
              </p>
            </div>

            <ul className="mt-10 border-t-2 border-ink sm:mt-16">
              {menu.map((m, i) => (
                <li key={m.name} className="menu-row border-b border-ink/20 hover:text-white">
                  <a href="#order" className="grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 px-2 py-6 sm:px-4 lg:grid-cols-[3rem_3.5rem_minmax(0,1.1fr)_minmax(0,1.3fr)_auto_2rem] lg:gap-x-6">
                    <span className="font-mono text-xs text-ink/40 transition-colors [.menu-row:hover_&]:text-white/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="row-ico hidden text-brand lg:block [.menu-row:hover_&]:text-white">{m.icon}</span>
                    <span className="font-display text-3xl uppercase leading-none sm:text-4xl">{m.name}</span>
                    <span className="col-span-3 max-w-xl text-[15px] leading-relaxed text-ink/65 lg:col-span-1 [.menu-row:hover_&]:text-white/85">{m.desc}</span>
                    <span className="col-span-3 flex flex-wrap gap-2 lg:col-span-1">
                      {m.tags.map((t) => (
                        <span key={t} className="border border-current px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] opacity-70">
                          {t}
                        </span>
                      ))}
                    </span>
                    <span className="row-arrow col-start-3 row-start-1 justify-self-end lg:col-start-auto lg:row-start-auto">
                      <Arrow />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ PROCESS (tickets) ============ */}
        <section id="process" className="relative bg-ink">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
            <div className="grid gap-6 md:grid-cols-2 md:items-end">
              <div>
                <Label className="text-brand">02 — The process</Label>
                <h2 className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.9]">
                  How an order
                  <br />
                  <span className="outline-text">moves</span> through
                  <br />
                  the shop.
                </h2>
              </div>
              <p className="max-w-sm text-paper/60 md:justify-self-end">
                Four stops, one ticket. You always know where your order is.
              </p>
            </div>

            <ol className="mt-10 flex flex-col sm:mt-16 gap-4 lg:flex-row lg:gap-0">
              {steps.map((s, i) => (
                <li key={s.t} className="flex flex-1 lg:items-stretch">
                  <div className="ticket relative flex flex-1 flex-col px-8 pb-8 pt-6">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
                      <span>Stub</span>
                      <span>
                        {String(i + 1).padStart(2, "0")} / 04
                      </span>
                    </div>
                    <span className="mt-6 font-display text-7xl leading-none text-brand">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-4 font-display text-2xl uppercase">{s.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.d}</p>
                    {s.stamp && (
                      <span className="stamp absolute right-6 top-14 rotate-[-14deg] px-3 py-1 font-display text-2xl uppercase tracking-wider">
                        {s.stamp}
                      </span>
                    )}
                    <div className="mt-auto pt-8">
                      <div className="h-6 w-full bg-[repeating-linear-gradient(90deg,var(--ink)_0_2px,transparent_2px_4px,var(--ink)_4px_5px,transparent_5px_8px)] opacity-70" />
                    </div>
                  </div>
                  {i < steps.length - 1 && <span aria-hidden className="perf-v hidden bg-paper lg:block" />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============ PROMISES + OCCASIONS ============ */}
        <section className="heat relative border-t border-paper/10">
          <div aria-hidden className="halftone fade-b pointer-events-none absolute inset-x-0 bottom-0 h-64 text-brand/30" />
          <div className="relative mx-auto grid max-w-7xl gap-16 px-5 py-16 sm:py-24 lg:grid-cols-2">
            <div>
              <Label className="text-brand">Shop rules</Label>
              <ul className="mt-8 divide-y divide-paper/10 border-y border-paper/10">
                {promises.map(([h, d], i) => (
                  <li key={h} className="grid grid-cols-[2.5rem_1fr] gap-4 py-7">
                    <span className="font-mono text-xs text-brand">R{i + 1}</span>
                    <div>
                      <p className="font-display text-3xl uppercase leading-tight sm:text-4xl">{h}</p>
                      <p className="mt-2 text-paper/55">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label className="text-paper/50">Made for</Label>
              <div className="relative mt-8 flex flex-wrap gap-3">
                {occasions.map((o, i) => {
                  const styles = [
                    "bg-brand text-white",
                    "bg-paper text-ink",
                    "border-2 border-paper/70 text-paper",
                    "bg-ink-2 text-paper border border-paper/15",
                  ];
                  const rot = [-4, 3, -2, 5, -6, 2, 4, -3, 1, -5, 3, -2][i];
                  return (
                    <span
                      key={o}
                      style={{ rotate: `${rot}deg` }}
                      className={`inline-block px-4 py-2 font-display text-xl uppercase tracking-wide shadow-[3px_3px_0_0_rgba(0,0,0,0.5)] transition hover:rotate-0! hover:scale-110 sm:text-2xl ${styles[i % styles.length]}`}
                    >
                      {o}
                    </span>
                  );
                })}
              </div>
              <p className="mt-10 max-w-sm font-mono text-xs leading-relaxed text-paper/45">
                Don&apos;t see your occasion? If it can take heat and pressure, we can probably print on it.
              </p>
            </div>
          </div>
        </section>

        {/* ============ ORDER ============ */}
        <section id="order" className="relative bg-ink">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:py-24 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <Label className="text-brand">03 — Order</Label>
              <h2 className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.9]">
                Got an idea?
                <br />
                <span className="text-brand">Fill the slip.</span>
              </h2>
              <p className="mt-6 max-w-sm text-paper/60">
                Fill it in, hit send, and we&apos;ll reply with a mockup and a quote. Prefer to just chat? Reach us directly:
              </p>
              <dl className="mt-10 border-t border-paper/10">
                <div className="flex items-center justify-between gap-4 border-b border-paper/10 py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">Facebook</dt>
                  <dd>
                    <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" className="font-display text-lg uppercase tracking-wide hover:text-brand">
                      Message us ↗
                    </a>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-paper/10 py-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">Email</dt>
                  <dd>
                    <a href={`mailto:${EMAIL}`} className="break-all font-display text-lg tracking-wide hover:text-brand">
                      {EMAIL}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="relative lg:col-span-7">
              <CropMarks className="text-paper/40" />
              <div className="rotate-[-1deg] transition hover:rotate-0">
                <OrderSlip />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="relative overflow-hidden border-t border-paper/10 bg-ink">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/40">
          <Wordmark size="text-base" />
          <span>Made with heat &amp; pressure · © 2026 JaSprint &amp; Craft</span>
        </div>
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center font-display uppercase leading-[0.78] text-[12.5vw] text-paper/[0.06]"
        >
          JaSprint<span className="text-brand/60">&amp;</span>Craft
        </p>
      </footer>
    </div>
  );
}
