import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SlicedText } from "../components/ui/sliced-text";

gsap.registerPlugin(ScrollTrigger);

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 md:p-8 group
      hover:border-[#00FF66]/30 hover:bg-white/[0.04] backdrop-blur-md
      transition-all duration-700 ease-out ${className}`}
        >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,255,102,0.05) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

function DotGrid() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0"
            style={{
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)`,
                backgroundSize: "28px 28px",
                opacity: 0.025,
            }}
        />
    );
}

export function GenAIInfluencers() {
    const container = useRef<HTMLDivElement>(null);
    const decoRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".fade-up",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.15 }
        );

        gsap.fromTo(".card-reveal",
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out",
                scrollTrigger: { trigger: ".cards-container", start: "top 85%", toggleActions: "play none none none" }
            }
        );

        // Deco animations: subtle rotation and zoom on scroll, matching the original demo template
        decoRefs.current.forEach(image => {
            if (!image) return;
            gsap.fromTo(image, {
                transformOrigin: '800% 50%',
                rotationZ: -8
            }, {
                ease: 'power1',
                rotationZ: 5,
                scrollTrigger: {
                    trigger: image,
                    start: 'top bottom',
                    end: 'top top+=10%',
                    scrub: true
                }
            });
        });

        // Small scroll triggers for spaced content paragraphs to ease them up as they enter
        gsap.utils.toArray(".text-reveal").forEach((elem) => {
            gsap.fromTo(elem as HTMLElement,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 1,
                    scrollTrigger: {
                        trigger: elem as HTMLElement,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

    }, { scope: container });

    const NUM_IMAGES = 36;
    // We use picsum.photos for abstract placeholder images. Each image gets a different seed based on its index.
    const images = Array.from({ length: NUM_IMAGES }).map((_, i) => `https://picsum.photos/seed/influencer${i}/600/900`);

    return (
        <div ref={container} className="w-full relative bg-black min-h-[300vh] text-white pt-32 pb-40 overflow-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
                .deco-container {
                    display: grid;
                    width: 80%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 10%;
                    z-index: 0;
                    opacity: 0.18;
                    pointer-events: none;
                    grid-template-columns: repeat(3,auto);
                    grid-template-rows: repeat(36,1fr);
                }

                .deco-item {
                    grid-column: 3 / span 1;
                    background-size: cover;
                    background-position: center;
                    width: auto;
                    aspect-ratio: 2/3;
                    max-width: 33vw;
                    border-radius: 4px;
                }

                .deco-item:nth-child(2n) {
                    max-width: 18vw;
                    grid-column: 1 / span 3;
                }

                .deco-item:nth-child(3n) {
                    max-width: 12vw;
                    grid-column: 2 / span 2;
                }

                @media screen and (min-width: 768px) {
                    .deco-container {
                        grid-template-columns: repeat(5,auto);
                    }
                    .deco-item {
                        grid-column: 5 / span 1;
                        max-width: 20vw;
                    }
                    .deco-item:nth-child(2n) {
                        max-width: 18vw;
                        grid-column: 1 / span 5;
                    }

                    .deco-item:nth-child(3n) {
                        max-width: 7vw;
                        grid-column: 4 / span 2;
                    }

                    .deco-item:nth-child(4n) {
                        grid-column: 3 / span 3;
                    }

                    .deco-item:nth-child(5n) {
                        max-width: 10vw;
                        grid-column: 2 / span 4;
                    }
                }
            `}} />

            {/* Scrolling Image Grid Background */}
            <div className="deco-container">
                {images.map((src, i) => (
                    <div
                        key={i}
                        ref={el => { decoRefs.current[i] = el; }}
                        className="deco-item border border-[#00FF66]/10 shadow-[0_0_15px_rgba(0,255,102,0.05)]"
                        style={{ backgroundImage: `url(${src})` }}
                    />
                ))}
            </div>

            <DotGrid />

            {/* Subtle glow orb */}
            <div className="absolute top-0 right-[20%] w-[600px] h-[600px] bg-[#00FF66]/[0.03] rounded-full blur-[100px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col mb-40 mt-10 md:mt-20">
                    <p className="fade-up font-mono text-[#00FF66] text-sm tracking-[0.2em] uppercase mb-8">
                        Influence, Reimagined
                    </p>

                    <h1 className="font-black leading-[0.88] tracking-tighter uppercase mb-10 overflow-hidden"
                        style={{ fontSize: "clamp(36px, 7vw, 100px)" }}
                    >
                        <SlicedText text="IF THEY DON'T" effect={1} className="fade-up text-white" splits={6} />
                        <SlicedText text="FEEL HUMAN" effect={3} className="fade-up text-[#00FF66]" splits={6} />
                        <SlicedText text="THEY DON'T" effect={1} className="fade-up text-white" splits={6} />
                        <SlicedText text="INFLUENCE." effect={4} className="fade-up text-white" splits={6} />
                    </h1>

                    <div className="fade-up max-w-2xl space-y-6">
                        <p className="text-white/80 text-lg md:text-2xl font-medium leading-relaxed">
                            AI-native digital personalities and influencer ecosystems.
                        </p>
                        <p className="text-white/60 text-base md:text-lg leading-relaxed">
                            Influence doesn't have to be unpredictable.<br />
                            It can be engineered.
                        </p>
                        <div className="pt-6">
                            <button className="bg-white text-black font-bold uppercase tracking-tight px-8 py-4 rounded-full text-sm hover:!bg-[#00FF66] transition-colors duration-300 transform hover:scale-105 inline-block cursor-pointer">
                                SUBSCRIBE NOW TO GET STARTED
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Spaced Out Mixed Content (Similar to SlicedTextEffect demo) --- */}

                <div className="max-w-3xl ml-auto px-4 md:px-0 my-[15vh]">
                    <p className="text-reveal text-white/50 text-xl md:text-3xl font-medium leading-relaxed mb-6 border-l-2 border-[#00FF66] pl-6">
                        <span className="text-[#00FF66]">Ai</span>ra Oberoi.<br />
                        Dh<span className="text-[#00FF66]">ai</span>rya Nair.
                    </p>
                    <div className="text-left w-full">
                        <SlicedText text="In-House" effect={2} className="text-[#00FF66]/80 font-black uppercase text-5xl md:text-[100px] mt-12" splits={4} />
                    </div>
                </div>

                <div className="max-w-3xl mr-auto px-4 md:px-0 my-[15vh]">
                    <p className="text-reveal text-white/50 text-xl md:text-3xl font-medium leading-relaxed mb-6 border-r-2 border-[#00FF66] pr-6 text-right">
                        <span className="text-[#00FF66]">Real creators</span> with an overlap mindset. Scaling instantly.
                    </p>
                    <div className="text-right w-full flex justify-end">
                        <SlicedText text="100+" effect={5} className="text-white font-black uppercase text-5xl md:text-[90px] mt-12 mix-blend-plus-lighter" splits={6} />
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 md:px-0 my-[15vh] text-center">
                    <div className="flex justify-center w-full">
                        <SlicedText text="Custom" effect={6} className="text-[#00FF66]/60 font-black uppercase text-5xl md:text-[120px] mb-12" splits={5} />
                    </div>
                    <p className="text-reveal text-white/60 text-lg md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
                        Brand AI Creators. <span className="text-[#00FF66]/80 text-base">&lt;ON DEMAND&gt;</span>
                    </p>
                </div>

            </div>
        </div>
    );
}
