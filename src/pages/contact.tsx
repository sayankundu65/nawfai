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

export function Contact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("Sending...");
        
        const formData = new FormData(e.currentTarget);
        // Replace with your Web3Forms access key
        formData.append("access_key", "0db95605-0069-4cf6-aed6-67801066f559");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setStatus("Message sent successfully! We'll be in touch.");
                e.currentTarget.reset();
            } else {
                setStatus("Something went wrong. Please try again.");
            }
        } catch (error) {
            setStatus("Something went wrong. Please try again.");
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

                    <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16" onSubmit={handleSubmit}>

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
                                I’M REACHING OUT AS... <span className="text-[#00FF66]">*</span>
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
                            <button className="relative w-full md:w-auto inline-flex items-center justify-center px-12 py-5 border border-[#00FF66] bg-[#00FF66]/5 hover:bg-[#00FF66]/10 text-[#00FF66] font-black text-xl uppercase tracking-widest overflow-hidden group transition-all duration-300">
                                <span className="relative z-10 flex items-center gap-3 transition-transform duration-300 group-hover:-translate-y-[150%]">
                                    SEND MESSAGE
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

                        {/* Status Message */}
                        {status && (
                            <div className="col-span-1 md:col-span-2 text-[#00FF66] font-mono text-xs uppercase tracking-widest text-center mt-4">
                                {status}
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
}
