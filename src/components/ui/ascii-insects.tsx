import { useEffect, useRef } from "react";

// ── ASCII insect shapes ────────────────────────────────────────────────────────
//  Each insect has 2 animation frames that alternate to give a walking feel.
//  Multi-line strings use \n — the span uses white-space:pre so they render.
const INSECTS = [
    // Beetle with antennae – frame A / B (antenna tip alternates)
    {
        frames: [
            "  |/)\n°·-·=\n /|+=\n `·'",
            "  |/)\n°·-·-\n /|\\=\n `·'",
        ],
        speed: 0.65,
    },
    // Beetle variant – wings open/close
    {
        frames: [
            "  |/)\n°·-·-\n/|\\~\n`·' ",
            "  |/)\n°·-·=\n/|\\=\n`·' ",
        ],
        speed: 0.6,
    },
    // Big spider / crab – eye blinks, legs alternate
    {
        frames: [
            " /(_, \\ .·\\)\n/(o)·/ \\~}\n——`<'`·'/\n  <'< `—,",
            " /(_, \\ .·\\)\n/(—)·/ \\~}\n——`<'`·'/\n  <'< `—,",
        ],
        speed: 0.5,
    },
    // Crab variant – legs splay out
    {
        frames: [
            " /(_, \\ .·\\)\n) = /—~}\n——`<'`·'/\n  <'< `—,",
            " /(_, \\ .·\\)\n) o /—~}\n——`<'`·'/\n  <'< `—,",
        ],
        speed: 0.45,
    },
    // Crawling bug – simple left-right
    {
        frames: [
            "—,o/~'/ |—`",
            ">o/~') —\\`",
        ],
        speed: 1.05,
    },
    // Crawling bug variant
    {
        frames: [
            "—,/~'/ |—`",
            ">o/~—) |\\`",
        ],
        speed: 0.95,
    },
    // Tiny ant
    {
        frames: [
            "°>»<°",
            "°<«>°",
        ],
        speed: 1.2,
    },
    // Moth / fly
    {
        frames: [
            "»~O~«",
            "«~O~»",
        ],
        speed: 1.1,
    },
];

const COUNT = 18; // number of insects
const FONT_SIZE = 11; // px, monospace – slightly smaller for multi-line art

interface Bug {
    x: number;
    y: number;
    vx: number;
    vy: number;
    angle: number; // radians – current heading
    insectIdx: number;
    frame: number;
    frameTimer: number;
    framePeriod: number; // ticks between frame flips
    wanderTheta: number; // offset for wander steering
    speed: number;
}

function createBug(pageW: number, pageH: number, idx: number): Bug {
    const insectIdx = idx % INSECTS.length;
    const angle = Math.random() * Math.PI * 2;
    const speed = INSECTS[insectIdx].speed * (0.6 + Math.random() * 0.8);
    return {
        x: Math.random() * pageW,
        y: Math.random() * pageH,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        insectIdx,
        frame: 0,
        frameTimer: 0,
        framePeriod: 20 + Math.floor(Math.random() * 22),
        wanderTheta: Math.random() * Math.PI * 2,
        speed,
    };
}

