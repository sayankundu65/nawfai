import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useRef, useEffect } from "react";
import type React from "react";
import HeroVideo from "../HeroVideo";
import { TextParticle } from "../components/ui/text-particle";
import { CardStackDemo } from "../components/ui/demo";
import { MorphingText } from "../components/ui/liquid-text";
import { ServicesSection } from "../components/ui/services-section";
import { useWindowWidth } from "../hooks/use-window-width";
import { AppleWatchBubbles } from "../components/ui/apple-watch-bubbles";


function AnimatedTitle({ text, className }: { text: string, className?: string }) {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.h2
            className={className}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    key={index}
                    className="inline-block mr-[0.2em] whitespace-nowrap"
                >
                    {word}
                </motion.span>
            ))}
        </motion.h2>
    );
}

function HeroParticleText() {
    const width = useWindowWidth();
    const isMobile = width < 768;

    // Desktop: responsive font size for particle canvas
    const fs1 = Math.min(Math.max(Math.floor(width * 0.072), 60), 110);
    const fs2 = Math.min(Math.max(Math.floor(width * 0.054), 48), 82);
    const density = width < 1024 ? 7 : 5;

    // Mobile: plain bold text, styled to match the brand
    if (isMobile) {
        return (
            <div className="w-full flex flex-col gap-2 text-left">
                <h2 className="text-[11vw] font-black uppercase tracking-tighter leading-[0.9] text-[var(--color-ink)]">
                    The Space Between
                </h2>
                <h2 className="text-[8.5vw] font-black uppercase tracking-tighter leading-[0.9] text-[var(--color-neon)]">
                    What Exists &amp; What's Possible.
                </h2>
            </div>
        );
    }

    // Desktop: particle canvas
    return (
        <div className="w-full flex flex-col items-stretch gap-0">
            <TextParticle
                text="The Space Between"
                fontSize={fs1}
                particleDensity={density}
                particleSize={2}
                particleColor="var(--color-ink)"
            />
            <TextParticle
                text="What Exists & What's Possible."
                fontSize={fs2}
                particleDensity={density}
                particleSize={2}
                particleColor="var(--color-neon)"
            />
        </div>
    );
}

function ScrollLetterReveal() {
    const containerRef = useRef<HTMLHeadingElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 90%", "start 40%"]
    });

    // The user's screenshot showed all caps across 3 lines
    const lines = ["PRODUCTION", "WITHOUT", "PRODUCTION."];
    const totalLetters = lines.join("").length;
    let letterIndex = 0;

    return (
        <h1 ref={containerRef} className="w-full text-balance text-[12vw] md:text-[15vw] font-black uppercase tracking-tighter leading-[0.8] text-[var(--color-ink)]">
            {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-1 -ml-1">
                    {line.split("").map((char, j) => {
                        const start = letterIndex / (totalLetters * 1.2); // multiply to ensure we have a fast snappy reveal within the scroll area
                        const end = start + 0.15; // 15% window for each letter to animate
                        letterIndex++;

                        const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
                        const y = useTransform(scrollYProgress, [start, end], ["120%", "0%"]);
                        const rotate = useTransform(scrollYProgress, [start, end], [12, 0]);

                        return (
                            <motion.span
                                key={j}
                                style={{ opacity, y, rotate, display: "inline-block", transformOrigin: "bottom left" }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        );
                    })}
                </span>
            ))}
        </h1>
    );
}

