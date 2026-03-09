import { motion } from "motion/react";

export function InfluenceReimagined() {
    const list = [
        "Social strategy",
        "Paid campaigns",
        "Product launches",
        "Community building"
    ];

    return (
        <section className="py-32 md:py-48 px-4 md:px-12 bg-white text-[var(--color-ink)] relative z-10 w-full overflow-hidden brutal-border-b">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-16">

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-full flex flex-col items-center gap-6"
                >
                    <h2 className="text-[10vw] md:text-[6vw] font-black uppercase tracking-tighter leading-[0.8] text-[var(--color-neon)] drop-shadow-[2px_2px_0_var(--color-ink)]">
                        Influence, Reimagined
                    </h2>
                    <p className="text-2xl md:text-4xl font-bold tracking-tight max-w-4xl text-balance">
                        We also build AI-native digital personalities and influencer ecosystems. Controlled, scalable, aligned presence that integrates seamlessly into:
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl">
                    {list.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="px-6 py-3 border-2 border-[var(--color-ink)] text-xl md:text-2xl font-black uppercase tracking-tighter hover:bg-[var(--color-neon)] transition-colors cursor-default"
                        >
                            • {item}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-balance mt-8"
                >
                    Influence doesn’t have to be unpredictable.<br />
                    <span className="text-[var(--color-neon)] bg-[var(--color-ink)] px-4 mx-2 leading-relaxed">It can be engineered.</span>
                </motion.div>

                <motion.a
                    href="#/contact"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 inline-flex items-center justify-center px-12 py-8 bg-[var(--color-neon)] text-[var(--color-ink)] border-4 border-[var(--color-ink)] font-black text-2xl md:text-4xl uppercase tracking-tighter hover:bg-[var(--color-ink)] hover:text-[var(--color-neon)] transition-colors"
                >
                    SUBSCRIBE NOW TO GET STARTED!
                </motion.a>

            </div>
        </section>
    );
}
