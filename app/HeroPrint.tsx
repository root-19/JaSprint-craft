"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import CropMarks from "./CropMarks";

const CYCLE = 7; // seconds per print loop

/** A canvas texture holding the "JS" emblem; it is revealed left-to-right with a scan line, like a print pass. */
function makeDecal(dark: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const draw = (progress: number, alpha: number) => {
    ctx.clearRect(0, 0, 256, 256);
    if (alpha > 0 && progress > 0) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.rect(0, 0, progress * 256, 256);
      ctx.clip();
      ctx.fillStyle = dark ? "#ffffff" : "#e11d2e";
      ctx.beginPath();
      ctx.arc(128, 128, 118, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = dark ? "#e11d2e" : "#ffffff";
      ctx.lineWidth = 7;
      ctx.setLineDash([14, 16]);
      ctx.beginPath();
      ctx.arc(128, 128, 96, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = dark ? "#e11d2e" : "#ffffff";
      ctx.font = "italic 900 112px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("JS", 128, 136);
      ctx.restore();
      if (progress < 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = "#ff2a3d";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#ff4b5c";
        ctx.fillRect(progress * 256 - 3, 8, 6, 240);
        ctx.restore();
      }
    }
    texture.needsUpdate = true;
  };
  draw(0, 0);
  return { texture, draw };
}

function decalMaterial(texture: THREE.Texture) {
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    side: THREE.DoubleSide,
  });
}

function buildShirt(decal: THREE.Texture) {
  const g = new THREE.Group();
  const X = (x: number) => (x - 60) / 36;
  const Y = (y: number) => (60 - y) / 36;
  const s = new THREE.Shape();
  s.moveTo(X(40), Y(18));
  s.lineTo(X(18), Y(30));
  s.lineTo(X(26), Y(50));
  s.lineTo(X(38), Y(45));
  s.lineTo(X(38), Y(102));
  s.lineTo(X(82), Y(102));
  s.lineTo(X(82), Y(45));
  s.lineTo(X(94), Y(50));
  s.lineTo(X(102), Y(30));
  s.lineTo(X(80), Y(18));
  s.quadraticCurveTo(X(60), Y(36), X(40), Y(18));
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.06,
    bevelSegments: 4,
    curveSegments: 16,
  });
  geo.center();
  g.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xf1f1f1, roughness: 0.85 })));
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95), decalMaterial(decal));
  plane.position.set(0, 0.08, 0.2);
  g.add(plane);
  return g;
}

function buildCap(decal: THREE.Texture) {
  const g = new THREE.Group();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.7 }),
  );
  dome.scale.set(1, 0.85, 1);
  g.add(dome);
  const brimMat = new THREE.MeshStandardMaterial({ color: 0xe11d2e, roughness: 0.5 });
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.07, 40, 1, false, -Math.PI / 2, Math.PI), brimMat);
  brim.scale.set(1.0, 1, 1.55);
  brim.position.set(0, 0.02, 0.05);
  g.add(brim);
  const button = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), brimMat);
  button.position.y = 0.86;
  g.add(button);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), decalMaterial(decal));
  plane.position.set(0, 0.47, 0.87);
  plane.rotation.x = -0.63;
  g.add(plane);
  g.position.y = -0.35;
  const wrap = new THREE.Group();
  wrap.add(g);
  return wrap;
}

function buildMug(decal: THREE.Texture) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xf7f7f7, roughness: 0.25, metalness: 0.05 });
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 56), mat));
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.1, 16, 32, Math.PI), mat);
  handle.rotation.z = -Math.PI / 2;
  handle.position.x = 0.78;
  g.add(handle);
  const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.806, 0.806, 1.05, 48, 1, true, -0.62, 1.24), decalMaterial(decal));
  g.add(wrap);
  // inside of mug
  const inner = new THREE.Mesh(new THREE.CircleGeometry(0.7, 40), new THREE.MeshStandardMaterial({ color: 0x3a1b17, roughness: 0.4 }));
  inner.rotation.x = -Math.PI / 2;
  inner.position.y = 0.801;
  g.add(inner);
  return g;
}

function buildTote(decal: THREE.Texture) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xe8d9b5, roughness: 0.95 });
  g.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 0.28), mat));
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xc9b48a, roughness: 0.9 });
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 10, 32, Math.PI), handleMat);
  handle.position.y = 0.9;
  g.add(handle);
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), decalMaterial(decal));
  plane.position.set(0, -0.1, 0.145);
  g.add(plane);
  return g;
}

const JOBS = ["T-Shirt", "Cap", "Mug", "Tote Bag"];

