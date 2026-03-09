import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../../lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface SlicedTextProps {
    text: string;
    effect?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    splits?: number;
}

export function SlicedText({ text, effect = 1, className, splits }: SlicedTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const measurementRef = useRef<HTMLSpanElement>(null);
    const innersRef = useRef<(HTMLSpanElement | null)[]>([]);
    const innerWrapsRef = useRef<(HTMLSpanElement | null)[]>([]);

    const [totalCells, setTotalCells] = useState(splits || 6);

    useEffect(() => {
        if (!splits) {
            switch (effect) {
                case 1: case 2: case 3:
                    setTotalCells(4); break;
                case 4:
                    setTotalCells(6); break;
                default:
                    setTotalCells(6); break;
            }
        }
    }, [effect, splits]);

    // Combined measurement + animation setup
    // Re-runs whenever totalCells or text changes, AND is re-invoked via resize.
    useEffect(() => {
        if (!containerRef.current || innersRef.current.length === 0) return;

        const el = containerRef.current;
        innersRef.current = innersRef.current.slice(0, totalCells);
        innerWrapsRef.current = innerWrapsRef.current.slice(0, totalCells);

        const itemInner = innersRef.current.filter(Boolean) as HTMLSpanElement[];
        const itemInnerWrap = innerWrapsRef.current.filter(Boolean) as HTMLSpanElement[];

        // ── Step 1: Measure & set CSS custom properties ─────────────────────
        const applyMeasurement = () => {
            const measureEl = measurementRef.current;
            if (!measureEl) return;
            const computedWidth = measureEl.getBoundingClientRect().width;
            el.style.setProperty('--text-width', `${computedWidth}px`);
            el.style.setProperty('--gsplits', String(totalCells));
            itemInner.forEach((inner, pos) => {
                if (inner) gsap.set(inner, { left: `calc(var(--text-width) / var(--gsplits) * ${-pos})` });
            });
        };

        // ── Step 2: Build GSAP scroll animations ────────────────────────────
        // Stored so we can revert + rebuild on resize
        let ctx = gsap.context(() => { }, el);

        const buildAnimations = () => {
            ctx.revert(); // Kill existing tweens + ScrollTriggers scoped to this element

            applyMeasurement();

            ctx = gsap.context(() => {
                const scrollConfig = {
                    trigger: el,
                    start: 'top bottom',
                    end: 'center center',
                    scrub: 1
                };

                if (effect === 1) {
                    const initialValues = { x: 13 };
                    gsap.fromTo(itemInner, {
                        xPercent: (pos, _, arr) => pos < arr.length / 2 ? -initialValues.x * pos - initialValues.x : initialValues.x * (pos - arr.length / 2) + initialValues.x,
                    }, {
                        ease: 'power1',
                        xPercent: 0,
                        scrollTrigger: scrollConfig
                    });
                } else if (effect === 2) {
                    const initialValues = { x: 30 };
                    gsap.timeline({
                        defaults: { ease: 'power1' },
                        scrollTrigger: scrollConfig
                    })
                        .fromTo(itemInner, { xPercent: pos => initialValues.x * pos }, { xPercent: 0 }, 0)
                        .fromTo(itemInnerWrap, { xPercent: pos => 2 * (pos + 1) * 10 }, { xPercent: 0 }, 0);
                } else if (effect === 3) {
                    const intervalPixels = 100;
                    const totalWidth = (itemInnerWrap.length - 1) * intervalPixels;
                    const offset = (totalWidth / 2) * -1;
                    const initialValues = { x: 30, y: -15, rotation: -5 };

                    gsap.timeline({
                        defaults: { ease: 'power1' },
                        scrollTrigger: scrollConfig
                    })
                        .fromTo(itemInner, {
                            xPercent: (pos, _, arr) => pos < arr.length / 2 ? -initialValues.x * pos - initialValues.x : initialValues.x * (pos - arr.length / 2) + initialValues.x,
                            yPercent: (pos, _, arr) => pos < arr.length / 2 ? initialValues.y * (arr.length / 2 - pos) : initialValues.y * ((pos + 1) - arr.length / 2),
                        }, { xPercent: 0, yPercent: 0 }, 0)
                        .fromTo(itemInnerWrap, {
                            xPercent: pos => (pos * intervalPixels) + offset,
                            rotationZ: (pos, _, arr) => pos < arr.length / 2 ? -initialValues.rotation * (arr.length / 2 - pos) - initialValues.rotation : initialValues.rotation * (pos - arr.length / 2) + initialValues.rotation
                        }, { xPercent: 0, rotationZ: 0 }, 0);
                } else if (effect === 4) {
                    const intervalPixels = 100;
                    const totalWidth = (itemInnerWrap.length - 1) * intervalPixels;
                    const offset = (totalWidth / 2) * -1;
                    const initialValues = { x: 50 };

                    gsap.timeline({
                        defaults: { ease: 'power1' },
                        scrollTrigger: { trigger: el, start: 'top bottom+=10%', end: 'center center', scrub: 1 }
                    })
                        .fromTo(itemInner, {
                            xPercent: (pos, _, arr) => pos < arr.length / 2 ? -initialValues.x * pos - initialValues.x : initialValues.x * (pos - arr.length / 2) + initialValues.x,
                        }, { xPercent: 0 }, 0)
                        .fromTo(itemInner, { scaleX: 1.5, scaleY: 0, transformOrigin: '50% 0%' }, { ease: 'power2.inOut', scaleX: 1, scaleY: 1 }, 0)
                        .fromTo(itemInnerWrap, {
                            xPercent: pos => (pos * intervalPixels) + offset,
                        }, { xPercent: 0, stagger: { amount: 0.07, from: 'center' } }, 0);
                } else {
                    // Default (effect 5, 6, etc.)
                    const initialValues = { x: 10 };
                    gsap.fromTo(itemInner, {
                        xPercent: (pos, _, arr) => pos < arr.length / 2 ? pos * -initialValues.x - initialValues.x : (pos - arr.length / 2) * initialValues.x + initialValues.x,
                    }, {
                        ease: 'power1', xPercent: 0,
                        scrollTrigger: scrollConfig
                    });
                }
            }, el);

            // Refresh all triggers after rebuild so positions are correct
            requestAnimationFrame(() => ScrollTrigger.refresh(true));
        };

        // Initial build — wait for fonts then measure
        document.fonts.ready.then(buildAnimations);
        setTimeout(buildAnimations, 100);
        setTimeout(buildAnimations, 500); // Safari fallback

        // ── Step 3: Debounced resize handler ─────────────────────────────────
        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildAnimations, 120); // debounce 120ms
        };
        window.addEventListener('resize', onResize);

        return () => {
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            ctx.revert();
        };
    }, [effect, totalCells, text]);

    return (
        <div
            ref={containerRef}
            className={cn(className)}
            style={{
                display: "grid",
                whiteSpace: "nowrap",
                lineHeight: 1,
                justifyContent: "center",
                gridTemplateColumns: "repeat(var(--gsplits), calc(var(--text-width) / var(--gsplits)))",
                margin: 0,
                fontWeight: 400
            }}
        >
            {/* Phantom element for exact unconstrained measurement */}
            <span
                ref={measurementRef}
                style={{ width: "max-content", position: "absolute", visibility: "hidden", whiteSpace: "nowrap", pointerEvents: "none" }}
            >
                {text}
            </span>

            {Array.from({ length: totalCells }).map((_, i) => (
                <span
                    key={i}
                    ref={el => { innerWrapsRef.current[i] = el; }}
                    style={{ overflow: "hidden", position: "relative", willChange: "transform", marginRight: "-0.5px" }}
                >
                    <span
                        ref={el => { innersRef.current[i] = el; }}
                        style={{ width: "max-content", position: "relative", display: "block", willChange: "transform", whiteSpace: "nowrap" }}
                    >
                        {text}
                    </span>
                </span>
            ))}
        </div>
    )
}
