import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

interface SubCategory {
    title: string;
    items: string[];
}

interface ServiceCategory {
    index: string;
    label: string;
    title: string;
    color: string;
    sub: SubCategory[];
}

const SERVICES: ServiceCategory[] = [
    {
        index: "01",
        label: "CONTENT",
        title: "Content Production",
        color: "#39FF14",
        sub: [
            {
                title: "Videography",
                items: [
                    "Cinematic brand films",
                    "TVCs / Digital commercials",
                    "Performance ad creatives (Meta/Google/YouTube)",
                    "Office Walkthroughs",
                    "Vision Films",
                    "Launch films",
                    "CGI Videos",
                    "Short Form",
                    "3D Product Renders",
                    "Long Form",
                ],
            },
            {
                title: "UGC-Style Videos",
                items: [
                    "Testimonial videos",
                    "Product demo videos",
                    "POV Storytelling",
                    "Explainer Videos",
                ],
            },
            {
                title: "Cinematic Storytelling",
                items: ["Narrative-led Videos"],
            },
            {
                title: "Photography",
                items: [
                    "Product photography (studio)",
                    "Multi-Angle Product Capture",
                    "Lifestyle product shoots",
                    "E-commerce catalog shoots",
                    "Fashion lookbooks",
                    "Campaign key visuals",
                    "A+ Content Layouts",
                    "Thumbnails",
                    "International Location Simulation",
                ],
            },
        ],
    },
    {
        index: "02",
        label: "MEME",
        title: "Meme Marketing",
        color: "#FFFFFF",
        sub: [
            {
                title: "Culture-First Content",
                items: [
                    "Brand meme strategy",
                    "Trend-jacking campaigns",
                    "Community-native formats",
                    "Viral social content",
                ],
            },
        ],
    },
    {
        index: "03",
        label: "BRANDING",
        title: "Branding",
        color: "#39FF14",
        sub: [
            {
                title: "Brand Identity",
                items: [
                    "Brand Identity Design",
                    "Workplace Branding",
                    "Branded Environmental Graphics (EGD)",
                    "Booth & event branding",
                    "In-store Installations",
                    "Internal brand training",
                ],
            },
            {
                title: "Website & Digital Assets",
                items: [
                    "Email marketing flows",
                    "SEO Optimization",
                    "High-conversion landing pages",
                    "Website design (UI/UX)",
                ],
            },
            {
                title: "Offline & Experiential",
                items: [
                    "Print creatives",
                    "Brand activations",
                    "Transit branding",
                    "Retail branding",
                    "Pop-up store design",
                    "DOOH",
                    "OOH",
                ],
            },
        ],
    },
    {
        index: "04",
        label: "INFLUENCE",
        title: "NAWF's Own Influencers",
        color: "#FFFFFF",
        sub: [
            {
                title: "In-House Creators",
                items: ["Aira Oberoi", "Dhairya Nair"],
            },
            {
                title: "Creator Network",
                items: ["100+ real creators with an overlap mindset"],
            },
            {
                title: "Custom Brand AI",
                items: ["Custom Brand AI Creators <ON DEMAND>"],
            },
        ],
    },
];

// ─── WebGL Noise Card Canvas ──────────────────────────────────────────────────