export default function HeroPrint() {
  const host = useRef<HTMLDivElement>(null);
  const pctRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stateRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 11.5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 5, 6);
    scene.add(key);
    const redA = new THREE.PointLight(0xe11d2e, 60, 20);
    redA.position.set(-5, -3, 4);
    scene.add(redA);
    const redB = new THREE.PointLight(0xff4b5c, 30, 20);
    redB.position.set(5, 4, 3);
    scene.add(redB);

    const decals = [makeDecal(false), makeDecal(true), makeDecal(false), makeDecal(false)];
    const items = [
      { obj: buildShirt(decals[0].texture), pos: [-1.9, 1.35], scale: 0.95, delay: 0 },
      { obj: buildCap(decals[1].texture), pos: [1.9, 1.35], scale: 0.95, delay: 0.6 },
      { obj: buildMug(decals[2].texture), pos: [-1.9, -1.45], scale: 0.9, delay: 1.2 },
      { obj: buildTote(decals[3].texture), pos: [1.9, -1.45], scale: 0.85, delay: 1.8 },
    ];
    const pivots = items.map((it) => {
      const p = new THREE.Group();
      p.position.set(it.pos[0], it.pos[1], 0);
      p.scale.setScalar(it.scale);
      p.add(it.obj);
      scene.add(p);
      return p;
    });

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      // keep the whole 2x2 grid in view on narrow containers
      camera.position.z = camera.aspect < 1 ? 11.5 / Math.max(camera.aspect, 0.7) * 0.95 : 11.5;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const t = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      items.forEach((it, i) => {
        const p = pivots[i];
        if (reduced) {
          p.rotation.set(-0.08, -0.25, 0);
          decals[i].draw(1, 1);
          return;
        }
        p.rotation.y = Math.sin(t * 0.7 + i * 1.3) * 0.55 + mouse.x * 0.35;
        p.rotation.x = -0.08 + Math.sin(t * 0.5 + i) * 0.06 + mouse.y * 0.2;
        p.position.y = it.pos[1] + Math.sin(t * 1.1 + i * 0.9) * 0.1;

        const local = (((t - it.delay) % CYCLE) + CYCLE) % CYCLE;
        const progress = t < it.delay ? 0 : clamp01((local - 0.42) / (2.8 - 0.42));
        const alpha = local > 6.16 ? clamp01(1 - (local - 6.16) / 0.56) : 1;
        decals[i].draw(progress, alpha);

        const pct = Math.round(progress * 100);
        const pctEl = pctRefs.current[i];
        if (pctEl && pctEl.textContent !== `${pct}%`) {
          pctEl.textContent = `${pct}%`;
          const bar = barRefs.current[i];
          if (bar) bar.style.transform = `scaleX(${progress})`;
          const st = stateRefs.current[i];
          if (st) st.textContent = pct === 0 ? "Queued" : pct === 100 ? "Done" : "Pressing";
        }
      });
      if (timeRef.current && !reduced) {
        const s = Math.floor(t % 60);
        timeRef.current.textContent = `00:${s.toString().padStart(2, "0")}`;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = o.material as THREE.Material | THREE.Material[];
          (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose());
        }
      });
      decals.forEach((d) => d.texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="relative border border-paper/15 bg-black/40 backdrop-blur-sm">
      <CropMarks className="text-paper/50" />

      <div className="flex items-center justify-between border-b border-paper/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/60">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-hot" /> Press bed · live
        </span>
        <span className="flex gap-4">
          <span>
            Temp <span className="text-brand-hot">180°C</span>
          </span>
          <span className="hidden sm:inline">
            T <span ref={timeRef}>00:00</span>
          </span>
        </span>
      </div>

      <div
        ref={host}
        className="h-[360px] w-full sm:h-[440px]"
        role="img"
        aria-label="3D animation of a design being printed on a t-shirt, cap, mug and tote bag"
      />

      <ol className="grid grid-cols-2 border-t border-paper/15 font-mono text-[10px] uppercase tracking-[0.14em]">
        {JOBS.map((job, i) => (
          <li key={job} className={`px-4 py-3 ${i % 2 === 0 ? "border-r border-paper/15" : ""} ${i < 2 ? "border-b border-paper/15" : ""}`}>
            <div className="flex justify-between text-paper/70">
              <span>
                <span className="text-paper/35">0{i + 1}</span> {job}
              </span>
              <span ref={(el) => { pctRefs.current[i] = el; }} className="text-paper">0%</span>
            </div>
            <span className="mt-2 block h-[3px] bg-paper/10">
              <span
                ref={(el) => { barRefs.current[i] = el; }}
                className="block h-full origin-left bg-linear-to-r from-brand-hot to-brand"
                style={{ transform: "scaleX(0)" }}
              />
            </span>
            <span ref={(el) => { stateRefs.current[i] = el; }} className="mt-1.5 block text-paper/40">Queued</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
