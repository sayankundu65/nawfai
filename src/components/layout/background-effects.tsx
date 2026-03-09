import { useState } from "react";
import { motion } from "motion/react";

export function BackgroundEffects() {
    const [nodes] = useState(() =>
        Array.from({ length: 20 }).map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 5 + Math.random() * 10
        }))
    );

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            <motion.div
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute left-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-ink)] to-transparent opacity-10"
            />
            <motion.div
                animate={{ y: ["100%", "-100%"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute left-[85%] w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-ink)] to-transparent opacity-10"
            />
            <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-ink)] to-transparent opacity-10"
            />

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute hidden md:block top-[10%] right-[10%] w-[40vw] h-[40vw] border border-[var(--color-ink)] opacity-5 rounded-full"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute hidden md:block top-[15%] right-[15%] w-[30vw] h-[30vw] border border-[var(--color-ink)] opacity-5"
            />

            <motion.div
                animate={{ opacity: [0, 0, 0, 0.08, 0, 0] }}
                transition={{ duration: 8, repeat: Infinity, times: [0, 0.4, 0.45, 0.5, 0.55, 1] }}
                className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[var(--color-neon)] rounded-full blur-[120px] mix-blend-multiply"
            />
            <motion.div
                animate={{ opacity: [0, 0, 0.05, 0, 0, 0] }}
                transition={{ duration: 12, repeat: Infinity, times: [0, 0.7, 0.75, 0.8, 0.85, 1] }}
                className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[var(--color-neon)] rounded-full blur-[100px] mix-blend-multiply"
            />

            {nodes.map((node, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[var(--color-ink)] opacity-20"
                    style={{
                        left: `${node.left}%`,
                        top: `${node.top}%`,
                    }}
                    animate={{
                        y: [0, -100],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: node.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: node.delay
                    }}
                />
            ))}
        </div>
    );
}
