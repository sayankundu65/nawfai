import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function LiveIndiaTime() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            };
            const dateOptions: Intl.DateTimeFormatOptions = {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "short",
                year: "numeric",
            };
            setTime(new Intl.DateTimeFormat("en-IN", options).format(now));
            setDate(new Intl.DateTimeFormat("en-IN", dateOptions).format(now));
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="ft-clock font-mono text-xs text-white/40 leading-tight">
            <div className="text-white/25 uppercase tracking-widest mb-1 text-[10px]">India</div>
            <div className="tabular-nums text-white/60">{time}</div>
            <div className="text-white/30">{date}</div>
        </div>
    );
}

export function Footer() {
    const footerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        // ── CTA headline ────────────────────────────────
        gsap.fromTo(".ft-tag",
            { opacity: 0, y: 14, filter: "blur(4px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: { trigger: ".ft-tag", start: "top 95%", end: "top 65%", scrub: 2 },
            }
        );
        gsap.fromTo(".ft-headline",
            { opacity: 0, y: 50, filter: "blur(12px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                scrollTrigger: { trigger: ".ft-headline", start: "top 95%", end: "top 55%", scrub: 2.5 },
            }
        );

        // ── Divider draws in ────────────────────────────
        gsap.fromTo(".ft-divider",
            { scaleX: 0, transformOrigin: "left center" },
            {
                scaleX: 1,
                scrollTrigger: { trigger: ".ft-divider", start: "top 92%", end: "top 60%", scrub: 2 },
            }
        );

        // ── Nav columns stagger in ─────────────────────
        gsap.fromTo(".ft-col",
            { opacity: 0, y: 30, filter: "blur(6px)" },
            {
                opacity: 1, y: 0, filter: "blur(0px)",
                stagger: { each: 0.2 },
                scrollTrigger: { trigger: ".ft-nav", start: "top 90%", end: "top 40%", scrub: 2.5 },
            }
        );

        // ── Nav links stagger ───────────────────────────
        gsap.fromTo(".ft-link",
            { opacity: 0, x: -10 },
            {
                opacity: 1, x: 0,
                stagger: { each: 0.06 },
                scrollTrigger: { trigger: ".ft-nav", start: "top 88%", end: "top 35%", scrub: 2.5 },
            }
        );

        // ── Bottom bar ──────────────────────────────────
        gsap.fromTo(".ft-divider-2",
            { scaleX: 0, transformOrigin: "right center" },
            {
                scaleX: 1,
                scrollTrigger: { trigger: ".ft-divider-2", start: "top 95%", end: "top 65%", scrub: 2 },
            }
        );
        gsap.fromTo(".ft-bottom-item",
            { opacity: 0, y: 10 },
            {
                opacity: 1, y: 0,
                stagger: { each: 0.15 },
                scrollTrigger: { trigger: ".ft-bottom", start: "top 95%", end: "top 65%", scrub: 2 },
            }
        );

        // ── Giant NAWF rises up ─────────────────────────
        gsap.fromTo(".ft-giant",
            { y: 60, opacity: 0 },
            {
                y: 0, opacity: 1,
                scrollTrigger: { trigger: ".ft-giant", start: "top 100%", end: "top 70%", scrub: 3 },
            }
        );

    }, { scope: footerRef });

    return (
        <footer ref={footerRef} className="relative bg-black text-white overflow-hidden border-t border-white/[0.06]">
            {/* ── Top CTA ─────────────────────────────────── */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-14 pt-20 pb-16">
                <p className="ft-tag font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FF66]/60 mb-6 opacity-0">
                    ✦ &nbsp;Let's work together
                </p>
                <h2
                    className="ft-headline font-black text-white leading-[0.88] tracking-tighter uppercase opacity-0"
                    style={{ fontSize: "clamp(36px, 7vw, 96px)" }}
                >
                    Let's make AI<br />
                    <span className="text-[#00FF66]">emotional.</span>
                </h2>
            </div>

            {/* ── Divider ─────────────────────────────────── */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-14">
                <div className="ft-divider w-full h-px bg-white/[0.08]" style={{ transform: "scaleX(0)" }} />
            </div>

            {/* ── Nav Columns ─────────────────────────────── */}
            <div className="ft-nav max-w-[1400px] mx-auto px-6 md:px-14 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
                {/* Primary */}
                <div className="ft-col opacity-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/25 mb-4 pb-3 border-b border-white/[0.07]">
                        Primary
                    </p>
                    <div className="flex flex-col gap-3">
                        {[
                            { label: "Home", href: "#/" },
                            { label: "About", href: "#/about" },
                            { label: "GenAI Influencers", href: "#/genai-influencers" },
                            { label: "Contact", href: "#/contact" },
                        ].map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                className="ft-link font-medium text-sm text-white/70 hover:text-white transition-colors duration-300 opacity-0"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Studio */}
                <div className="ft-col opacity-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/25 mb-4 pb-3 border-b border-white/[0.07]">
                        Studio
                    </p>
                    <div className="flex flex-col gap-3">
                        {[
                            { label: "What We Do", href: "#/about" },
                            { label: "Our Model", href: "#/about" },
                            { label: "Subscribe", href: "#/contact" },
                        ].map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                className="ft-link font-medium text-sm text-white/70 hover:text-white transition-colors duration-300 opacity-0"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Social */}
                <div className="ft-col opacity-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/25 mb-4 pb-3 border-b border-white/[0.07]">
                        Social
                    </p>
                    <div className="flex flex-col gap-3">
                        <a
                            href="https://www.instagram.com/nawf.ai/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ft-link font-medium text-sm text-white/70 hover:text-[#00FF66] transition-colors duration-300 flex items-center gap-2 opacity-0"
                        >
                            Instagram
                            <span className="text-[#00FF66] text-lg leading-none">↗</span>
                        </a>
                    </div>
                </div>

                {/* Start */}
                <div className="ft-col opacity-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/25 mb-4 pb-3 border-b border-white/[0.07]">
                        Ready to start?
                    </p>
                    <a
                        href="#/contact"
                        className="ft-link font-black text-sm uppercase tracking-tight text-white hover:text-[#00FF66] transition-colors duration-300 opacity-0"
                    >
                        Get in touch →
                    </a>
                </div>
            </div>

            {/* ── Bottom Bar ──────────────────────────────── */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-14">
                <div className="ft-divider-2 w-full h-px bg-white/[0.07]" style={{ transform: "scaleX(0)" }} />
                <div className="ft-bottom flex flex-col md:flex-row items-start md:items-center justify-between py-6 gap-4">
                    <p className="ft-bottom-item font-mono text-[10px] uppercase tracking-widest text-white/25 opacity-0">
                        © Copyright 2026 NAWF&nbsp;·&nbsp;All rights reserved
                    </p>
                    <div className="ft-bottom-item opacity-0">
                        <LiveIndiaTime />
                    </div>
                    <p className="ft-bottom-item font-mono text-[10px] uppercase tracking-widest text-white/20 hidden md:block opacity-0">
                        AI IS ONLY AS GOOD AS THE HUMANS WHO SHAPE IT&nbsp;
                        {"/ ".repeat(28)}
                    </p>
                </div>
            </div>

            {/* ── Giant Half-Cutout NAWF ───────────────────── */}
            <div
                className="ft-giant w-full select-none pointer-events-none opacity-0"
                style={{ lineHeight: 0.78, overflow: "hidden", height: "calc(clamp(100px, 18vw, 220px) * 0.55)" }}
            >
                <span
                    className="block font-black uppercase tracking-tighter text-white w-full text-center"
                    style={{
                        fontSize: "clamp(100px, 18vw, 220px)",
                        lineHeight: 0.78,
                    }}
                >
                    NAWF
                </span>
            </div>
        </footer>
    );
}
