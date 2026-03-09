import { Canvas } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion } from "motion/react";

function MorphingSphere() {
    return (
        <Sphere args={[1, 64, 64]} scale={1.5}>
            <MeshDistortMaterial
                color="var(--color-neon)" // utilizing neon green css var
                distort={0.4}
                speed={1.5}
                roughness={0.2}
                wireframe={true}
            />
        </Sphere>
    );
}

export function AboutHero() {
    return (
        <section className="relative w-full min-h-screen bg-[var(--color-ink)] flex flex-col justify-center items-center overflow-hidden pt-20 border-b border-white[0.05]">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-1/2 h-full z-0 opacity-40 md:opacity-60 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 3] }}>
                    <ambientLight intensity={0.5} />
                    <MorphingSphere />
                </Canvas>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col justify-center h-full gap-16 md:gap-24">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-[var(--color-neon)] font-mono text-sm md:text-xl uppercase tracking-[0.2em] max-w-3xl leading-relaxed brutal-border p-4 bg-black/20 backdrop-blur-sm self-start"
                >
                    THE DIALECTICAL PRONUNCIATION OF “NORTH” - SYMBOLIZING OUR COMMITMENT TO ALWAYS GUIDING YOU IN THE RIGHT DIRECTION.
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="text-white text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-[0.8] max-w-5xl mix-blend-difference"
                >
                    WE MAKE AI <br className="hidden md:block" />
                    <span className="text-[var(--color-neon)] drop-shadow-[4px_4px_0_rgba(255,255,255,0.1)]">EMOTIONAL</span><br />
                    AND NOT PLASTIC.
                </motion.h1>
            </div>
        </section>
    );
}
