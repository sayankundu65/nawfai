import { useRef } from "react";
import { motion, useScroll, useTransform, useInView, useSpring } from "motion/react";
import { cn } from "../../lib/utils";

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
    speed?: number;       // Higher = more parallax travel
    direction?: "up" | "down";
    floatAmp?: number;    // Float oscillation amplitude in px (default 8)
    floatDuration?: number; // Float cycle duration in seconds (default 4.5)
}

// Fixed float params so values are stable across renders
const FLOAT_DEFAULTS = { amp: 8, dur: 4.5 };

export function ParallaxImage({
    src,
    alt,
    className,
    speed = 1,
    direction = "up",
    floatAmp = FLOAT_DEFAULTS.amp,
    floatDuration = FLOAT_DEFAULTS.dur,
}: ParallaxImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // ── Parallax scroll ──────────────────────────────────────────────────────
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });
    const yRange = 100 * speed;
    const rawY = useTransform(
        scrollYProgress,
        [0, 1],
        direction === "up" ? [yRange, -yRange] : [-yRange, yRange]
    );
    // Gentle spring smoothing on the parallax y so it feels liquid
    const smoothY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 1 });

    // ── Entry spring pop-in (same as home bubbles) ───────────────────────────
    const isInView = useInView(containerRef, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={containerRef}
            // Parallax translate applied here
            style={{ y: smoothY }}
            className={cn(
                "absolute z-50 pointer-events-none select-none",
                // Square bounding box — the circle clip is on the inner div
                "aspect-square",
                className
            )}
        >
            {/* Entry spring animation wrapper */}
            <motion.div
                className="w-full h-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.05 }}
            >
                {/* Continuous gentle float */}
                <motion.div
                    className="w-full h-full"
                    animate={{ y: [-floatAmp, floatAmp, -floatAmp] }}
                    transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Circle clip — image only, no border ring */}
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                        style={{
                            borderRadius: "50%",
                            display: "block",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                        }}
                        draggable={false}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
