import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const LINKS = [
    { label: "Home", href: "#/" },
    { label: "About", href: "#/about" },
    { label: "GenAI Influencers", href: "#/genai-influencers" },
    { label: "Contact", href: "#/contact" },
];

export function Nav() {
    const [currentPath, setCurrentPath] = useState(window.location.hash || "#/");
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const pillRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 }); // normalized 0-1
    const [isHovered, setIsHovered] = useState(false);

    // Update gradient & tilt based on cursor position over the pill
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!pillRef.current) return;
        const rect = pillRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePos({ x: Math.min(Math.max(x, 0), 1), y: Math.min(Math.max(y, 0), 1) });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setMousePos({ x: 0.5, y: 0.5 }); // Reset to center
    };

    const handleMouseEnter = () => setIsHovered(true);

    // Apply CSS variables for gradient and tilt
    const pillStyle: React.CSSProperties = {
        background: "rgba(10, 15, 12, 0.75)", // Deep frosted glass for high contrast on white bg
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15)",
        // Liquid glass gradient following cursor (intensity changes on hover)
        backgroundImage: isHovered
            ? `radial-gradient(180px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(0,255,102,0.15), transparent 100%)`
            : `radial-gradient(180px circle at 50% 50%, rgba(0,255,102,0.03), transparent 100%)`,
        // Subtle 3D tilt + gentle pop
        transform: isHovered
            ? `perspective(800px) rotateX(${(mousePos.y - 0.5) * 12}deg) rotateY(${(mousePos.x - 0.5) * -12}deg) scale(1.02)`
            : `perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)`,
        // Smooth transition back when mouse leaves, crisp track while moving
        transition: isHovered
            ? "transform 0.1s ease-out, background-image 0s"
            : "transform 0.5s ease-out, background-image 0.5s ease-out",
        transformOrigin: "center center",
    };

    /* ── track active route ──────────────────────────────────────── */
    useEffect(() => {
        const onHash = () => setCurrentPath(window.location.hash || "#/");
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, []);

    /* ── liquid entry animation ──────────────────────────────────── */
    useEffect(() => {
        if (!pillRef.current) return;
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        // pill drops in from above with a squish/bounce
        tl.fromTo(pillRef.current,
            { y: -80, scaleY: 0.3, scaleX: 1.18, opacity: 0, filter: "blur(12px)" },
            { y: 0, scaleY: 1, scaleX: 1, opacity: 1, filter: "blur(0px)", duration: 1.1 }
        )
            // links ripple in
            .fromTo(".nav-link",
                { opacity: 0, y: -10, filter: "blur(4px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.07 },
                "-=0.55"
            )
            // logo pops in
            .fromTo(".nav-logo",
                { opacity: 0, scale: 0.7, filter: "blur(6px)" },
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.55 },
                "-=0.8"
            )
            // CTA slides in from right
            .fromTo(".nav-cta",
                { opacity: 0, x: 20, filter: "blur(4px)" },
                { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.55 },
                "-=0.5"
            );
    }, []);

    /* ── mobile menu open/close animation ────────────────────────── */
    useEffect(() => {
        if (!mobileMenuRef.current) return;
        if (menuOpen) {
            gsap.fromTo(mobileMenuRef.current,
                { opacity: 0, y: -10, display: "none" },
                { opacity: 1, y: 0, display: "block", duration: 0.4, ease: "power3.out" }
            );
        } else {
            gsap.to(mobileMenuRef.current,
                {
                    opacity: 0, y: -10, duration: 0.25, ease: "power2.in", onComplete: () => {
                        gsap.set(mobileMenuRef.current, { display: "none" });
                    }
                }
            );
        }
    }, [menuOpen]);

    const isActive = (href: string) => currentPath === href;

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 w-full z-[100] flex flex-col items-center pt-3 md:pt-4 px-4"
            style={{ pointerEvents: "none" }}
        >
            {/* ── Floating glass pill ───────────────────────────────── */}
            <div
                ref={pillRef}
                className="w-full max-w-6xl"
                style={{ pointerEvents: "auto" }}
            >
                <div
                    className="flex items-center justify-between px-5 md:px-8 h-16 rounded-2xl"
                    style={pillStyle}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Logo */}
                    <a href="#/" className="nav-logo flex items-center gap-2.5 shrink-0 cursor-pointer">
                        <img
                            src="/logo.png"
                            alt="NAWF"
                            className="h-8 w-auto object-contain"
                            style={{ filter: "brightness(0) invert(1)" }}
                            draggable={false}
                        />
                    </a>

                    {/* Desktop nav links — centered */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {LINKS.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`nav-link px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive(link.href)
                                    ? "bg-white/10 text-white"
                                    : "text-white/55 hover:text-white hover:bg-white/[0.06]"
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA button (desktop) + Hamburger (mobile) */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Desktop CTA */}
                        <a
                            href="#/contact"
                            className="nav-cta hidden md:flex items-center gap-2.5 bg-white text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#00FF66] transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                            Request Access
                            {/* Arrow icon */}
                            <span
                                className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center shrink-0"
                            >
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </a>

                        {/* Hamburger (mobile) */}
                        <button
                            className="md:hidden nav-cta w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.12] transition-all duration-300"
                            onClick={() => setMenuOpen(o => !o)}
                            aria-label="Toggle menu"
                        >
                            <span
                                className="block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center"
                                style={menuOpen ? { transform: "rotate(45deg) translate(4px, 4px)" } : {}}
                            />
                            <span
                                className="block h-[1.5px] bg-white transition-all duration-300"
                                style={menuOpen ? { width: 0, opacity: 0 } : { width: "14px" }}
                            />
                            <span
                                className="block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center"
                                style={menuOpen ? { transform: "rotate(-45deg) translate(4px, -4px)" } : {}}
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                <div
                    ref={mobileMenuRef}
                    className="md:hidden pt-2"
                    style={{ opacity: 0, display: "none" }}
                >
                    <div
                        className="rounded-2xl px-4 py-4 flex flex-col gap-1 relative"
                        style={{
                            background: "rgba(10, 15, 12, 0.85)", // Solid deep frosted glass
                            backdropFilter: "blur(40px) saturate(180%)",
                            WebkitBackdropFilter: "blur(40px) saturate(180%)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                        }}
                    >
                        {LINKS.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={`px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive(link.href)
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="mt-2 pt-2 border-t border-white/[0.06]">
                            <a
                                href="#/contact"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center justify-center gap-2 bg-white text-black font-bold text-sm px-5 py-3 rounded-xl hover:bg-[#00FF66] transition-all duration-300 cursor-pointer"
                            >
                                Request Access
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