// Wander steering (Craig Reynolds-style)
function steer(bug: Bug, pageW: number, pageH: number) {
    const WANDER_RADIUS = 30;
    const WANDER_DIST = 60;
    const WANDER_JITTER = 0.18;
    const MARGIN = 80; // boundary avoidance zone
    const BOUNDARY_FORCE = 2.5;

    // 1) Wander
    bug.wanderTheta += (Math.random() - 0.5) * WANDER_JITTER * 2;
    const wanderX = bug.vx / (bug.speed || 1) * WANDER_DIST + Math.cos(bug.wanderTheta) * WANDER_RADIUS;
    const wanderY = bug.vy / (bug.speed || 1) * WANDER_DIST + Math.sin(bug.wanderTheta) * WANDER_RADIUS;

    let steerX = wanderX - bug.vx;
    let steerY = wanderY - bug.vy;

    // 2) Boundary avoidance – push away from edges
    if (bug.x < MARGIN) steerX += BOUNDARY_FORCE * (1 - bug.x / MARGIN);
    if (bug.x > pageW - MARGIN) steerX -= BOUNDARY_FORCE * (1 - (pageW - bug.x) / MARGIN);
    if (bug.y < MARGIN) steerY += BOUNDARY_FORCE * (1 - bug.y / MARGIN);
    if (bug.y > pageH - MARGIN) steerY -= BOUNDARY_FORCE * (1 - (pageH - bug.y) / MARGIN);

    // 3) Apply steering (with max force)
    const MAX_FORCE = 0.25;
    const mag = Math.sqrt(steerX * steerX + steerY * steerY) || 1;
    if (mag > MAX_FORCE) { steerX = (steerX / mag) * MAX_FORCE; steerY = (steerY / mag) * MAX_FORCE; }

    bug.vx += steerX;
    bug.vy += steerY;

    // 4) Limit speed
    const spd = Math.sqrt(bug.vx * bug.vx + bug.vy * bug.vy) || 1;
    const maxSpeed = bug.speed * 1.8;
    if (spd > maxSpeed) { bug.vx = (bug.vx / spd) * maxSpeed; bug.vy = (bug.vy / spd) * maxSpeed; }

    bug.angle = Math.atan2(bug.vy, bug.vx);

    bug.x += bug.vx;
    bug.y += bug.vy;

    // Hard-clamp to page
    bug.x = Math.max(0, Math.min(pageW, bug.x));
    bug.y = Math.max(0, Math.min(pageH, bug.y));
}

export function AsciiInsects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const bugsRef = useRef<Bug[]>([]);
    const rafRef = useRef<number>(0);
    const tickRef = useRef<number>(0);
    const spansRef = useRef<HTMLSpanElement[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const pageW = () => document.documentElement.scrollWidth;
        const pageH = () => document.documentElement.scrollHeight;

        // Initialise bugs
        bugsRef.current = Array.from({ length: COUNT }, (_, i) =>
            createBug(pageW(), pageH(), i)
        );

        // Create DOM spans (much faster than innerHTML rewrite)
        container.innerHTML = "";
        spansRef.current = bugsRef.current.map(() => {
            const span = document.createElement("span");
            span.style.cssText = `
        position: absolute;
        font-family: 'Space Mono', monospace;
        font-size: ${FONT_SIZE}px;
        line-height: 1.3;
        white-space: pre;
        pointer-events: none;
        user-select: none;
        color: rgba(0,0,0,0.22);
        transition: color 0.8s;
        will-change: transform;
      `;
            container.appendChild(span);
            return span;
        });

        let lastTime = performance.now();

        const loop = (now: number) => {
            const dt = Math.min((now - lastTime) / 16, 3); // normalise to 60fps
            lastTime = now;
            tickRef.current++;

            const pw = pageW();
            const ph = pageH();

            bugsRef.current.forEach((bug, i) => {
                // Accumulate fractional movement with dt
                for (let s = 0; s < dt; s++) steer(bug, pw, ph);

                // Animate frames
                bug.frameTimer++;
                if (bug.frameTimer >= bug.framePeriod) {
                    bug.frameTimer = 0;
                    const insect = INSECTS[bug.insectIdx];
                    bug.frame = (bug.frame + 1) % insect.frames.length;
                }

                // Pick frame based on horizontal direction
                const insect = INSECTS[bug.insectIdx];
                const goingRight = bug.vx >= 0;
                const frameIdx = goingRight ? bug.frame : (bug.frame + 1) % insect.frames.length;
                const text = insect.frames[frameIdx % insect.frames.length];

                const span = spansRef.current[i];
                if (span) {
                    span.textContent = text;
                    span.style.transform = `translate(${Math.round(bug.x)}px, ${Math.round(bug.y)}px)`;
                }
            });

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
                overflow: "hidden",
            }}
        />
    );
}
