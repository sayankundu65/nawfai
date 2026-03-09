import { motion } from "motion/react";

function FrictionIcon() {
    return (
        <div className="w-12 h-12 rounded-none border border-[var(--color-neon)] flex items-center justify-center bg-[var(--color-neon)]/10 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M18 6L6 18M6 6l12 12" />
            </svg>
        </div>
    );
}

export function AccelerationLayer() {
    const frictions = [
        "Campaigns get delayed.",
        "Content pipelines break.",
        "Budgets stretch.",
        "Teams burn out.",
    ];

    return (
        <section className="py-24 md:py-40 px-4 md:px-12 bg-white text-[var(--color-ink)] relative z-10 w-full overflow-hidden brutal-border-b">
            <div className="max-w-7xl mx-auto flex flex-col gap-24">

                {/* Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full text-balance text-[9vw] md:text-[6vw] font-black uppercase tracking-tighter leading-[0.85]"
                >
                    We Didn't Build a Studio.<br />
                    <span className="text-[var(--color-neon)] drop-shadow-[3px_3px_0_var(--color-ink)]">We Built a Marketing Acceleration Layer.</span>
                </motion.div>

                {/* Friction Core */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 w-full">
                    {/* Left Side text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-4xl font-bold tracking-tight text-balance leading-snug"
                    >
                        Marketing today isn't slow because of ideas.<br />
                        It's slow because of <span className="bg-[var(--color-ink)] text-white px-2">execution friction.</span>
                    </motion.div>

                    {/* Right side list */}
                    <div className="flex flex-col gap-6 w-full">
                        {frictions.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="flex items-center gap-6 group"
                            >
                                <FrictionIcon />
                                <span className="text-3xl md:text-5xl font-black uppercase tracking-tighter group-hover:text-[var(--color-neon)] group-hover:drop-shadow-[2px_2px_0_var(--color-ink)] transition-all duration-300">
                                    {f}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Conclusion */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full mt-12 pt-12 border-t-[3px] border-[var(--color-ink)] text-2xl md:text-4xl font-medium max-w-4xl"
                >
                    Meanwhile, AI tools promise speed, but deliver plastic visuals, emotionless outputs, and disconnected tone.<br /><br />
                    <span className="font-black text-4xl md:text-6xl uppercase tracking-tighter bg-[var(--color-neon)] text-[var(--color-ink)] px-4 leading-normal">NAWF was built to fix both.</span>
                </motion.div>

            </div>
        </section>
    );
}
