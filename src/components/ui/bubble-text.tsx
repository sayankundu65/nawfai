import { useState } from "react";

interface BubbleTextProps {
    text: string;
    /** Tailwind text-size class, default "text-[clamp(44px,9vw,108px)]" */
    sizeClass?: string;
    /** Colour for unhovered state text, default white */
    baseColor?: string;
    /** Colour for the hovered char (distance 0), default #00FF66 */
    accentColor?: string;
    /** Optional extra className on the wrapping element */
    className?: string;
}

/**
 * BubbleText — proximity-aware weight/color ripple on hover.
 * Adapted from the shadcn community component; tuned for NAWF's brand.
 */
export function BubbleText({
    text,
    sizeClass = "",
    baseColor = "rgb(255,255,255)",
    accentColor = "#00FF66",
    className = "",
}: BubbleTextProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    return (
        <span
            onMouseLeave={() => setHoveredIdx(null)}
            className={`font-black tracking-tighter uppercase leading-none ${sizeClass} ${className}`}
            style={{ display: "inline" }}
        >
            {text.split("").map((char, idx) => {
                const dist = hoveredIdx !== null ? Math.abs(hoveredIdx - idx) : null;

                /* Weight ladder: hovered → 900, ±1 → 700, ±2 → 400, rest → current */
                const weight =
                    dist === 0 ? 900 :
                        dist === 1 ? 700 :
                            dist === 2 ? 400 : undefined;

                /* Colour ladder: hovered → accent, ±1 → mix, rest → base */
                const color =
                    dist === 0 ? accentColor :
                        dist === 1 ? "rgba(255,255,255,0.85)" :
                            dist === 2 ? "rgba(255,255,255,0.55)" :
                                baseColor;

                /* Slight scale-up on hover char */
                const scale = dist === 0 ? 1.18 : dist === 1 ? 1.05 : 1;

                /* Subtle text-shadow glow on accent */
                const shadow =
                    dist === 0 ? `0 0 26px ${accentColor}88` :
                        dist === 1 ? `0 0 12px ${accentColor}44` : "none";

                return (
                    <span
                        key={idx}
                        onMouseEnter={() => setHoveredIdx(idx)}
                        style={{
                            display: "inline-block",
                            fontWeight: weight,
                            color,
                            transform: `scale(${scale})`,
                            textShadow: shadow,
                            transition:
                                "color 200ms ease, font-weight 200ms ease, transform 180ms ease, text-shadow 200ms ease",
                            cursor: "default",
                            /* keep non-breaking space visible */
                            whiteSpace: char === " " ? "pre" : undefined,
                        }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                );
            })}
        </span>
    );
}