function WebGLNoiseCard({
    color,
    active,
}: {
    color: string;
    active: boolean;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const progRef = useRef<WebGLProgram | null>(null);
    const startRef = useRef<number>(Date.now());
    const uniformsRef = useRef<{
        time: WebGLUniformLocation | null;
        resolution: WebGLUniformLocation | null;
        color: WebGLUniformLocation | null;
        intensity: WebGLUniformLocation | null;
    }>({ time: null, resolution: null, color: null, intensity: null });
    const intensityRef = useRef(0);

    const hex2rgb = (hex: string): [number, number, number] => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? [
                parseInt(result[1], 16) / 255,
                parseInt(result[2], 16) / 255,
                parseInt(result[3], 16) / 255,
            ]
            : [0, 1, 0];
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl", { antialias: true });
        if (!gl) return;
        glRef.current = gl;

        const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

        const frag = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec3 u_color;
      uniform float u_intensity;

      float hash(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = p * 2.0 + vec2(0.13, 0.07);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float t = u_time * 0.4;

        vec2 q = vec2(fbm(uv + t * 0.5), fbm(uv + vec2(1.0)));
        vec2 r = vec2(fbm(uv + q + vec2(1.7, 9.2) + t * 0.3), fbm(uv + q + vec2(8.3, 2.8)));
        float f = fbm(uv + r);

        vec3 bg = vec3(0.02, 0.02, 0.02);
        vec3 glow = u_color * f * u_intensity * 0.9;

        // Edge vignette
        vec2 c = (uv - 0.5) * 2.0;
        float vig = 1.0 - dot(c * 0.4, c * 0.4);
        vig = clamp(vig, 0.0, 1.0);

        float scanline = sin(uv.y * 300.0 + t * 10.0) * 0.01 * u_intensity;

        gl_FragColor = vec4(bg + glow * vig + scanline, 1.0);
      }
    `;

        const compile = (type: number, src: string) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        };

        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
        gl.linkProgram(prog);
        gl.useProgram(prog);
        progRef.current = prog;

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );
        const loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        uniformsRef.current = {
            time: gl.getUniformLocation(prog, "u_time"),
            resolution: gl.getUniformLocation(prog, "u_resolution"),
            color: gl.getUniformLocation(prog, "u_color"),
            intensity: gl.getUniformLocation(prog, "u_intensity"),
        };

        const rgb = hex2rgb(color);

        const render = () => {
            if (!canvasRef.current) return;
            const w = canvasRef.current.clientWidth;
            const h = canvasRef.current.clientHeight;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
            const t = (Date.now() - startRef.current) / 1000;
            const u = uniformsRef.current;
            gl.uniform1f(u.time, t);
            gl.uniform2f(u.resolution, w, h);
            gl.uniform3f(u.color, rgb[0], rgb[1], rgb[2]);
            intensityRef.current += (active ? 1.0 : 0.15 - intensityRef.current) * 0.05;
            gl.uniform1f(u.intensity, intensityRef.current);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // intensity is smoothed in render loop via intensityRef + active
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: "block" }}
        />
    );
}

// ─── Sub-category Card ────────────────────────────────────────────────────────

function SubCard({
    sub,
    delay,
    color,
}: {
    sub: SubCategory;
    delay: number;
    color: string;
}) {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative overflow-hidden rounded-2xl border border-white/10 min-h-[260px] flex flex-col"
            style={{
                background: "rgba(8,8,8,0.8)",
                backdropFilter: "blur(12px)",
                transition: "border-color 0.4s ease",
                borderColor: hovered ? `${color}66` : "rgba(255,255,255,0.08)",
                boxShadow: hovered ? `0 0 40px ${color}22` : "none",
            }}
        >
            {/* WebGL background */}
            <WebGLNoiseCard color={color} active={hovered} />

            {/* Content overlay */}
            <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
                {/* Header */}
                <div
                    className="pb-4 mb-5 flex items-center gap-3"
                    style={{ borderBottom: `1px solid ${color}33` }}
                >
                    <motion.div
                        animate={{ rotate: hovered ? 180 : 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                    />
                    <h4
                        className="font-mono text-xs uppercase tracking-[0.25em] font-bold"
                        style={{ color }}
                    >
                        {sub.title}
                    </h4>
                </div>

                {/* Items */}
                <ul className="flex flex-col gap-2.5 flex-1">
                    {sub.items.map((item, ii) => (
                        <motion.li
                            key={ii}
                            initial={{ opacity: 0, x: -10 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: delay + 0.15 + ii * 0.04, duration: 0.5 }}
                            className="flex items-start gap-3 group/item"
                        >
                            <span
                                className="mt-[7px] w-1 h-1 rounded-full shrink-0 transition-all duration-300"
                                style={{
                                    backgroundColor: hovered ? color : "rgba(255,255,255,0.3)",
                                    transform: hovered ? "scale(1.8)" : "scale(1)",
                                }}
                            />
                            <span className="text-sm md:text-base text-gray-400 leading-snug transition-colors duration-300 group-hover/item:text-white">
                                {item}
                            </span>
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Corner accent */}
            <motion.div
                className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at top right, ${color}22, transparent 70%)`,
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.4s ease",
                }}
            />
        </motion.div>
    );
}

