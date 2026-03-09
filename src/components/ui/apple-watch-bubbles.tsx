'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'motion/react'

interface BubbleImage {
    src: string
    alt: string
}

interface AppleWatchBubblesProps {
    images: BubbleImage[]
    className?: string
}

// Fixed float params per bubble
const FLOAT = [
    { y: 10, dur: 4.4 },
    { y: 13, dur: 5.2 },
    { y: 8, dur: 3.9 },
    { y: 11, dur: 4.8 },
    { y: 9, dur: 5.6 },
]

// Position/size layout (% of container width)
// [imgIdx, left%, top%, size%, entryDelay]
const LAYOUT = [
    [0, 2, 2, 38, 0.05],
    [1, 46, 0, 46, 0.15],
    [2, 22, 42, 44, 0.25],
    [3, -2, 56, 36, 0.35],
    [4, 52, 52, 38, 0.45],
]

const MAX_REPEL = 28   // px — max how far a bubble moves
const REPEL_RADIUS = 160  // px — influence radius around cursor
const SPRING_CFG = { stiffness: 180, damping: 22, mass: 1 }

function RepelBubble({
    src, alt,
    leftPct, topPct, sizePct,
    entryDelay,
    floatIdx,
    isInView,
    containerRef,
}: {
    src: string
    alt: string
    leftPct: number
    topPct: number
    sizePct: number
    entryDelay: number
    floatIdx: number
    isInView: boolean
    containerRef: React.RefObject<HTMLDivElement | null>
}) {
    const fp = FLOAT[floatIdx]
    const bubbleRef = useRef<HTMLDivElement>(null)

    // Spring-smoothed repulsion offset
    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const springX = useSpring(rawX, SPRING_CFG)
    const springY = useSpring(rawY, SPRING_CFG)

    useEffect(() => {
        // Desktop only
        if (typeof window === 'undefined') return
        const isDesktop = window.matchMedia('(pointer: fine)').matches
        if (!isDesktop) return

        const onMouseMove = (e: MouseEvent) => {
            const container = containerRef.current
            const bubble = bubbleRef.current
            if (!container || !bubble) return

            const cRect = container.getBoundingClientRect()
            const bRect = bubble.getBoundingClientRect()

            // Bubble center in viewport coords
            const bCx = bRect.left + bRect.width / 2
            const bCy = bRect.top + bRect.height / 2

            const dx = e.clientX - bCx
            const dy = e.clientY - bCy
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < REPEL_RADIUS && dist > 0) {
                // Force falls off with distance; negative = push away
                const force = (1 - dist / REPEL_RADIUS) * MAX_REPEL
                rawX.set(-(dx / dist) * force)
                rawY.set(-(dy / dist) * force)
            } else {
                rawX.set(0)
                rawY.set(0)
            }
        }

        window.addEventListener('mousemove', onMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', onMouseMove)
    }, [containerRef, rawX, rawY])

    return (
        <motion.div
            ref={bubbleRef}
            className="absolute"
            style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${sizePct}%`,
                aspectRatio: '1 / 1',
                x: springX,
                y: springY,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 130, damping: 18, delay: entryDelay }}
        >
            {/* Floating oscillation layer */}
            <motion.div
                className="w-full h-full"
                animate={{ y: [-fp.y, fp.y, -fp.y] }}
                transition={{ duration: fp.dur, repeat: Infinity, ease: 'easeInOut' }}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    style={{
                        borderRadius: '50%',
                        display: 'block',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                    }}
                    draggable={false}
                />
            </motion.div>
        </motion.div>
    )
}

export function AppleWatchBubbles({ images, className = '' }: AppleWatchBubblesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: '-60px' })

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full ${className}`}
            style={{ overflow: 'visible' }}
        >
            {LAYOUT.map(([imgIdx, left, top, size, delay], i) => (
                <RepelBubble
                    key={i}
                    src={images[(imgIdx as number) % images.length].src}
                    alt={images[(imgIdx as number) % images.length].alt}
                    leftPct={left as number}
                    topPct={top as number}
                    sizePct={size as number}
                    entryDelay={delay as number}
                    floatIdx={i}
                    isInView={isInView}
                    containerRef={containerRef}
                />
            ))}
        </div>
    )
}
