import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BubbleText } from "../ui/bubble-text";
import { SlicedText } from "../ui/sliced-text";
import { ParallaxImage } from "../ui/parallax-image";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
   CURSOR-REACTIVE BACKGROUND — Lazy Lerp Radial Aura
   ─────────────────────────────────────────────────────────────────────────
   This component renders a full-page soft glow that follows the cursor with
   inertia (linear interpolation), creating a smooth aurora-like effect.
   ───────────────────────────────────────────────────────────────────────── */
export function CursorAura() {
    const auraRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight + window.scrollY });
    const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const rafId = useRef<number>(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY + window.scrollY;
        };
        window.addEventListener("mousemove", onMove);

        const tick = () => {
            // Lerp factor — lower = lazier/smoother (0.04–0.08 is ideal)
            const LERP = 0.055;
            pos.current.x += (mouse.current.x - pos.current.x) * LERP;
            pos.current.y += (mouse.current.y - pos.current.y) * LERP;

            if (auraRef.current) {
                auraRef.current.style.transform = `translate(${pos.current.x - 350}px, ${pos.current.y - 350}px)`;
            }
            rafId.current = requestAnimationFrame(tick);
        };
        rafId.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(rafId.current);
        };
    }, []);

    return (
        /* pointer-events:none so it never interrupts clicks */
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div
                ref={auraRef}
                style={{
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(0,255,102,0.06) 0%, rgba(0,255,102,0.02) 40%, transparent 70%)",
                    willChange: "transform",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
            />
        </div>
    );
}