// ─── Panel Row (one accordion entry) ─────────────────────────────────────────

function ServicePanel({
    cat,
    isOpen,
    onClick,
    index,
}: {
    cat: ServiceCategory;
    isOpen: boolean;
    onClick: () => void;
    index: number;
}) {
    const panelRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const inView = useInView(panelRef, { once: true, margin: "-80px 0px" });

    // GSAP: slide the row number + label on hover
    const handleMouseEnter = useCallback(() => {
        if (!titleRef.current) return;
        gsap.to(titleRef.current, {
            letterSpacing: "-0.01em",
            duration: 0.4,
            ease: "power3.out",
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!titleRef.current) return;
        gsap.to(titleRef.current, {
            letterSpacing: "-0.05em",
            duration: 0.4,
            ease: "power3.out",
        });
    }, []);

    return (
        <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-white/10 overflow-hidden"
        >
            {/* ── Header Row ── */}
            <button
                onClick={onClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="w-full group relative flex items-center justify-between py-7 md:py-10 px-0 text-left overflow-hidden"
                aria-expanded={isOpen}
            >
                {/* Hover fill sweep */}
                <motion.div
                    className="absolute inset-0 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: `${cat.color}09` }}
                />

                {/* Left: number + title */}
                <div className="relative z-10 flex items-center gap-6 md:gap-12 pl-4 md:pl-8">
                    <span
                        className="font-mono text-base md:text-xl font-bold transition-colors duration-300"
                        style={{ color: isOpen ? cat.color : "rgba(255,255,255,0.25)" }}
                    >
                        {cat.index}
                    </span>
                    <h3
                        ref={titleRef}
                        className="text-4xl md:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-none transition-colors duration-400"
                        style={{ color: isOpen ? cat.color : "white" }}
                    >
                        {cat.title}
                    </h3>
                </div>

                {/* Right: animated icon */}
                <div className="relative z-10 pr-4 md:pr-8 shrink-0">
                    <motion.div
                        animate={{
                            rotate: isOpen ? 45 : 0,
                            backgroundColor: isOpen ? cat.color : "transparent",
                            borderColor: isOpen ? cat.color : "rgba(255,255,255,0.2)",
                        }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full border flex items-center justify-center shrink-0"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-colors duration-300"
                            style={{ color: isOpen ? "#000" : "currentColor" }}
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </motion.div>
                </div>
            </button>

            {/* ── Expanded Panel ── */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-14 pt-6 pl-4 md:pl-28 pr-4 md:pr-8">
                            {/* Service label tag row */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="mb-8 flex items-center gap-4"
                            >
                                <span
                                    className="font-mono text-xs uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border"
                                    style={{
                                        color: cat.color,
                                        borderColor: `${cat.color}44`,
                                        background: `${cat.color}0D`,
                                    }}
                                >
                                    {cat.label}
                                </span>
                                <div
                                    className="flex-1 h-px"
                                    style={{ background: `linear-gradient(to right, ${cat.color}55, transparent)` }}
                                />
                            </motion.div>

                            {/* Cards grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 2xl:grid-cols-4">
                                {cat.sub.map((sub, si) => (
                                    <SubCard
                                        key={si}
                                        sub={sub}
                                        delay={si * 0.08}
                                        color={cat.color}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Scroll-Driven Ticker ─────────────────────────────────────────────────────

function TickerBand() {
    const words = [
        "CONTENT",
        "•",
        "MEME MARKETING",
        "•",
        "BRANDING",
        "•",
        "INFLUENCERS",
        "•",
    ];

    return (
        <div className="relative overflow-hidden py-4 border-y border-white/10 my-0">
            <motion.div
                className="flex whitespace-nowrap gap-12"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            >
                {[...words, ...words, ...words, ...words].map((w, i) => (
                    <span
                        key={i}
                        className={`font-mono text-xs tracking-[0.4em] uppercase ${w === "•" ? "text-[var(--color-neon)]" : "text-white/25"
                            }`}
                    >
                        {w}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

// ─── Ambient Floating Orbs ────────────────────────────────────────────────────

function AmbientOrbs() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute rounded-full blur-[140px]"
                style={{
                    width: 600,
                    height: 600,
                    background: "radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 70%)",
                    top: "10%",
                    right: "-10%",
                }}
                animate={{ y: [0, 60, 0], x: [0, -30, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute rounded-full blur-[120px]"
                style={{
                    width: 400,
                    height: 400,
                    background: "radial-gradient(circle, rgba(57,255,20,0.04) 0%, transparent 70%)",
                    bottom: "20%",
                    left: "-5%",
                }}
                animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
        </div>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const chars = el.querySelectorAll<HTMLElement>(".char-anim");
        if (!chars.length) return;

        // GSAP stagger per character
        gsap.fromTo(
            chars,
            { y: "110%", opacity: 0 },
            {
                y: "0%",
                opacity: 1,
                stagger: 0.04,
                duration: 0.9,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    once: true,
                },
            }
        );
    }, []);

    const titleChars = "WHAT WE OFFER.".split("");

    return (
        <div ref={ref} className="px-4 md:px-12 mb-8 md:mb-16 flex flex-col items-center text-center">
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-neon)] mb-8 rounded-full border border-[var(--color-neon)]/30 px-5 py-2"
            >
                Capabilities
            </motion.p>

            <div ref={containerRef} className="overflow-hidden">
                <h2
                    className="text-[10vw] md:text-[7.5vw] font-black uppercase tracking-tighter leading-[0.85] text-white flex flex-wrap justify-center"
                    aria-label="What we offer"
                >
                    {titleChars.map((c, i) => {
                        const isHighlight = i >= 8; // "OFFER." portion
                        return (
                            <span
                                key={i}
                                className="char-anim inline-block"
                                style={{
                                    opacity: 0,
                                    color: isHighlight ? "transparent" : "white",
                                    WebkitTextStroke: isHighlight ? "2px var(--color-neon)" : "none",
                                    marginRight: c === " " ? "0.3em" : undefined,
                                }}
                            >
                                {c === " " ? "\u00A0" : c}
                            </span>
                        );
                    })}
                </h2>
            </div>

            {/* Underline reveal */}
            <motion.div
                className="mt-4 h-[2px] bg-[var(--color-neon)] origin-left"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "60%", maxWidth: 600 }}
            />
        </div>
    );
}

// ─── Full Section ─────────────────────────────────────────────────────────────

export function ServicesSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const sectionRef = useRef<HTMLElement>(null);

    // GSAP scroll pin effect for the top badge
    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "+=200",
                onEnter: () => { },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleToggle = useCallback(
        (i: number) => {
            setOpenIndex((prev) => (prev === i ? null : i));
        },
        []
    );

    return (
        <section
            ref={sectionRef}
            id="services"
            className="relative z-10 bg-[var(--color-ink)] text-white pt-28 pb-40 overflow-hidden"
        >
            <AmbientOrbs />

            {/* Header */}
            <SectionHeader />

            {/* Ticker */}
            <TickerBand />

            {/* Accordion */}
            <div className="max-w-[1440px] mx-auto w-full px-0 md:px-2 border-t border-white/10 mt-0">
                {SERVICES.map((cat, i) => (
                    <ServicePanel
                        key={cat.index}
                        cat={cat}
                        index={i}
                        isOpen={openIndex === i}
                        onClick={() => handleToggle(i)}
                    />
                ))}
            </div>

            {/* Bottom fade */}
            <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-40"
                style={{
                    background:
                        "linear-gradient(to bottom, transparent, rgba(0,0,0,0.9))",
                }}
            />
        </section>
    );
}
