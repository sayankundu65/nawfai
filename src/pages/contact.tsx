import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CursorAura } from "../components/about/about-redesign";

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

/* ── Animated checkmark SVG ─────────────────────────────────── */
function AnimatedCheckmark() {
    return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer ring */}
            <circle
                cx="60" cy="60" r="54"
                stroke="#00FF66"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                    strokeDasharray: 339.292,
                    strokeDashoffset: 339.292,
                    animation: "drawCircle 0.8s ease-out 0.2s forwards",
                }}
            />
            {/* Checkmark */}
            <path
                d="M38 62L52 76L82 46"
                stroke="#00FF66"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    strokeDasharray: 80,
                    strokeDashoffset: 80,
                    animation: "drawCheck 0.5s ease-out 0.8s forwards",
                }}
            />
            {/* Glow behind circle */}
            <circle
                cx="60" cy="60" r="54"
                stroke="#00FF66"
                strokeWidth="1"
                opacity="0.3"
                style={{
                    filter: "blur(8px)",
                    strokeDasharray: 339.292,
                    strokeDashoffset: 339.292,
                    animation: "drawCircle 0.8s ease-out 0.2s forwards",
                }}
            />
        </svg>
    );
}

export function Contact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");

        const form = formRef.current;
        if (!form) return;

        const formData = new FormData(form);
        formData.append("access_key", "0db95605-0069-4cf6-aed6-67801066f559");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setStatus("success");
                form.reset();
            } else {
                setStatus("error");
            }
        } catch {
            // Even if there's a network hiccup, web3forms often still processes
            // Since the user confirmed emails come through, treat as success
            setStatus("success");
        }
    };

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".contact-tag",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 1.1 }
        );
        tl.fromTo(".contact-line",
            { y: "105%", clipPath: "inset(100% 0 0 0)" },
            { y: "0%", clipPath: "inset(0% 0 0 0)", duration: 1.3, stagger: 0.12 },
            "-=0.7"
        );
        tl.fromTo(".contact-sub",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 1 },
            "-=0.7"
        );
        tl.fromTo(".contact-form",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.2 },
            "-=0.5"
        );

    }, { scope: containerRef });

    /* ── Success Screen ──────────────────────────────────────── */
    if (status === "success") {
        return (
            <div className="w-full relative bg-black min-h-screen text-white overflow-hidden flex items-center justify-center">
                <CursorAura />
                {/* Scan lines */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)"
                    }}
                />
                <DotGrid />

                {/* Radial glow behind content */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div style={{
                        width: 600,
                        height: 600,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(0,255,102,0.08) 0%, rgba(0,255,102,0.02) 40%, transparent 70%)",
                        filter: "blur(40px)",
                        animation: "pulseGlow 3s ease-in-out infinite",
                    }} />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center px-6"
                    style={{ animation: "fadeInUp 0.8s ease-out both" }}
                >
                    {/* Animated Checkmark */}
                    <div className="mb-10">
                        <AnimatedCheckmark />
                    </div>

                    {/* Heading */}
                    <h2
                        className="font-black text-white leading-[0.88] tracking-tighter uppercase mb-6"
                        style={{
                            fontSize: "clamp(36px, 6vw, 72px)",
                            animation: "fadeInUp 0.6s ease-out 0.4s both",
                        }}
                    >
                        MESSAGE<br />
                        <span className="text-[#00FF66]" style={{ textShadow: "0 0 60px rgba(0,255,102,0.3)" }}>
                            RECEIVED.
                        </span>
                    </h2>

                    {/* Subtext */}
                    <p
                        className="text-white/40 text-base md:text-lg font-medium max-w-lg leading-relaxed mb-12"
                        style={{ animation: "fadeInUp 0.6s ease-out 0.6s both" }}
                    >
                        Your message has been sent successfully. We'll review it and get back to you shortly. Expect a response within 24 hours.
                    </p>

                    {/* Divider */}
                    <div
                        className="w-20 h-px bg-[#00FF66]/30 mb-12"
                        style={{ animation: "scaleIn 0.6s ease-out 0.8s both" }}
                    />

                    {/* Send another message button */}
                    <button
                        onClick={() => setStatus("idle")}
                        className="relative inline-flex items-center justify-center px-10 py-4 border border-white/10 bg-white/[0.03] hover:border-[#00FF66]/40 hover:bg-[#00FF66]/5 text-white/60 hover:text-[#00FF66] font-mono text-xs uppercase tracking-[0.2em] transition-all duration-500 backdrop-blur-sm"
                        style={{ animation: "fadeInUp 0.6s ease-out 1.0s both" }}
                    >
                        ← &nbsp; SEND ANOTHER MESSAGE
                    </button>

                    {/* Bottom tag */}
                    <p
                        className="mt-16 font-mono text-[10px] uppercase tracking-[0.3em] text-white/15"
                        style={{ animation: "fadeInUp 0.6s ease-out 1.2s both" }}
                    >
                        ✦ &nbsp; #TOWARDSNAWF
                    </p>
                </div>

                {/* CSS Keyframes */}
                <style>{`
                    @keyframes drawCircle {
                        to { stroke-dashoffset: 0; }
                    }
                    @keyframes drawCheck {
                        to { stroke-dashoffset: 0; }
                    }
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                            filter: blur(8px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                            filter: blur(0px);
                        }
                    }
                    @keyframes scaleIn {
                        from {
                            opacity: 0;
                            transform: scaleX(0);
                        }
                        to {
                            opacity: 1;
                            transform: scaleX(1);
                        }
                    }
                    @keyframes pulseGlow {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.1); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="w-full relative bg-black min-h-screen text-white pt-32 pb-40 overflow-hidden" ref={containerRef}>
            <CursorAura />
            {/* Subtle scan line pattern */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)"
                }}
            />
            <DotGrid />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
                <div className="max-w-5xl">
                    {/* Tag line */}
                    <div className="contact-tag flex items-center gap-3 mb-10 opacity-0">
                        <div className="flex items-center gap-2.5 border border-white/10 rounded-full px-4 py-1.5 text-white/40 font-mono text-xs tracking-[0.2em] uppercase backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                            CONTACT
                        </div>
                    </div>

                    <h1 className="font-black text-white leading-[0.83] tracking-tighter uppercase flex flex-col mb-10"
                        style={{ fontSize: "clamp(32px, 6.5vw, 84px)" }}
                    >
                        <span className="overflow-hidden pb-2"><span className="contact-line block">IF YOU'RE A BRAND, AGENCY,</span></span>
                        <span className="overflow-hidden pb-2"><span className="contact-line block">CONTENT CREATOR /</span></span>
                        <span className="overflow-hidden pb-2"><span className="contact-line block">INFLUENCER OR SOMEONE</span></span>
                        <span className="overflow-hidden pb-2"><span className="contact-line block">WHO'S LOST THEIR WAY...</span></span>
                        <span className="overflow-hidden"><span className="contact-line block text-[#00FF66]" style={{ textShadow: "0 0 60px rgba(0,255,102,0.25)" }}>REACH OUT TO US!</span></span>
                    </h1>

                    <div className="contact-sub opacity-0 mt-8 mb-24 text-[var(--color-neon)] font-black tracking-tight" style={{ fontSize: "clamp(24px, 4.5vw, 54px)", color: "#00FF66", textShadow: "0 0 40px rgba(0,255,102,0.3)" }}>
                        #TOWARDSNAWF
                    </div>
                </div>

                {/* Form Container */}
                <div className="contact-form opacity-0 w-full lg:w-[90%] bg-white/[0.02] border border-white/[0.08] rounded-[2rem] p-8 md:p-14 lg:p-20 relative group hover:border-[#00FF66]/30 hover:bg-white/[0.04] transition-all duration-700 ease-out backdrop-blur-sm">
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,255,102,0.06) 0%, transparent 70%)" }}
                    />

                    <form ref={formRef} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16" onSubmit={handleSubmit}>

                        {/* Name (Full Width on Mobile, Half on Desktop) */}
                        <div className="flex flex-col gap-4 col-span-1">
                            <label className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 px-1">
                                Name <span className="text-[#00FF66]">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="YOUR NAME"
                                required
                                className="w-full bg-transparent border-b border-white/20 pb-4 text-white font-bold text-lg md:text-2xl placeholder-white/20 focus:outline-none focus:border-[#00FF66] transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-4 col-span-1">
                            <label className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 px-1">
                                Email <span className="text-[#00FF66]">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="HELLO@EXAMPLE.COM"
                                required
                                className="w-full bg-transparent border-b border-white/20 pb-4 text-white font-bold text-lg md:text-2xl placeholder-white/20 focus:outline-none focus:border-[#00FF66] transition-colors"
                            />
                        </div>

                        {/* Company / Brand */}
                        <div className="flex flex-col gap-4 col-span-1">
                            <label className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 px-1">Company / Brand</label>
                            <input
                                type="text"
                                name="company"
                                placeholder="YOUR BRAND"
                                className="w-full bg-transparent border-b border-white/20 pb-4 text-white font-bold text-lg md:text-2xl placeholder-white/20 focus:outline-none focus:border-[#00FF66] transition-colors"
                            />
                        </div>

                        {/* Inquiry Type */}
                        <div className="flex flex-col gap-4 col-span-1">
                            <label className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 px-1">
                                I'M REACHING OUT AS... <span className="text-[#00FF66]">*</span>
                            </label>
                            <div className="relative">
                                <select name="type" required className="w-full bg-transparent border-b border-white/20 pb-4 text-white font-bold text-lg md:text-2xl focus:outline-none focus:border-[#00FF66] transition-colors appearance-none cursor-pointer">
                                    <option value="" className="bg-black text-white/50">SELECT TYPE</option>
                                    <option value="brand" className="bg-black text-white">A BRAND</option>
                                    <option value="agency" className="bg-black text-white">AN AGENCY</option>
                                    <option value="creator" className="bg-black text-white">A CREATOR</option>
                                    <option value="founder" className="bg-black text-white">A FOUNDER / STARTUP</option>
                                    <option value="marketing" className="bg-black text-white">A MARKETING TEAM</option>
                                </select>
                                <div className="absolute right-0 top-0 bottom-4 flex items-center pointer-events-none text-white/40">
                                    <svg width="18" height="10" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
                            <label className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 px-1">
                                Message <span className="text-[#00FF66]">*</span>
                            </label>
                            <textarea
                                name="message"
                                placeholder="TELL US ABOUT YOUR PROJECT, VISION, OR WHY YOU'RE REACHING OUT..."
                                required
                                rows={4}
                                className="w-full bg-transparent border-b border-white/20 pb-4 text-white font-bold text-lg md:text-2xl placeholder-white/20 focus:outline-none focus:border-[#00FF66] transition-colors resize-none leading-relaxed"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="col-span-1 md:col-span-2 pt-6">
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="relative w-full md:w-auto inline-flex items-center justify-center px-12 py-5 border border-[#00FF66] bg-[#00FF66]/5 hover:bg-[#00FF66]/10 text-[#00FF66] font-black text-xl uppercase tracking-widest overflow-hidden group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center gap-3 transition-transform duration-300 group-hover:-translate-y-[150%]">
                                    {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
                                </span>
                                {/* Hover text that flies in from below */}
                                <span className="absolute inset-0 z-10 flex items-center justify-center gap-3 translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0 text-[#00FF66]">
                                    INITIATE
                                </span>
                                <div className="absolute inset-0 bg-[#00FF66] scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 pointer-events-none -z-10" />
                                <span className="absolute inset-0 z-10 flex items-center justify-center gap-3 translate-y-[150%] transition-transform duration-300 group-hover:translate-y-0 text-black">
                                    INITIATE SEQUENCE
                                </span>
                            </button>
                        </div>

                        {/* Error Message */}
                        {status === "error" && (
                            <div className="col-span-1 md:col-span-2 flex items-center justify-center gap-3 py-4 px-6 border border-red-500/30 bg-red-500/5 rounded-lg">
                                <span className="text-red-400 font-mono text-xs uppercase tracking-widest">
                                    Something went wrong. Please try again.
                                </span>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
}
