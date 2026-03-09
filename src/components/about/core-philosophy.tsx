import { motion } from "motion/react";

function PhilosophyBlock({
    title,
    content,
    delay = 0
}: {
    title: string | React.ReactNode,
    content: React.ReactNode,
    delay?: number
}) {
    return (
        <div className="flex flex-col gap-8 w-full border-t border-[var(--color-neon)]/20 pt-16">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-[10vw] md:text-[6vw] font-black uppercase tracking-tighter leading-[0.8] text-[var(--color-neon)]"
            >
                {title}
            </motion.h2>
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: delay + 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-xl md:text-3xl font-medium tracking-tight leading-relaxed max-w-4xl text-gray-300 space-y-8"
            >
                {content}
            </motion.div>
        </div>
    );
}

export function CorePhilosophy() {
    return (
        <section className="py-24 md:py-40 px-4 md:px-12 bg-[var(--color-ink)] text-white relative z-10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-32">

                {/* Subscription Studio */}
                <PhilosophyBlock
                    title={<>The First<br />Subscription-Based<br /><span className="text-white drop-shadow-[2px_2px_0_var(--color-neon)]">Gen AI Studio</span></>}
                    content={
                        <>
                            <p>NAWF is the world's first subscription-based Generative AI studio built on a powerful credit model- because marketing isn’t a one-off campaign, it’s a constant process.</p>
                            <p>Instead of paying per asset or per shoot, you plug into a structured creative system. One subscription. Flexible credits. Scalable output. That means faster turnaround times, predictable costs, rapid iterations, higher content velocity, and complete efficiency control.</p>
                            <p className="text-[var(--color-neon)] font-black text-3xl md:text-5xl uppercase tracking-tighter">Credits become your creative currency.<br />Execution becomes frictionless.</p>

                            <div className="pt-8 border-t border-white/10 mt-8">
                                <p>But NAWF isn’t just production. And it’s not just AI.</p>
                                <p>It’s a modern marketing infrastructure designed for brands that want to move faster, spend smarter, and scale consistently. We help you overcome the plasticity and emotional gaps of AI while retaining its speed and scale- building marketing systems that are not just reactive, but future-ready.</p>
                            </div>

                            <div className="pt-8 font-black text-4xl md:text-6xl uppercase tracking-tighter leading-[0.9] text-white">
                                <div>Reality has constraints.</div>
                                <div>AI has potential.</div>
                                <div className="text-[var(--color-neon)]">We make them work together.</div>
                            </div>
                        </>
                    }
                />

                {/* Faster without emotion loss */}
                <PhilosophyBlock
                    title={<>Faster Without<br />Losing <span className="text-white drop-shadow-[2px_2px_0_var(--color-neon)]">Emotion</span></>}
                    content={
                        <>
                            <p className="font-bold text-white text-2xl md:text-4xl">Speed means nothing if the work feels artificial.</p>
                            <p>One of the biggest problems with AI content today?<br />It looks impressive.<br />But it feels empty.</p>
                            <p className="text-[var(--color-neon)] font-bold text-3xl md:text-5xl uppercase tracking-tighter">We solve that.</p>
                            <p>Every output goes through strategic alignment, emotional calibration, and brand tone refinement. Because performance doesn’t come from hyper-real visuals alone.</p>

                            <div className="p-8 border border-[var(--color-neon)]/30 bg-[var(--color-neon)]/5 text-white/90">
                                <p className="font-black text-3xl md:text-5xl uppercase tracking-tighter mb-4">It comes from relevance.<br />From story.<br />From psychology.</p>
                                <p className="text-[var(--color-neon)]">We remove the plasticity of AI and inject narrative intelligence into it.</p>
                            </div>
                        </>
                    }
                />

                {/* Efficiency */}
                <PhilosophyBlock
                    title={<>Efficiency Without<br />Creative <span className="text-white drop-shadow-[2px_2px_0_var(--color-neon)]">Compromise</span></>}
                    content={
                        <>
                            <p>Traditional production increases cost with scale.<br />NAWF increases output without increasing operational weight.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4"><div className="w-4 h-4 bg-red-500 rounded-full shrink-0"></div><span className="line-through opacity-70">No large crews.</span></div>
                                    <div className="flex items-center gap-4"><div className="w-4 h-4 bg-red-500 rounded-full shrink-0"></div><span className="line-through opacity-70">No logistical overhead.</span></div>
                                    <div className="flex items-center gap-4"><div className="w-4 h-4 bg-red-500 rounded-full shrink-0"></div><span className="line-through opacity-70">No location bottlenecks.</span></div>
                                </div>

                                <div className="space-y-4">
                                    <p className="font-mono text-[var(--color-neon)] mb-2 uppercase text-sm">But also:</p>
                                    <div className="flex items-center gap-4"><div className="w-4 h-4 bg-[var(--color-neon)] brutal-border shrink-0"></div><span className="text-white font-bold">No compromise on quality.</span></div>
                                    <div className="flex items-center gap-4"><div className="w-4 h-4 bg-[var(--color-neon)] brutal-border shrink-0"></div><span className="text-white font-bold">No compromise on brand voice.</span></div>
                                    <div className="flex items-center gap-4"><div className="w-4 h-4 bg-[var(--color-neon)] brutal-border shrink-0"></div><span className="text-white font-bold">No compromise on impact.</span></div>
                                </div>
                            </div>

                            <div className="pt-12 font-black text-5xl md:text-7xl uppercase tracking-tighter leading-[0.8] text-[var(--color-neon)] mix-blend-difference mt-8">
                                More content.<br />
                                Lower TAT.<br />
                                Higher strategic clarity.
                            </div>
                        </>
                    }
                />

            </div>
        </section>
    );
}
