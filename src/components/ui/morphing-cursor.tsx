'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// -----------------------------------------------------------
// MorphingCursorShape
// A thin-stroked polygon that follows the cursor and slowly
// morphs its vertices – exactly like the Parcelles reference.
// -----------------------------------------------------------

/** Generate N random-ish polygon points around a centre */
function buildPoints(n: number, rx: number, ry: number): [number, number][] {
    return Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const jitter = 0.65 + Math.random() * 0.70; // 0.65–1.35 radius
        return [
            Math.cos(angle) * rx * jitter,
            Math.sin(angle) * ry * jitter,
        ] as [number, number];
    });
}

/** Lerp two point arrays toward each other */
function lerpPoints(
    a: [number, number][],
    b: [number, number][],
    t: number
): [number, number][] {
    return a.map(([ax, ay], i) => [
        ax + (b[i][0] - ax) * t,
        ay + (b[i][1] - ay) * t,
    ]);
}

function pointsToPath(pts: [number, number][]): string {
    if (!pts.length) return '';
    const d = pts
        .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
        .join(' ');
    return d + ' Z';
}

const N_VERTS = 7;
const SVG_SIZE = 340;
const RX = SVG_SIZE * 0.36;
const RY = SVG_SIZE * 0.32;

export function MorphingCursorShape() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Raw mouse position
    const rawX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 400);
    const rawY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 300);

    // Smoothed position (spring lag = organic feel)
    const x = useSpring(rawX, { stiffness: 55, damping: 18 });
    const y = useSpring(rawY, { stiffness: 55, damping: 18 });

    // SVG path state
    const [path, setPath] = useState('');
    const currentPts = useRef<[number, number][]>(buildPoints(N_VERTS, RX, RY));
    const targetPts = useRef<[number, number][]>(buildPoints(N_VERTS, RX, RY));
    const progress = useRef(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            rawX.set(e.clientX);
            rawY.set(e.clientY);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, [rawX, rawY]);

    useEffect(() => {
        // Morph loop: every ~2.5s pick a new target shape
        let morphInterval = setInterval(() => {
            targetPts.current = buildPoints(N_VERTS, RX, RY);
            progress.current = 0;
        }, 2500);

        const animate = () => {
            progress.current = Math.min(progress.current + 0.008, 1);
            currentPts.current = lerpPoints(currentPts.current, targetPts.current, progress.current);
            setPath(pointsToPath(currentPts.current));
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            clearInterval(morphInterval);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <motion.div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9998,
                x,
                y,
                translateX: '-50%',
                translateY: '-50%',
            }}
        >
            <svg
                width={SVG_SIZE}
                height={SVG_SIZE}
                viewBox={`${-SVG_SIZE / 2} ${-SVG_SIZE / 2} ${SVG_SIZE} ${SVG_SIZE}`}
                fill="none"
                style={{ overflow: 'visible' }}
            >
                <path
                    d={path}
                    stroke="rgba(0,0,0,0.13)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinejoin="round"
                />
            </svg>
        </motion.div>
    );
}
