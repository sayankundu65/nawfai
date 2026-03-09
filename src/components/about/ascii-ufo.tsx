import { useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   AUTONOMOUS ASCII ECOSYSTEM  –  v4
   ═══════════════════════════════════════════════════════════════════════════

   TWO-SYSTEM ARCHITECTURE:

   ① MAIN SWARM  (~90 particles, 6 concentric rings)
      • Has its own autonomous "brain" — wanders independently even when idle
      • 4 mood-states: WANDER › CURIOUS › ALERT › RETREAT
      • Shape continuously morphs via layered sine noise (each particle unique)
      • Slow formation rotation + individual orbital drift
      • Collision repulsion with smooth falloff around major DOM elements

   ② AMBIENT FIELD  (50 tiny micro-particles scattered full-page)
      • Fixed in document space (they don't follow the swarm by default)
      • Each has own Lissajous-style idle drift
      • Within ~280px of cursor: gently drift toward cursor
      • Within ~180px of main swarm: get pulled into swarm's halo
      • Creates "magnetism" — creature attracts nearby life
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Seeded PRNG (no deps) ──────────────────────────────────────────────────
const rng = (seed: number) => {
    let s = (seed + 1) * 48271;
    return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
};

// ── Glyphs ────────────────────────────────────────────────────────────────
const G: string[][] = [
    ["◉", "●", "◎", "○", "◌", "◉"],     // pool 0 — core
    ["○", "◦", "◯", "○", "◎", "◦"],     // pool 1 — inner
    ["◦", "·", "°", "◦", "∘", "·"],     // pool 2 — mid
    ["·", "·", "∙", "·", " ", "·"],     // pool 3 — outer
    ["·", " ", "·", " ", "·", " "],     // pool 4 — halo (very sparse)
];

// ── Obstacle selector (major blocks only) ────────────────────────────────
const OBS = "h1,h2,h3,button,nav,.glass-card,.problem-block,.studio-card,.speed-card,.influence-card";

interface Obs { l: number; t: number; r: number; b: number; }

// ── Particle (main swarm) ─────────────────────────────────────────────────
interface SP {
    ring: number;
    angle0: number;   // home angle
    rad0: number;     // home radius
    x: number; y: number;
    vx: number; vy: number;
    // per-particle breathing noise
    pX: number; pY: number;      // phase X/Y
    aX: number; aY: number;      // amplitude X/Y
    fX: number; fY: number;      // frequency X/Y
    // glyph
    pool: number;
    glT: number;
    glS: number;
    // visual
    op0: number;
    fs: number;
    el: HTMLSpanElement | null;
}

// ── Ambient particle ──────────────────────────────────────────────────────
interface AP {
    // base world pos (fixed in document)
    bx: number;
    by: number;
    // current world pos
    x: number; y: number;
    vx: number; vy: number;
    // Lissajous
    pX: number; pY: number;
    fX: number; fY: number;
    aX: number; aY: number;
    op0: number;
    el: HTMLSpanElement | null;
}

// ── Swarm brain states ────────────────────────────────────────────────────
type Mood = "WANDER" | "CURIOUS" | "ALERT" | "RETREAT";

// ── Build main swarm formation ────────────────────────────────────────────
function makeSwarm(): Omit<SP, "el">[] {
    const out: Omit<SP, "el">[] = [];

    // [count, radius, fontSize, baseOpacity, glyphPool]
    const rings: [number, number, number, number, number][] = [
        [1, 0, 28, 0.95, 0],
        [7, 32, 22, 0.85, 0],
        [13, 68, 16, 0.60, 1],
        [19, 110, 12, 0.38, 2],
        [24, 155, 9, 0.22, 3],
        [26, 200, 7, 0.11, 4],
    ];

    rings.forEach(([cnt, rad, fs, op0, pool], ri) => {
        const r = rng(ri * 100 + 7);
        for (let i = 0; i < cnt; i++) {
            const rr = rng(ri * 200 + i * 31 + 5);
            const angle0 = cnt === 1 ? 0 : (i / cnt) * Math.PI * 2 + rr() * 0.35;
            const radius = rad + rr() * (rad * 0.12 + 4);
            const ampScale = 6 + ri * 9;   // outer rings breathe WAY more
            out.push({
                ring: ri, angle0, rad0: radius,
                x: 0, y: 0, vx: 0, vy: 0,
                pX: rr() * Math.PI * 2, pY: rr() * Math.PI * 2,
                aX: ampScale * (0.6 + rr() * 0.8),
                aY: ampScale * (0.6 + rr() * 0.8),
                fX: 0.0003 + rr() * 0.0008,
                fY: 0.0003 + rr() * 0.0008,
                pool, glT: rr() * 200, glS: 0.003 + rr() * 0.007,
                op0, fs,
            });
        }
    });
    return out;
}

// ── Build ambient field ────────────────────────────────────────────────────
function makeAmbient(docH: number): Omit<AP, "el">[] {
    const out: Omit<AP, "el">[] = [];
    const count = 55;
    for (let i = 0; i < count; i++) {
        const r = rng(i * 77 + 13);
        const bx = r() * window.innerWidth;
        const by = r() * docH;
        out.push({
            bx, by, x: bx, y: by, vx: 0, vy: 0,
            pX: r() * Math.PI * 2, pY: r() * Math.PI * 2,
            fX: 0.0002 + r() * 0.0005,
            fY: 0.0002 + r() * 0.0005,
            aX: 8 + r() * 20,
            aY: 8 + r() * 20,
            op0: 0.06 + r() * 0.12,
        });
    }
    return out;
}

// ═════════════════════════════════════════════════════════════════════════════
export function AsciiUfo() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Main swarm state
    const swarmPos = useRef({ x: window.innerWidth * 0.75, y: window.innerHeight * 0.3 });
    const swarmVel = useRef({ x: 0, y: 0 });

    // Brain
    const brainTarget = useRef({ x: window.innerWidth * 0.6, y: window.innerHeight * 0.4 });
    const mood = useRef<Mood>("WANDER");
    const moodTimer = useRef(0);
    const wanderTimer = useRef(0);
    const frustration = useRef(0);

    // Mouse
    const mouse = useRef({ x: -9999, y: -9999 });
    const mouseActive = useRef(false);
    const mouseTimer = useRef(0);

    // Obstacles
    const obs = useRef<Obs[]>([]);

    // RAF
    const raf = useRef(0);
    const t0 = useRef(Date.now());

    // ── Cache obstacles ──────────────────────────────────────────────────
    const cacheObs = useCallback(() => {
        const pad = 22;
        const vh = window.innerHeight;
        const list: Obs[] = [];
        document.querySelectorAll(OBS).forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.bottom < -400 || r.top > vh + 400 || r.width < 8 || r.height < 8) return;
            list.push({ l: r.left - pad, t: r.top - pad, r: r.right + pad, b: r.bottom + pad });
        });
        obs.current = list;
    }, []);

    // ── Obstacle repulsion (particle level) ──────────────────────────────
    const repel = useCallback((px: number, py: number, range = 60, str = 28) => {
        let fx = 0, fy = 0;
        for (const o of obs.current) {
            const nearX = Math.max(o.l, Math.min(px, o.r));
            const nearY = Math.max(o.t, Math.min(py, o.b));
            const dx = px - nearX, dy = py - nearY;
            const inside = px > o.l && px < o.r && py > o.t && py < o.b;
            const d = inside ? 0 : Math.sqrt(dx * dx + dy * dy);
            if (d < range) {
                const n = 1 - d / range;
                const f = str * n * n * n;
                if (inside) {
                    // Blend two shortest exits
                    const exits = [
                        { ax: -(px - o.l), ay: 0 }, { ax: o.r - px, ay: 0 },
                        { ax: 0, ay: -(py - o.t) }, { ax: 0, ay: o.b - py },
                    ].sort((a, b) => Math.abs(a.ax + a.ay) - Math.abs(b.ax + b.ay));
                    fx += (exits[0].ax + exits[1].ax * 0.35) * f * 0.3;
                    fy += (exits[0].ay + exits[1].ay * 0.35) * f * 0.3;
                } else {
                    const len = d || 1;
                    fx += (dx / len) * f;
                    fy += (dy / len) * f;
                }
            }
        }
        return { fx, fy };
    }, []);

    // ── Swarm-center obstacle steering ───────────────────────────────────
    const steer = useCallback((sx: number, sy: number) => {
        let fx = 0, fy = 0;
        for (const o of obs.current) {
            const nearX = Math.max(o.l, Math.min(sx, o.r));
            const nearY = Math.max(o.t, Math.min(sy, o.b));
            const dx = sx - nearX, dy = sy - nearY;
            const inside = sx > o.l && sx < o.r && sy > o.t && sy < o.b;
            const d = inside ? 0 : Math.sqrt(dx * dx + dy * dy);
            if (d < 140) {
                const n = 1 - d / 140;
                const f = 0.9 * n * n;
                if (!inside) { const len = d || 1; fx += (dx / len) * f; fy += (dy / len) * f; }
                else { fy -= f * 2.5; }
            }
        }
        return { fx, fy };
    }, []);

    // ── Autonomous brain: picks wander targets ────────────────────────────
    const newWanderTarget = useCallback(() => {
        // Find a random viewport position that's not inside an obstacle
        const margin = 120;
        for (let attempt = 0; attempt < 30; attempt++) {
            const r = rng(Date.now() % 999983 + attempt * 17);
            const tx = margin + r() * (window.innerWidth - margin * 2);
            const ty = margin + r() * (window.innerHeight - margin * 2);
            const blocked = obs.current.some(o =>
                tx > o.l - 80 && tx < o.r + 80 && ty > o.t - 80 && ty < o.b + 80
            );
            if (!blocked) return { x: tx, y: ty };
        }
        return { x: window.innerWidth * 0.7, y: window.innerHeight * 0.3 };
    }, []);

    // ── Main effect ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current) return;
        const el = containerRef.current;

        // ── Spawn main swarm ───────────────────────────────────────────────
        const swarmDef = makeSwarm();
        const scx = swarmPos.current.x, scy = swarmPos.current.y;

        const swarm: SP[] = swarmDef.map((p, idx) => {
            const x0 = scx + Math.cos(p.angle0) * p.rad0;
            const y0 = scy + Math.sin(p.angle0) * p.rad0;
            const span = document.createElement("span");
            span.textContent = G[p.pool][0];
            span.style.cssText = `
        position:fixed; pointer-events:none;
        font-family:'SF Mono','Fira Code','JetBrains Mono',monospace;
        font-size:${p.fs}px; line-height:1;
        color:rgb(0,255,102);
        text-shadow:0 0 6px rgba(0,255,102,0.55),0 0 14px rgba(0,255,102,0.2);
        will-change:transform,opacity,color; z-index:3; opacity:0;
        transform:translate(${x0}px,${y0}px) translate(-50%,-50%);
      `;
            el.appendChild(span);
            return { ...p, x: x0, y: y0, el: span };
        });

        // ── Spawn ambient field ────────────────────────────────────────────
        const docH = Math.max(document.body.scrollHeight, window.innerHeight * 3);
        const ambDef = makeAmbient(docH);
        const ambient: AP[] = ambDef.map((p) => {
            const span = document.createElement("span");
            span.textContent = Math.random() > 0.5 ? "·" : "◦";
            span.style.cssText = `
        position:absolute; pointer-events:none;
        font-family:'SF Mono','Fira Code',monospace;
        font-size:10px; line-height:1;
        color:rgb(0,255,102);
        text-shadow:0 0 4px rgba(0,255,102,0.3);
        will-change:transform,opacity,color; z-index:2; opacity:0;
        transform:translate(${p.bx}px,${p.by}px) translate(-50%,-50%);
      `;
            el.appendChild(span);
            return { ...p, el: span };
        });

        cacheObs();

        // Staggered fade-in
        swarm.forEach((p, i) => {
            setTimeout(() => { if (p.el) p.el.style.opacity = String(p.op0); }, 2000 + p.ring * 250 + i * 12);
        });
        ambient.forEach((p, i) => {
            setTimeout(() => { if (p.el) p.el.style.opacity = String(p.op0); }, 3500 + i * 40);
        });

        // ── Events ────────────────────────────────────────────────────────
        const onMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            mouseActive.current = true;
            mouseTimer.current = Date.now();
        };
        let stTick = false;
        const onScroll = () => {
            if (!stTick) {
                stTick = true;
                requestAnimationFrame(() => { cacheObs(); stTick = false; });
            }
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", cacheObs);

        // ── Physics constants ──────────────────────────────────────────────
        const SWARM_K = 0.014;  // swarm center spring stiffness
        const SWARM_DAMP = 0.90;  // swarm center damping
        const P_K = 0.042; // particle spring stiffness
        const P_DAMP = 0.85;  // particle damping
        const ROT_SPEED = 0.00006;

        // ── MAIN LOOP ─────────────────────────────────────────────────────
        const tick = () => {
            const now = Date.now();
            const t = now - t0.current;

            const mx = mouse.current.x;
            const my = mouse.current.y;
            const sx = swarmPos.current.x;
            const sy = swarmPos.current.y;

            // Mouse idle detection
            if (mouseActive.current && now - mouseTimer.current > 3000) {
                mouseActive.current = false;
            }

            // ── Brain / Mood state machine ─────────────────────────────────
            const mdx = mx - sx, mdy = my - sy;
            const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (now - moodTimer.current > 200) {
                moodTimer.current = now;

                const prevMood = mood.current;
                if (!mouseActive.current) {
                    mood.current = "WANDER";
                } else if (mouseDist < 100) {
                    mood.current = "RETREAT";
                } else if (mouseDist < 250) {
                    mood.current = "ALERT";
                } else if (mouseDist < 500) {
                    mood.current = "CURIOUS";
                } else {
                    mood.current = "WANDER";
                }

                // Start a new wander target periodically (every 4-7s when wandering)
                if (mood.current === "WANDER" && now - wanderTimer.current > 4000 + Math.random() * 3000) {
                    wanderTimer.current = now;
                    brainTarget.current = newWanderTarget();
                }
                // When transitioning from wander → cursor modes, snap brain to mouse-offset
                if (prevMood === "WANDER" && mood.current !== "WANDER") {
                    wanderTimer.current = now; // reset wander so it won't interrupt
                }
            }

            // ── Compute swarm center target ────────────────────────────────
            let targetX: number, targetY: number;
            const CURIOUS_DIST = 90;   // Flies much closer to inspect cursor
            const ALERT_DIST = 160;
            const RETREAT_DIST = 320;

            switch (mood.current) {
                case "CURIOUS": {
                    // Orbit cursor, tilting closer
                    const angle = Math.atan2(mdy, mdx);
                    targetX = mx - Math.cos(angle) * CURIOUS_DIST;
                    targetY = my - Math.sin(angle) * CURIOUS_DIST;
                    break;
                }
                case "ALERT": {
                    // Mirror cursor — stay further back
                    const angle = Math.atan2(mdy, mdx);
                    targetX = mx - Math.cos(angle) * ALERT_DIST;
                    targetY = my - Math.sin(angle) * ALERT_DIST;
                    break;
                }
                case "RETREAT": {
                    // Actively move away from cursor (flee slightly)
                    const angle = Math.atan2(mdy, mdx);
                    targetX = mx - Math.cos(angle) * RETREAT_DIST;
                    targetY = my - Math.sin(angle) * RETREAT_DIST;
                    break;
                }
                default: { // WANDER
                    targetX = brainTarget.current.x;
                    targetY = brainTarget.current.y;
                    break;
                }
            }

            // Clamp
            targetX = Math.max(110, Math.min(window.innerWidth - 110, targetX));
            targetY = Math.max(90, Math.min(window.innerHeight - 90, targetY));

            // Obstacle steer for swarm center
            const { fx: sFx, fy: sFy } = steer(sx, sy);

            // Compute frustration: if the swarm is pushing hard against an obstacle
            const steerForce = Math.sqrt(sFx * sFx + sFy * sFy);

            // Being chased extremely closely also builds minor frustration
            const chased = mouseActive.current && mouseDist < 80;

            if (steerForce > 0.08 || chased) {
                frustration.current = Math.min(1, frustration.current + 0.015);
            } else {
                frustration.current = Math.max(0, frustration.current - 0.01);
            }

            // Calculate current color based on frustration
            const rCol = Math.round(0 + frustration.current * 255);
            const gCol = Math.round(255 - frustration.current * 205); // 255 -> 50
            const bCol = Math.round(102 - frustration.current * 52);  // 102 -> 50
            const rgbStr = `rgb(${rCol},${gCol},${bCol})`;
            const rgbaStrBase = `rgba(${rCol},${gCol},${bCol},`;

            // Spring toward target
            swarmVel.current.x = (swarmVel.current.x + (targetX - sx) * SWARM_K + sFx) * SWARM_DAMP;
            swarmVel.current.y = (swarmVel.current.y + (targetY - sy) * SWARM_K + sFy) * SWARM_DAMP;
            swarmPos.current.x += swarmVel.current.x;
            swarmPos.current.y += swarmVel.current.y;

            const scx = swarmPos.current.x;
            const scy = swarmPos.current.y;

            // ── Mood-dependent scale factor ────────────────────────────────
            // FRUSTRATED: fast panting; ALERT/RETREAT: contract; WANDER: slightly expanded; CURIOUS: normal
            let scaleFactor = 1.0;
            if (frustration.current > 0.5) scaleFactor = 0.85 + Math.sin(t * 0.04) * 0.2; // cute fast panting
            else if (mood.current === "ALERT") scaleFactor = 0.80;
            else if (mood.current === "RETREAT") scaleFactor = 0.65;
            else if (mood.current === "WANDER") scaleFactor = 1.12 + Math.sin(t * 0.0003) * 0.1;

            const isMad = frustration.current > 0.5;

            // ── Update swarm particles ─────────────────────────────────────
            for (const p of swarm) {
                if (!p.el) continue;

                // Organic breathing — layered sines per particle (unique phases)
                const bx = Math.sin(t * p.fX * 1.4 + p.pX) * p.aX
                    + Math.sin(t * p.fX * 0.6 + p.pX * 1.7) * p.aX * 0.45;
                const by = Math.cos(t * p.fY * 1.2 + p.pY) * p.aY
                    + Math.cos(t * p.fY * 0.8 + p.pY * 1.3) * p.aY * 0.45;

                // Rotation + scaled radius
                const angle = p.angle0 + t * ROT_SPEED;
                const rad = p.rad0 * scaleFactor;

                // Rest position = swarm center + rotated home + breathing noise
                let restX = scx + Math.cos(angle) * rad + bx;
                let restY = scy + Math.sin(angle) * rad + by;

                // Cute frustrated jitter
                if (isMad) {
                    restX += (Math.random() - 0.5) * 12 * frustration.current;
                    restY += (Math.random() - 0.5) * 12 * frustration.current;
                }

                // Spring force → rest
                const springFx = (restX - p.x) * P_K;
                const springFy = (restY - p.y) * P_K;

                // Obstacle repulsion
                const { fx: rFx, fy: rFy } = repel(p.x, p.y);

                // Integrate
                p.vx = (p.vx + springFx + rFx) * P_DAMP;
                p.vy = (p.vy + springFy + rFy) * P_DAMP;

                // Clamp velocity
                const vLen = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (vLen > 15) { p.vx *= 15 / vLen; p.vy *= 15 / vLen; }

                p.x += p.vx;
                p.y += p.vy;

                // Glyph cycling
                p.glT += p.glS;
                const pool = G[p.pool];
                const gi = Math.floor(p.glT) % pool.length;
                if (p.el.textContent !== pool[gi]) p.el.textContent = pool[gi];

                // Direct color update
                p.el.style.color = rgbStr;
                p.el.style.textShadow = `0 0 6px ${rgbaStrBase}0.55), 0 0 14px ${rgbaStrBase}0.2)`;

                // Opacity — proximity to cursor brightens
                const pdx = p.x - mx, pdy = p.y - my;
                const pd = Math.sqrt(pdx * pdx + pdy * pdy);
                const boost = pd < 200 ? (1 - pd / 200) * 0.5 : 0;
                const opBreathe = 1 + Math.sin(t * p.fX * 2 + p.pX) * 0.18;
                const targetOp = Math.min(0.98, p.op0 * opBreathe + boost);
                const curOp = parseFloat(p.el.style.opacity) || 0;
                p.el.style.opacity = String(curOp + (targetOp - curOp) * 0.07);

                // Apply transform (single CSS property = no layout reflow)
                p.el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-50%)`;
            }

            // ── Update ambient particles ───────────────────────────────────
            const scrollY = window.scrollY;

            for (const p of ambient) {
                if (!p.el) continue;

                // Idle Lissajous drift around base position
                const idleX = p.bx + Math.sin(t * p.fX + p.pX) * p.aX;
                const idleY = p.by + Math.cos(t * p.fY + p.pY) * p.aY;

                // Viewport position of this ambient particle
                const vpX = p.x;
                const vpY = p.y - scrollY;

                // Distance to cursor (viewport coords)
                const cdx = mx - vpX, cdy = my - vpY;
                const cd = Math.sqrt(cdx * cdx + cdy * cdy);

                // Distance to swarm center (both in viewport)
                const sdx = scx - vpX, sdy = scy - vpY;
                const sd = Math.sqrt(sdx * sdx + sdy * sdy);

                let ax = 0, ay = 0;

                // Cursor attraction (within 280px)
                if (cd < 280 && mouseActive.current) {
                    const n = 1 - cd / 280;
                    const f = 0.08 * n * n;
                    ax += (cdx / (cd || 1)) * f;
                    ay += (cdy / (cd || 1)) * f;
                }

                // Swarm center attraction (within 200px) — pulled into halo
                if (sd < 200) {
                    const n = 1 - sd / 200;
                    const f = 0.06 * n * n;
                    ax += (sdx / (sd || 1)) * f;
                    ay += (sdy / (sd || 1)) * f;
                }

                // Spring toward idle position (world space)
                const worldIdleX = idleX;
                const worldIdleY = idleY;
                const springF = 0.018;
                ax += (worldIdleX - p.x) * springF;
                ay += (worldIdleY - p.y) * springF;

                p.vx = (p.vx + ax) * 0.88;
                p.vy = (p.vy + ay) * 0.88;

                p.x += p.vx;
                p.y += p.vy;

                // Direct color update for ambients
                p.el.style.color = rgbStr;
                p.el.style.textShadow = `0 0 4px ${rgbaStrBase}0.3)`;

                // DOM: use absolute position (document space) for ambient field
                p.el.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-50%)`;

                // Opacity: brighter near cursor / swarm
                const minD = Math.min(cd / 280, sd / 200, 1);
                const boost = (1 - minD) * 0.3;
                const curOp = parseFloat(p.el.style.opacity) || 0;
                const tgt = p.op0 + boost;
                p.el.style.opacity = String(curOp + (tgt - curOp) * 0.06);
            }

            raf.current = requestAnimationFrame(tick);
        };

        raf.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf.current);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", cacheObs);
            swarm.forEach(p => p.el?.parentNode?.removeChild(p.el));
            ambient.forEach(p => p.el?.parentNode?.removeChild(p.el));
        };
    }, [cacheObs, repel, steer, newWanderTarget]);

    // Container — fixed for swarm particles (z:3), absolute for ambients (z:2)
    // Ambient particles use absolute positioning so they live in document space
    return (
        <div
            className="hidden md:block"
            ref={containerRef}
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "visible",
                zIndex: 2,
            }}
        />
    );
}