function HeroFlow() {
    return (
        <section className="relative z-10 pt-20 md:pt-0">
            {/* Hero Video — 16:9 on mobile, full-screen on desktop */}
            <div className="w-full aspect-video md:aspect-auto md:h-screen relative bg-white flex items-center justify-center overflow-hidden">
                <HeroVideo src="/0301.mp4" />
            </div>

            <div className="py-8 md:py-20 px-4 md:px-12">
                <div className="max-w-full mx-auto">
                    {/* Copy Flow */}
                    <div className="flex flex-col gap-10 md:gap-32 w-full mx-auto text-center md:text-left">

                        <HeroParticleText />

                        {/* Hero copy — two typographic zones */}
                        <div className="w-full flex flex-col gap-10 md:gap-16">
                            {/* Left-aligned intro — static prefix + liquid morphing suffix */}
                            <div className="w-full md:w-3/4 text-left">
                                <AnimatedTitle
                                    text="NAWF is the world's first subscription-based"
                                    className="text-3xl md:text-[5vw] lg:text-[4vw] font-bold tracking-tight leading-[1.05] text-balance"
                                />
                                {/* Liquid morph: cycles through AI studio descriptor words */}
                                <MorphingText
                                    texts={[
                                        "Gen AI studio.",
                                        "AI-first agency.",
                                        "Creative engine.",
                                        "Production lab.",
                                        "Gen AI studio.",
                                    ]}
                                    className="h-[1.15em] text-left text-3xl md:text-[5vw] lg:text-[4vw] font-bold tracking-tight"
                                    spanStyle={{ color: "#4a4a4a" }}
                                />
                            </div>

                            <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-12 xl:gap-20">
                                <div className="w-full xl:w-1/2 flex justify-start z-20">
                                    <CardStackDemo />
                                </div>

                                {/* Right-aligned tagline — clean simple static style */}
                                <div className="w-full xl:w-1/2 flex flex-col items-end gap-1 text-right">
                                    {[
                                        { line: "Built on credits.", outline: false },
                                        { line: "Built for scale.", outline: false },
                                        { line: "Built different.", outline: true },
                                    ].map(({ line, outline }, i) => (
                                        <div key={i} className="relative inline-block">
                                            <span
                                                className="text-[8.5vw] md:text-[6vw] lg:text-[4.7vw] xl:text-[4.5vw] font-black tracking-tighter leading-[0.95] uppercase"
                                                style={outline ? { WebkitTextStroke: "2px var(--color-ink)", color: "transparent" } : {}}
                                            >
                                                {line}
                                            </span>
                                            <motion.div
                                                className="absolute bottom-0 left-0 h-[3px] bg-[var(--color-neon)]"
                                                initial={{ scaleX: 0, originX: 1 }}
                                                whileInView={{ scaleX: 1 }}
                                                transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: "easeOut" }}
                                                viewport={{ once: true }}
                                                style={{ width: "100%" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <ScrollLetterReveal />

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            viewport={{ once: true }}
                            className="w-full text-balance text-[6vw] md:text-[4vw] lg:text-[3vw] font-medium leading-tight text-gray-700"
                        >
                            <p>We take real marketing problems and solve them with AI.</p>
                            <p>We build production-grade AI outputs that perform.</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ScrambleText({
    text,
    className,
    style,
    delay = 0,
}: {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    delay?: number;
}) {
    const elRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(elRef, { once: true, margin: "-120px" });
    const hasRun = useRef(false);

    useEffect(() => {
        if (!inView || hasRun.current || !elRef.current) return;
        hasRun.current = true;

        const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|[]{}";
        const el = elRef.current;
        const final = text.toUpperCase();
        let frame = 0;
        const totalFrames = 40;
        const startDelay = delay * 1000;

        const tick = () => {
            const progress = Math.min(frame / totalFrames, 1);
            const revealedCount = Math.floor(progress * final.length);
            let displayed = "";
            for (let i = 0; i < final.length; i++) {
                if (final[i] === " ") {
                    displayed += " ";
                } else if (i < revealedCount) {
                    displayed += final[i];
                } else {
                    displayed += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }
            el.textContent = displayed;
            frame++;
            if (frame <= totalFrames + 8) requestAnimationFrame(tick);
            else el.textContent = final;
        };

        const timer = setTimeout(tick, startDelay);
        return () => clearTimeout(timer);
    }, [inView, text, delay]);

    return (
        <span ref={elRef} className={className} style={style}>
            {text.toUpperCase()}
        </span>
    );
}

function EmotionSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: "-80px" });

    return (
        <section
            ref={sectionRef}
            className="relative z-10 overflow-hidden py-28 md:py-40 px-4 md:px-12"
            style={{ background: "#000" }}
        >
            {/* Futuristic scan-line overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57,255,20,0.015) 2px, rgba(57,255,20,0.015) 4px)",
                }}
            />

            {/* Grid overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(57,255,20,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.08) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Left label — vertical */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10"
            >
                <div className="h-16 md:h-24 w-px bg-gradient-to-b from-transparent via-[#39FF14] to-transparent" />
                <span
                    className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#39FF14]/50"
                    style={{ writingMode: "vertical-rl" }}
                >
                    SYS.MANIFEST
                </span>
                <div className="h-16 md:h-24 w-px bg-gradient-to-b from-transparent via-[#39FF14] to-transparent" />
            </motion.div>

            {/* Corner brackets */}
            {[
                "top-6 left-6 md:top-10 md:left-20 border-t-2 border-l-2",
                "top-6 right-6 md:top-10 md:right-10 border-t-2 border-r-2",
                "bottom-6 left-6 md:bottom-10 md:left-20 border-b-2 border-l-2",
                "bottom-6 right-6 md:bottom-10 md:right-10 border-b-2 border-r-2",
            ].map((cls, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className={`absolute w-8 h-8 md:w-10 md:h-10 border-[#39FF14]/40 pointer-events-none z-10 ${cls}`}
                />
            ))}

            {/* Top status line */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex items-center justify-center gap-4 mb-12 md:mb-20 relative z-10"
            >
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] text-[#39FF14]/60">
                    NAWF // CORE DIRECTIVE // v2.49
                </span>
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            </motion.div>

            {/* Main text block */}
            <div className="relative z-10 text-center max-w-[1400px] mx-auto">
                {/* Line 1 */}
                <div className="overflow-hidden mb-2 md:mb-4">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={inView ? { y: "0%" } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ScrambleText
                            text="We make AI"
                            delay={0.3}
                            className="text-[13vw] md:text-[10vw] font-black tracking-tighter leading-[0.85] uppercase text-white block"
                        />
                    </motion.div>
                </div>

                {/* Line 2 — neon highlight */}
                <div className="overflow-hidden mb-2 md:mb-4 relative">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={inView ? { y: "0%" } : {}}
                        transition={{ duration: 0.8, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <ScrambleText
                            text="EMOTIONAL"
                            delay={0.6}
                            className="text-[16vw] md:text-[13vw] font-black tracking-tighter leading-[0.85] uppercase block"
                            style={{
                                WebkitTextStroke: "2px #39FF14",
                                color: "transparent",
                                filter: "drop-shadow(0 0 40px rgba(57,255,20,0.35))",
                            }}
                        />
                    </motion.div>
                </div>

                {/* Line 3 */}
                <div className="overflow-hidden">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={inView ? { y: "0%" } : {}}
                        transition={{ duration: 0.8, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ScrambleText
                            text="and not plastic."
                            delay={0.9}
                            className="text-[9vw] md:text-[7vw] font-black tracking-tighter leading-[0.85] uppercase text-white/40 block"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Bottom decorative row */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="relative z-10 mt-14 md:mt-20 flex items-center justify-center gap-6"
            >
                <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#39FF14]/40" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#39FF14]/40">
                    NOT GENERATED. FELT.
                </span>
                <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#39FF14]/40" />
            </motion.div>
        </section>
    );
}

function CreditsSection() {
    return (
        <section className="pt-32 pb-16 px-4 md:px-12 bg-[var(--color-ink)] text-[var(--color-paper)] relative z-10">
            <div className="w-full mx-auto">
                <div className="w-full text-balance font-mono italic text-[6vw] md:text-[3vw] mb-6 md:mb-12 text-[var(--color-neon)]">
                    Subscribe to get credits
                </div>
                <h2 className="w-full text-balance text-[18vw] md:text-[12vw] font-black tracking-tighter mb-16 md:mb-24 text-[var(--color-neon)] leading-[0.8]">
                    Credits &gt; Chaos.
                </h2>

                <div className="flex flex-col w-full text-[6vw] md:text-[4vw] font-medium leading-tight mb-8">
                    <div className="text-gray-400">
                        {/* Static prefix + liquid morphing suffix */}
                        <div className="flex flex-wrap items-baseline gap-x-[0.3em]">
                            <span className="whitespace-nowrap">You don't pay per</span>
                            <MorphingText
                                texts={["video.", "shoot.", '"extra edit."']}
                                className="h-[1.2em] text-[6vw] md:text-[4vw] font-medium leading-tight text-[var(--color-neon)] min-w-[5ch]"
                                spanStyle={{ color: "var(--color-neon)" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProcessCard({ step, index }: { step: { id: string, title: string, glow: string, textClass?: string }, index: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="relative group h-[140px] md:h-[450px] p-5 md:p-12 border border-white/[0.08] bg-[#111] flex flex-col md:flex-col justify-between overflow-hidden cursor-default transition-all duration-500 hover:border-white/30"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glow */}
            <div
                className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[100px] transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{ backgroundColor: step.glow }}
            />

            {/* Mobile: number + title in one row; Desktop: number top, title bottom */}
            <div className="flex md:flex-col md:justify-between w-full h-full items-center md:items-start gap-4 md:gap-0 relative z-10">
                <div className="font-mono text-xl md:text-5xl font-black text-white/20 group-hover:text-[var(--color-neon)] transition-colors duration-500 shrink-0">
                    {step.id}
                </div>

                {/* Arrow — desktop only */}
                <motion.div
                    className="hidden md:flex absolute top-12 right-12 w-10 h-10 border border-white/20 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/50 backdrop-blur-sm"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-neon)]"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </motion.div>

                <div className="relative z-10 md:mt-auto">
                    <h3 className={`text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] ${step.textClass || "text-white"} drop-shadow-lg`}>
                        {step.title}
                    </h3>
                </div>
            </div>

            {/* Animated line borders */}
            <motion.div className="absolute top-0 right-0 w-0 h-[2px] bg-gradient-to-l from-[var(--color-neon)] to-transparent group-hover:w-full transition-all duration-700 ease-out" />
            <motion.div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[var(--color-neon)] to-transparent group-hover:w-full transition-all duration-700 ease-out" />
        </motion.div>
    )
}

function HowItWorksSection() {
    const steps = [
        { id: "01", title: "You subscribe.", glow: "rgba(255,255,255,0.3)" },
        { id: "02", title: "You get credits.", glow: "rgba(255,255,255,0.3)" },
        { id: "03", title: "We deploy them.", glow: "rgba(57,255,20,0.5)", textClass: "text-[var(--color-neon)]" }
    ];

    return (
        <section className="py-8 md:py-16 px-4 md:px-12 bg-[var(--color-ink)] relative z-10">
            <div className="w-full mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {steps.map((step, i) => (
                        <ProcessCard key={step.id} index={i} step={step} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function MoreDemandSection() {
    const images = [
        { src: "/images after hero (1).jpg", alt: "Campaign 1" },
        { src: "/images after hero (2).jpg", alt: "Campaign 2" },
        { src: "/images after hero (3).jpg", alt: "Campaign 3" },
        { src: "/images after hero (4).jpg", alt: "Campaign 4" },
        { src: "/images after hero (5).jpg", alt: "Campaign 5" },
    ];

    return (
        <section className="pt-8 pb-32 px-4 md:px-12 bg-[var(--color-ink)] text-[var(--color-paper)] relative z-10">
            <div className="w-full mx-auto flex flex-col xl:flex-row items-center gap-12 xl:gap-0">
                {/* Left — headline */}
                <div className="w-full xl:w-1/2 text-balance text-[12vw] md:text-[9vw] xl:text-[7vw] font-black tracking-tighter leading-[0.8] uppercase">
                    More demand?<br />
                    <span className="text-[var(--color-neon)]">Scale credits.</span><br />
                    Not chaos.
                </div>

                {/* Right — bubbles */}
                <div className="w-full xl:w-1/2 flex justify-center xl:justify-end">
                    <div style={{ width: '100%', height: 'clamp(240px, 32vw, 400px)', overflow: 'visible' }}>
                        <AppleWatchBubbles images={images} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Home() {
    return (
        <>
            <HeroFlow />
            <EmotionSection />
            <CreditsSection />
            <HowItWorksSection />
            <MoreDemandSection />
            <ServicesSection />
        </>
    );
}