/* ─────────────────────────── SHARED UI ATOMS ─────────────────────────── */

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 md:p-8 group
      hover:border-[#00FF66]/30 hover:bg-white/[0.04]
      transition-all duration-700 ease-out ${className}`}
        >
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,255,102,0.05) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

function SectionLabel({ text }: { text: string }) {
    return (
        <div className="about-label flex items-center gap-3 mb-8 opacity-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66]" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00FF66]/60">{text}</span>
        </div>
    );
}

function DotGrid() {
    return (
        <div className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
                opacity: 0.025,
            }}
        />
    );
}

/* Shared helper: animate any ".about-label" inside a container on scroll */
function useLabelReveal(scope: React.RefObject<HTMLElement | null>) {
    useGSAP(() => {
        gsap.fromTo(".about-label",
            { opacity: 0, y: 14, letterSpacing: "0.4em" },
            {
                opacity: 1, y: 0, letterSpacing: "0.25em", duration: 1.4, ease: "expo.out",
                scrollTrigger: { trigger: ".about-label", start: "top 90%", end: "top 60%", scrub: 1.5 }
            }
        );
    }, { scope });
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1 — HERO
   ═══════════════════════════════════════════════════════════════════════════ */
export function HeroSection() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // On-load entrance — silky staggered reveal
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.fromTo(".hero-tag",
            { opacity: 0, y: 24, filter: "blur(6px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.14 }
        );
        tl.fromTo(".hero-line",
            { y: "105%", clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", rotation: 1.5, transformOrigin: "left bottom" },
            { y: "0%", clipPath: "polygon(0 -10%, 100% -10%, 100% 110%, 0 110%)", rotation: 0, duration: 1.2, stagger: 0.11 },
            "-=0.7"
        );
        tl.fromTo(".hero-sub",
            { opacity: 0, y: 18, filter: "blur(4px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0 },
            "-=0.9"
        );

        // Smooth parallax out on scroll
        gsap.to(".hero-content", {
            y: 100,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "bottom top",
                scrub: 2.5,
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className="relative w-full min-h-[70vh] lg:min-h-screen bg-black flex items-center overflow-visible pt-20 md:pt-32 pb-16 md:pb-32">
            {/* Subtle scan line pattern */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)"
                }}
            />
            <DotGrid />

            <div className="hero-content relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
                <div className="max-w-5xl">
                    {/* Tag line */}
                    <div className="hero-tag flex items-center gap-3 mb-10 opacity-0">
                        <div className="flex items-center gap-2.5 border border-white/10 rounded-full px-4 py-1.5 text-white/40 font-mono text-xs tracking-[0.2em] uppercase backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                            About NAWF · AI-Native Studio
                        </div>
                    </div>

                    <p className="hero-tag text-white/30 font-mono text-xs tracking-[0.15em] leading-relaxed mb-12 max-w-2xl uppercase opacity-0">
                        THE DIALECTICAL PRONUNCIATION OF "NORTH" — SYMBOLIZING OUR COMMITMENT TO ALWAYS GUIDING YOU IN THE RIGHT DIRECTION.
                    </p>

                    <h1 className="font-black text-white leading-[0.83] tracking-tighter uppercase flex flex-col relative"
                        style={{ fontSize: "clamp(52px, 10vw, 96px)" }}
                    >
                        {/* 1. Bubble circle near Hero headline */}
                        <ParallaxImage
                            src="/influencer/1 (3).jpg"
                            alt="Campaign image"
                            className="w-28 md:w-44 lg:w-52 xl:w-64 -right-4 md:-right-16 lg:-right-32 top-1/4"
                            speed={1.5}
                            direction="up"
                            floatAmp={10}
                            floatDuration={4.2}
                        />
                        <span className="overflow-hidden pb-1"><span className="hero-line block">WE MAKE AI</span></span>
                        <span className="overflow-hidden pb-1"><span className="hero-line block text-[#00FF66]" style={{ textShadow: "0 0 60px rgba(0,255,102,0.25)" }}>EMOTIONAL</span></span>
                        <span className="overflow-hidden"><span className="hero-line block">AND NOT PLASTIC.</span></span>
                    </h1>

                    <p className="hero-sub opacity-0 mt-10 text-white/40 text-base md:text-xl leading-relaxed max-w-xl font-medium">
                        NAWF is the world's first subscription-based Generative AI studio — built to remove execution friction from modern marketing.
                    </p>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 — THE ASSEMBLY MATRIX (Epicenter)
   ═══════════════════════════════════════════════════════════════════════════ */
export function AccelerationLayer() {
    const container = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const problems = [
        { label: "Campaigns get delayed.", desc: "Long approval chains stall momentum." },
        { label: "Content pipelines break.", desc: "Handoffs between teams create gaps." },
        { label: "Budgets stretch.", desc: "Per-asset pricing inflates true cost." },
        { label: "Teams burn out.", desc: "Endless revisions erode creative integrity." },
    ];

    useGSAP(() => {
        // Initial chaos positions
        const offsets = [
            { x: -200, y: -80, r: -18 },
            { x: 220, y: -50, r: 15 },
            { x: -150, y: 100, r: 13 },
            { x: 170, y: 80, r: -13 },
        ];
        cardsRef.current.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, { x: offsets[i].x, y: offsets[i].y, rotation: offsets[i].r, opacity: 0, scale: 0.84, filter: "blur(8px)" });
        });

        gsap.set(".accel-line", { y: "108%", clipPath: "inset(100% 0 0 0)" });
        gsap.set(".accel-sub", { opacity: 0, y: 22, filter: "blur(5px)" });
        gsap.set(".about-label", { opacity: 0, y: 12 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 70%",
                end: "top 5%",
                scrub: 3,
            }
        });

        // Cards flow from chaos to grid with blur clearing
        tl.to(cardsRef.current, {
            x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, filter: "blur(0px)",
            stagger: 0.08,
            ease: "expo.inOut"
        }, 0);

        // Headline reveals
        tl.to(".accel-line", {
            y: "0%", clipPath: "inset(0% 0 0 0)",
            stagger: 0.1,
            ease: "expo.out"
        }, 0.1);

        tl.to(".accel-sub", { opacity: 1, y: 0, filter: "blur(0px)", ease: "expo.out" }, 0.5);
        tl.to(".about-label", { opacity: 1, y: 0, ease: "expo.out" }, 0);

    }, { scope: container });

    return (
        <section ref={container} className="relative bg-black py-20 md:py-56 overflow-hidden min-h-[60vh] lg:min-h-screen flex items-center border-t border-white/[0.04]">
            <DotGrid />
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
                <SectionLabel text="Philosophy" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
                    {/* Left — headline */}
                    <div>
                        <h2 className="font-black text-white leading-[0.88] tracking-tighter uppercase flex flex-col mb-8"
                            style={{ fontSize: "clamp(36px, 5.5vw, 72px)" }}
                        >
                            <span className="overflow-hidden pb-1"><span className="accel-line block">WE DIDN'T BUILD</span></span>
                            <span className="overflow-hidden pb-1"><span className="accel-line block">A STUDIO.</span></span>
                            <span className="overflow-hidden"><span className="accel-line block text-[#00FF66]">WE BUILT A MARKETING<br />ACCELERATION LAYER.</span></span>
                        </h2>
                        <p className="accel-sub text-white/50 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                            Meanwhile, AI tools promise speed, but deliver plastic visuals, emotionless outputs, and disconnected tone.
                        </p>
                    </div>

                    {/* Right — Assembly Matrix */}
                    <div className="relative grid grid-cols-2 gap-4">
                        {/* Glow orb behind grid */}
                        <div className="absolute -inset-16 bg-[#00FF66]/[0.06] blur-[80px] rounded-full pointer-events-none" />

                        {problems.map((p, i) => (
                            <div key={i} ref={el => { cardsRef.current[i] = el; }}
                                className="relative rounded-xl border border-white/[0.08] bg-black/60 backdrop-blur-sm p-5 md:p-6 group
                  hover:border-[#00FF66]/30 transition-all duration-500"
                            >
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-1 h-1 rounded-full bg-red-500 opacity-70" />
                                    <p className="text-white text-sm md:text-base font-black uppercase tracking-tight leading-tight">{p.label}</p>
                                </div>
                                <p className="text-white/35 text-xs md:text-sm font-medium leading-snug">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3 + 4 — PROBLEM INSIGHT + SOLUTION STATEMENT
   ═══════════════════════════════════════════════════════════════════════════ */
export function ProblemInsight() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(".problem-block",
            { scale: 0.93, opacity: 0, y: 40, filter: "blur(10px)" },
            {
                scale: 1, opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".problem-block",
                    start: "top 88%",
                    end: "top 40%",
                    scrub: 2.5,
                }
            }
        );
    }, { scope: container });

    return (
        <div ref={container}>
            <section className="relative bg-black py-16 md:py-32 overflow-visible">
                <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">

                    {/* 2. Floating square image near Problem intro block */}
                    <ParallaxImage
                        src="/influencer/1 (1).jpeg"
                        alt="Campaign image"
                        className="w-24 md:w-36 lg:w-44 xl:w-52 right-0 md:-right-10 lg:-right-20 xl:-right-28 top-[10%]"
                        speed={1.2}
                        direction="down"
                        floatAmp={12}
                        floatDuration={5.0}
                    />

                    <div className="problem-block opacity-0 relative z-20 py-4">
                        <p className="text-white text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight uppercase">
                            Marketing today isn't slow because of ideas.<br />
                            It's slow because of <span className="text-[#00FF66]">execution friction.</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="solution-section relative bg-black py-20 md:py-52 flex items-center justify-center overflow-visible border-t border-white/[0.04]">
                <DotGrid />
                {/* Soft radial glow behind text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div style={{ width: 700, height: 320, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,255,102,0.06) 0%, transparent 70%)", filter: "blur(50px)" }} />
                </div>
                {/* BubbleText proximity-ripple headline */}
                <div className="solution-text relative z-10 text-center select-none px-4"
                    style={{ fontSize: "clamp(40px, 8.5vw, 104px)", lineHeight: 0.88 }}
                >
                    {/* 3. Floating square image near Solution statement */}
                    <ParallaxImage
                        src="/influencer/1 (4).jpg"
                        alt="Campaign image"
                        className="w-28 md:w-44 lg:w-56 xl:w-64 -right-10 md:-right-24 lg:-right-40 -top-1/4"
                        speed={1.8}
                        direction="up"
                        floatAmp={7}
                        floatDuration={3.8}
                    />

                    <div className="relative z-[60]">
                        <div>
                            <BubbleText text="NAWF WAS BUILT" />
                        </div>
                        <div style={{ marginTop: "0.06em" }}>
                            <BubbleText text="TO FIX " />
                            <BubbleText
                                text="BOTH."
                                baseColor="#00FF66"
                                accentColor="#ffffff"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5 — STUDIO EXPLANATION
   ═══════════════════════════════════════════════════════════════════════════ */
export function StudioExplanation() {
    const container = useRef<HTMLDivElement>(null);

    const features = [
        { title: "One Subscription", tag: "Foundation", body: "NAWF is the world's first subscription-based Generative AI studio built on a powerful credit model — because marketing isn't a one-off campaign, it's a constant process." },
        { title: "Flexible Credits", tag: "Model", body: "Instead of paying per asset or per shoot, you plug into a structured creative system. One subscription. Flexible credits. Scalable output." },
        { title: "Scalable Output", tag: "Result", body: "Faster turnaround times, predictable costs, rapid iterations, higher content velocity, and complete efficiency control." }
    ];

    useGSAP(() => {
        gsap.fromTo(".studio-h",
            { opacity: 0, y: 36, filter: "blur(8px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".studio-h",
                    start: "top 90%",
                    end: "top 50%",
                    scrub: 2,
                }
            }
        );
        gsap.fromTo(".studio-card",
            { y: 70, opacity: 0, scale: 0.96, filter: "blur(6px)" },
            {
                y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
                stagger: { each: 0.18, from: "start" },
                scrollTrigger: {
                    trigger: ".studio-grid",
                    start: "top 88%",
                    end: "top 25%",
                    scrub: 2.5,
                }
            }
        );
    }, { scope: container });

    return (
        <section ref={container} className="relative bg-black py-20 md:py-52 overflow-hidden border-t border-white/[0.04]">
            <DotGrid />
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
                <SectionLabel text="How it works" />
                <h2 className="studio-h font-black text-white leading-[0.88] tracking-tighter uppercase mb-16 max-w-4xl opacity-0"
                    style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
                >
                    THE FIRST SUBSCRIPTION-BASED<br />
                    <span className="text-[#00FF66]">GEN AI STUDIO</span>
                </h2>

                <div className="studio-grid grid grid-cols-1 md:grid-cols-3 gap-5">
                    {features.map((f, i) => (
                        <div key={i} className="studio-card opacity-0">
                            <GlassCard className="h-full flex flex-col min-h-[260px]">
                                <span className="font-mono text-[#00FF66]/50 text-xs tracking-[0.2em] uppercase mb-5">{f.tag}</span>
                                <h3 className="text-white font-black uppercase tracking-tight text-xl md:text-2xl mb-4">{f.title}</h3>
                                <p className="text-white/45 font-medium text-sm leading-relaxed flex-1">{f.body}</p>
                            </GlassCard>
                        </div>
                    ))}
                </div>

                <p className="mt-14 text-white/40 text-base md:text-lg leading-relaxed max-w-3xl">
                    But NAWF isn't just production. And it's not just AI. It's a modern marketing infrastructure designed for brands that want to move faster, spend smarter, and scale consistently — building marketing systems that are not just reactive, but future-ready.
                </p>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6 + 7 — CREATIVE ECONOMY + PHILOSOPHY BLOCK
   ═══════════════════════════════════════════════════════════════════════════ */
export function TypographicStatements() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Word-by-word colour scrub — very smooth
        gsap.fromTo(".currency-word",
            { opacity: 0.06, color: "#ffffff" },
            {
                opacity: 1, color: "#00FF66",
                duration: 0.15,
                stagger: { each: 0.03 },
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".currency-section",
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                }
            }
        );

        gsap.fromTo(".frictionless-text",
            { opacity: 0, x: -40, filter: "blur(8px)" },
            {
                opacity: 1, x: 0, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".frictionless-text",
                    start: "top 88%",
                    end: "top 45%",
                    scrub: 2,
                }
            }
        );

        // Tri-line philosophy — cascaded scrub
        gsap.fromTo(".philo-line",
            { opacity: 0, y: 30, filter: "blur(6px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                stagger: { each: 0.28 },
                scrollTrigger: {
                    trigger: ".philo-block",
                    start: "top 85%",
                    end: "top 30%",
                    scrub: 2.5,
                }
            }
        );
    }, { scope: container });

    const currencyWords = "CREDITS BECOME YOUR CREATIVE CURRENCY.".split(" ");

    return (
        <div ref={container}>
            {/* Creative Currency */}
            <section className="currency-section relative bg-black py-20 md:py-52 overflow-visible border-t border-white/[0.04]">

                {/* 4. Floating square image near Philo/Currency */}
                <ParallaxImage
                    src="/influencer/1 (7).jpg"
                    alt="Campaign image"
                    className="w-28 md:w-44 lg:w-56 xl:w-64 right-4 md:right-16 lg:right-24 md:-top-16"
                    speed={2.2}
                    direction="down"
                    floatAmp={9}
                    floatDuration={4.8}
                />

                <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-20">
                    <h2 className="font-black leading-[0.88] tracking-tighter uppercase"
                        style={{ fontSize: "clamp(32px, 5.5vw, 72px)" }}
                    >
                        {currencyWords.map((w, i) => (
                            <span key={i} className="currency-word text-white/10 mr-[0.25em] inline-block">{w}</span>
                        ))}
                    </h2>
                    <p className="frictionless-text text-white/40 font-black uppercase tracking-tight opacity-0"
                        style={{ fontSize: "clamp(24px, 4vw, 52px)" }}
                    >
                        Execution becomes <span className="text-white">frictionless.</span>
                    </p>
                </div>
            </section>

            {/* Reality vs AI */}
            <section className="relative bg-black py-16 md:py-40 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center philo-block">
                    <h2 className="font-black text-white leading-[0.88] tracking-tighter uppercase flex flex-col gap-3"
                        style={{ fontSize: "clamp(32px, 6vw, 80px)" }}
                    >
                        <span className="philo-line block opacity-0">REALITY HAS CONSTRAINTS.</span>
                        <span className="philo-line block opacity-0">AI HAS POTENTIAL.</span>
                        <span className="philo-line block text-[#00FF66] opacity-0">WE MAKE THEM WORK TOGETHER.</span>
                    </h2>
                </div>
            </section>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 8 — SPEED VS EMOTION
   ═══════════════════════════════════════════════════════════════════════════ */
export function SpeedVsEmotion() {
    const container = useRef<HTMLDivElement>(null);
    const solutions = [
        { label: "Strategic alignment", desc: "Every brief is filtered through brand strategy before any asset is created." },
        { label: "Emotional calibration", desc: "AI outputs are refined until the tone matches the intended audience response." },
        { label: "Brand tone refinement", desc: "Voice consistency across every format — video, still, social, and beyond." },
    ];

    useGSAP(() => {
        gsap.fromTo(".speed-h",
            { opacity: 0, y: 32, filter: "blur(8px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".speed-h",
                    start: "top 90%",
                    end: "top 50%",
                    scrub: 2,
                }
            }
        );
        gsap.fromTo(".speed-body",
            { opacity: 0, y: 20, filter: "blur(5px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".speed-body",
                    start: "top 88%",
                    end: "top 45%",
                    scrub: 2,
                }
            }
        );
        gsap.fromTo(".speed-card",
            { x: 55, opacity: 0, filter: "blur(6px)" },
            {
                x: 0, opacity: 1, filter: "blur(0px)",
                stagger: { each: 0.2 },
                scrollTrigger: {
                    trigger: ".speed-cards",
                    start: "top 88%",
                    end: "top 25%",
                    scrub: 2.5,
                }
            }
        );
    }, { scope: container });

    return (
        <section ref={container} className="relative bg-black py-20 md:py-52 overflow-hidden border-t border-white/[0.04]">
            <DotGrid />
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
                {/* Bubble image — top right */}
                <ParallaxImage
                    src="/influencer/1 (3).jpeg"
                    alt="Campaign image"
                    className="w-28 md:w-40 lg:w-48 right-0 md:-right-8 lg:-right-16 -top-8"
                    speed={1.4}
                    direction="up"
                    floatAmp={8}
                    floatDuration={5.2}
                />
                <SectionLabel text="Quality" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-36 mt-6">
                    {/* Left */}
                    <div>
                        <h2 className="speed-h font-black text-white leading-[0.88] tracking-tighter uppercase mb-8 opacity-0"
                            style={{ fontSize: "clamp(36px, 6vw, 80px)" }}
                        >
                            FASTER WITHOUT<br />LOSING <span className="text-[#00FF66]">EMOTION</span>
                        </h2>
                        <div className="speed-body space-y-6 opacity-0">
                            <p className="text-white text-xl md:text-2xl font-bold tracking-tight">
                                Speed means nothing if the work feels artificial.
                            </p>
                            <p className="text-white/45 text-base md:text-lg font-medium leading-relaxed">
                                One of the biggest problems with AI content today? It looks impressive. But it feels empty.
                            </p>
                            <p className="text-[#00FF66] text-lg font-bold uppercase tracking-widest">We solve that.</p>
                            <p className="text-white/45 text-base leading-relaxed">
                                Every output goes through strategic alignment, emotional calibration, and brand tone refinement. Because performance doesn't come from hyper-real visuals alone.
                            </p>
                        </div>
                    </div>

                    {/* Right — solution cards */}
                    <div className="speed-cards flex flex-col gap-4 justify-center">
                        {solutions.map((s, i) => (
                            <div key={i} className="speed-card opacity-0">
                                <GlassCard>
                                    <div className="flex items-start gap-5">
                                        <div className="w-5 h-5 bg-[#00FF66] shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-white text-base md:text-lg font-black uppercase tracking-tight mb-1.5">{s.label}</p>
                                            <p className="text-white/40 text-sm font-medium leading-snug">{s.desc}</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 9 + 10 — PSYCHOLOGY HIGHLIGHT + EFFICIENCY
   ═══════════════════════════════════════════════════════════════════════════ */
export function PsychologyAndEfficiency() {
    const container = useRef<HTMLDivElement>(null);
    const eliminated = ["No large crews.", "No logistical overhead.", "No location bottlenecks."];
    const preserved = ["No compromise on quality.", "No compromise on brand voice.", "No compromise on impact."];

    useGSAP(() => {
        gsap.fromTo(".psych-card",
            { scale: 0.92, opacity: 0, y: 30, filter: "blur(10px)" },
            {
                scale: 1, opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".psych-card",
                    start: "top 88%",
                    end: "top 40%",
                    scrub: 2.5,
                }
            }
        );
        gsap.fromTo(".eff-left",
            { x: -70, opacity: 0, filter: "blur(8px)" },
            {
                x: 0, opacity: 1, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".eff-grid",
                    start: "top 88%",
                    end: "top 35%",
                    scrub: 2.2,
                }
            }
        );
        gsap.fromTo(".eff-right",
            { x: 70, opacity: 0, filter: "blur(8px)" },
            {
                x: 0, opacity: 1, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".eff-grid",
                    start: "top 88%",
                    end: "top 35%",
                    scrub: 2.2,
                }
            }
        );
    }, { scope: container });

    return (
        <div ref={container}>
            {/* Psychology */}
            <section className="relative bg-black py-16 md:py-40 overflow-hidden border-t border-white/[0.04]">
                {/* Bubble image — left side */}
                <ParallaxImage
                    src="/influencer/1 (2).jpeg"
                    alt="Campaign image"
                    className="w-24 md:w-36 lg:w-44 -left-4 md:-left-8 lg:-left-16 top-1/3"
                    speed={1.6}
                    direction="down"
                    floatAmp={11}
                    floatDuration={4.0}
                />
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <div className="psych-card opacity-0 border border-[#00FF66]/25 bg-[#00FF66]/[0.03] rounded-2xl p-10 md:p-20 text-center"
                        style={{ boxShadow: "0 0 80px rgba(0,255,102,0.07)" }}
                    >
                        <h3 className="font-black text-white leading-[0.9] tracking-tighter uppercase mb-8 flex flex-col gap-2"
                            style={{ fontSize: "clamp(28px, 4.5vw, 60px)" }}
                        >
                            <span>IT COMES FROM RELEVANCE.</span>
                            <span>FROM STORY.</span>
                            <span className="text-[#00FF66]">FROM PSYCHOLOGY.</span>
                        </h3>
                        <p className="text-[#00FF66]/60 text-base md:text-xl font-medium max-w-2xl mx-auto">
                            We remove the plasticity of AI and inject narrative intelligence into it.
                        </p>
                    </div>
                </div>
            </section>

            {/* Efficiency */}
            <section className="relative bg-black py-20 md:py-52 overflow-hidden border-t border-white/[0.04]">
                <DotGrid />
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
                    <SectionLabel text="Efficiency" />
                    <h2 className="font-black text-white leading-[0.88] tracking-tighter uppercase mb-16 max-w-4xl"
                        style={{ fontSize: "clamp(32px, 6vw, 80px)" }}
                    >
                        EFFICIENCY WITHOUT<br />
                        CREATIVE <span className="text-[#00FF66]">COMPROMISE</span>
                    </h2>

                    <p className="text-white/40 text-base md:text-lg leading-relaxed mb-14 max-w-2xl">
                        Traditional production increases cost with scale. NAWF increases output without increasing operational weight.
                    </p>

                    <div className="eff-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        <div className="eff-left opacity-0 border border-white/[0.08] bg-white/[0.015] rounded-xl p-8 md:p-10">
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/25 mb-8 pb-5 border-b border-white/[0.07]">Eliminated</p>
                            <div className="space-y-5">
                                {eliminated.map((e, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-4 h-4 border border-red-500/40 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-0.5 bg-red-500/70" />
                                        </div>
                                        <span className="text-white/35 text-base font-bold uppercase tracking-tight line-through">{e}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="eff-right opacity-0 border border-[#00FF66]/20 bg-[#00FF66]/[0.04] rounded-xl p-8 md:p-10">
                            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00FF66]/50 mb-8 pb-5 border-b border-[#00FF66]/10">But Also</p>
                            <div className="space-y-5">
                                {preserved.map((p, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-4 h-4 bg-[#00FF66] shrink-0" />
                                        <span className="text-white text-base font-black uppercase tracking-tight">{p}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 11 — VALUE PROPOSITION
   ═══════════════════════════════════════════════════════════════════════════ */
export function ValueProposition() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(".val-line",
            { opacity: 0, y: 50, filter: "blur(10px)", skewY: 1.5 },
            {
                opacity: 1, y: 0, filter: "blur(0px)", skewY: 0,
                stagger: { each: 0.25 },
                scrollTrigger: {
                    trigger: container.current,
                    start: "top 88%",
                    end: "top 20%",
                    scrub: 3,
                }
            }
        );
    }, { scope: container });

    return (
        <section ref={container} className="relative bg-black py-20 md:py-52 overflow-hidden border-t border-white/[0.04]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-2">
                {["MORE CONTENT.", "LOWER TAT.", "HIGHER STRATEGIC CLARITY."].map((line, i) => (
                    <h2 key={i} className={`val-line font-black leading-[0.8] tracking-tighter uppercase opacity-0 ${i === 2 ? "text-[#00FF66]" : "text-white"}`}
                        style={{ fontSize: "clamp(42px, 9vw, 110px)" }}
                    >{line}</h2>
                ))}
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 12 — INFLUENCE, REIMAGINED  ←  redesigned
   ═══════════════════════════════════════════════════════════════════════════ */
export function InfluenceSection() {
    const container = useRef<HTMLDivElement>(null);

    const services = [
        {
            number: "01",
            label: "Social strategy",
            desc: "AI-powered content calendars, platform-specific voice tuning, and cultural moment strategies that keep brands present and relevant.",
            tags: ["Instagram", "LinkedIn", "X / TikTok"],
        },
        {
            number: "02",
            label: "Paid campaigns",
            desc: "Performance ad creatives built for Meta, Google, and YouTube — generated at scale, calibrated for conversion, not just impressions.",
            tags: ["Meta Ads", "Google", "YouTube"],
        },
        {
            number: "03",
            label: "Product launches",
            desc: "Full-funnel launch systems — from teaser films to hero visuals to unboxing content — executed in weeks, not months.",
            tags: ["Campaign", "Content", "Go-to-Market"],
        },
        {
            number: "04",
            label: "Community building",
            desc: "AI-native digital personalities and influencer ecosystems that grow trust, compress funnels, and create durable brand loyalty.",
            tags: ["GenAI Influencers", "UGC", "Brand Voice"],
        },
    ];

    useGSAP(() => {
        gsap.fromTo(".inf-head",
            { opacity: 0, y: 32, filter: "blur(8px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".inf-head",
                    start: "top 90%",
                    end: "top 50%",
                    scrub: 2,
                }
            }
        );
        gsap.fromTo(".inf-sub",
            { opacity: 0, y: 18, filter: "blur(5px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".inf-sub",
                    start: "top 88%",
                    end: "top 50%",
                    scrub: 2,
                }
            }
        );
        gsap.fromTo(".inf-card",
            { y: 60, opacity: 0, scale: 0.96, filter: "blur(6px)" },
            {
                y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
                stagger: { each: 0.18, from: "start" },
                scrollTrigger: {
                    trigger: ".inf-grid",
                    start: "top 88%",
                    end: "top 20%",
                    scrub: 3,
                }
            }
        );
    }, { scope: container });

    return (
        <section ref={container} className="relative bg-black py-20 md:py-52 overflow-hidden border-t border-white/[0.04]">
            <DotGrid />
            {/* Neon gradient backdrop */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00FF66]/30 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
                <SectionLabel text="Influence" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
                    <h2 className="inf-head font-black text-white leading-[0.88] tracking-tighter uppercase opacity-0"
                        style={{ fontSize: "clamp(38px, 6vw, 78px)" }}
                    >
                        INFLUENCE,<br /><span className="text-[#00FF66]">REIMAGINED</span>
                    </h2>
                    <p className="inf-sub self-end text-white/45 text-base md:text-xl font-medium leading-relaxed max-w-lg opacity-0">
                        We also build AI-native digital personalities and influencer ecosystems. Controlled, scalable, aligned presence that integrates seamlessly into:
                    </p>
                </div>

                {/* Service cards — full feature cards */}
                <div className="inf-grid grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {services.map((s, i) => (
                        <div key={i} className="inf-card opacity-0 group relative rounded-2xl border border-white/[0.07]
              bg-white/[0.02] p-7 md:p-9 overflow-hidden cursor-default
              hover:border-[#00FF66]/25 transition-all duration-700"
                        >
                            {/* Hover background shimmer */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                style={{ background: "radial-gradient(ellipse at top left, rgba(0,255,102,0.07) 0%, transparent 60%)" }}
                            />

                            <div className="relative z-10">
                                {/* Number + label row */}
                                <div className="flex items-start justify-between mb-6">
                                    <span className="font-mono text-[#00FF66]/30 text-sm tracking-[0.2em]">{s.number}</span>
                                    <div className="w-5 h-5 border border-white/10 group-hover:border-[#00FF66]/40 group-hover:bg-[#00FF66]/10
                    transition-all duration-500 flex items-center justify-center"
                                    >
                                        <div className="w-1.5 h-1.5 bg-[#00FF66] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>

                                <h3 className="text-white font-black uppercase tracking-tight text-xl md:text-2xl mb-4 group-hover:text-[#00FF66] transition-colors duration-500">
                                    {s.label}
                                </h3>
                                <p className="text-white/40 text-sm md:text-base leading-relaxed font-medium mb-6">
                                    {s.desc}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {s.tags.map((t, j) => (
                                        <span key={j} className="font-mono text-xs text-white/25 border border-white/[0.07] rounded-full px-3 py-1
                      group-hover:border-[#00FF66]/20 group-hover:text-[#00FF66]/50 transition-all duration-500"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 13 + 14 — FINAL STATEMENT + CTA
   ═══════════════════════════════════════════════════════════════════════════ */
export function ConclusionCTA() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(".final-line",
            { opacity: 0, y: 36, filter: "blur(8px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                stagger: { each: 0.28 },
                scrollTrigger: {
                    trigger: ".final-head",
                    start: "top 88%",
                    end: "top 35%",
                    scrub: 2.5,
                }
            }
        );

        // Underline draws in as you scroll
        gsap.fromTo(".underline-draw",
            { scaleX: 0 },
            {
                scaleX: 1,
                scrollTrigger: {
                    trigger: ".underline-draw",
                    start: "top 86%",
                    end: "top 50%",
                    scrub: 2,
                }
            }
        );

        gsap.fromTo(".cta-wrap",
            { opacity: 0, y: 30, filter: "blur(8px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: {
                    trigger: ".cta-wrap",
                    start: "top 88%",
                    end: "top 50%",
                    scrub: 2,
                }
            }
        );

        // Continuous glow pulse on CTA button
        gsap.to(".cta-btn", {
            boxShadow: "0 0 80px rgba(0,255,102,0.5)",
            yoyo: true, repeat: -1, duration: 2.5, ease: "sine.inOut"
        });
    }, { scope: container });

    return (
        <div ref={container}>
            {/* Final statement */}
            <section className="relative bg-black py-32 md:py-52 overflow-hidden border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center final-head">
                    <h2 className="font-black text-white leading-[0.88] tracking-tighter uppercase mb-6"
                        style={{ fontSize: "clamp(32px, 5vw, 66px)" }}
                    >
                        <span className="final-line block opacity-0">INFLUENCE DOESN'T HAVE TO BE</span>
                        <span className="final-line block opacity-0">UNPREDICTABLE.</span>
                    </h2>

                    {/* Animated underline */}
                    <div className="relative inline-block mb-0">
                        <p className="final-line font-black text-[#00FF66] leading-[0.9] tracking-tighter uppercase opacity-0"
                            style={{ fontSize: "clamp(32px, 5vw, 66px)" }}
                        >
                            IT CAN BE ENGINEERED.
                        </p>
                        <div className="underline-draw absolute bottom-0 left-0 h-0.5 w-full bg-[#00FF66] origin-left" style={{ transform: "scaleX(0)" }} />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative bg-black py-32 md:py-40 overflow-hidden border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center cta-wrap opacity-0">
                    <a
                        href="#/contact"
                        className="cta-btn inline-flex items-center justify-center px-12 md:px-20 py-5 md:py-7
              bg-[#00FF66] text-black font-black uppercase tracking-tighter rounded-full
              hover:bg-white transition-colors duration-300 text-xl md:text-2xl"
                    >
                        SUBSCRIBE NOW TO GET STARTED
                    </a>
                    <p className="mt-6 text-white/25 font-mono text-xs uppercase tracking-[0.2em]">No contracts. Cancel anytime.</p>
                </div>
            </section>
        </div>
    );
}
