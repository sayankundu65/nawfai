"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"

interface Particle {
    x: number
    y: number
    baseX: number
    baseY: number
    vx: number
    vy: number
    size: number
    color: string
}

interface TextParticleProps {
    text: string
    fontSize?: number
    fontFamily?: string
    particleSize?: number
    particleColor?: string
    particleDensity?: number
    backgroundColor?: string
    className?: string
}

export function TextParticle({
    text,
    fontSize = 80,
    fontFamily = "Bricolage Grotesque, Arial, sans-serif",
    particleSize = 2,
    particleColor = "#000000",
    particleDensity = 6,
    backgroundColor = "transparent",
    className = "",
}: TextParticleProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animationRef = useRef<number | null>(null)
    const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null })
    const isVisibleRef = useRef(true)
    const [canvasHeight, setCanvasHeight] = useState<number>(Math.ceil(fontSize * 1.4))

    // Sample pixels at CSS resolution (not physical) - MUCH faster
    const buildParticles = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, fontReady: boolean) => {
        const w = canvas.offsetWidth
        if (w === 0) return

        // Use system font first for instant render, switch to custom when ready
        const font = fontReady ? fontFamily : `Arial, sans-serif`

        // Offscreen canvas at CSS pixels (1:1, no DPR scaling for sampling)
        const offscreen = document.createElement("canvas")
        offscreen.width = w
        offscreen.height = Math.ceil(fontSize * 2) // generous height for sampling
        const offCtx = offscreen.getContext("2d", { willReadFrequently: true })
        if (!offCtx) return

        offCtx.font = `bold ${fontSize}px ${font}`
        offCtx.fillStyle = "#000"
        offCtx.textAlign = "center"
        offCtx.textBaseline = "middle"
        offCtx.fillText(text, w / 2, offscreen.height / 2)

        const imageData = offCtx.getImageData(0, 0, w, offscreen.height)
        const newParticles: Particle[] = []

        // Adaptive density: more on desktop, fewer on mobile for speed
        const step = particleDensity

        for (let py = 0; py < offscreen.height; py += step) {
            for (let px = 0; px < w; px += step) {
                const i = (py * w + px) * 4
                if (imageData.data[i + 3] > 128) {
                    newParticles.push({
                        x: px,
                        y: py,
                        baseX: px,
                        baseY: py,
                        vx: 0,
                        vy: 0,
                        size: particleSize,
                        color: particleColor,
                    })
                }
            }
        }

        // Measure real text height to tightly fit the canvas
        offCtx.clearRect(0, 0, w, offscreen.height)
        offCtx.font = `bold ${fontSize}px ${font}`
        const m = offCtx.measureText(text)
        const ascent = m.actualBoundingBoxAscent ?? fontSize * 0.8
        const descent = m.actualBoundingBoxDescent ?? fontSize * 0.2
        const textH = Math.ceil(ascent + descent)
        const padY = Math.ceil(fontSize * 0.25)
        const tightH = textH + padY * 2

        // Remap particle Y from big offscreen canvas to tight canvas
        const offset = Math.floor(offscreen.height / 2) - Math.floor(ascent) - padY
        for (const p of newParticles) {
            p.y -= offset
            p.baseY -= offset
            // Clamp
            if (p.y < 0) p.y = 0
            if (p.baseY < 0) p.baseY = 0
        }

        // Set physical canvas size (DPR for crisp display drawing only, not sampling)
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = w * dpr
        canvas.height = tightH * dpr
        ctx.scale(dpr, dpr)

        setCanvasHeight(tightH)
        particlesRef.current = newParticles
    }, [text, fontSize, fontFamily, particleSize, particleColor, particleDensity])

    // Init: render immediately with system font, then upgrade when custom font loads
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let cancelled = false

        const init = (fontReady: boolean) => {
            if (cancelled) return
            buildParticles(ctx, canvas, fontReady)
        }

        // Render immediately with fallback font (instant)
        // Small timeout to let layout settle and offsetWidth be correct
        const quickTimer = setTimeout(() => init(false), 0)

        // Then upgrade once custom font is loaded
        if (document.fonts) {
            document.fonts.load(`bold ${fontSize}px ${fontFamily}`).then(() => {
                if (!cancelled) init(true)
            }).catch(() => { /* use fallback */ })
        }

        const ro = new ResizeObserver(() => {
            if (!cancelled) {
                // Reset scale before rebuilding
                const c = canvasRef.current
                const cx = c?.getContext("2d")
                if (c && cx) {
                    cx.setTransform(1, 0, 0, 1, 0, 0)
                    buildParticles(cx, c, true)
                }
            }
        })
        ro.observe(canvas)

        // IntersectionObserver: pause RAF when off-screen
        const io = new IntersectionObserver(([entry]) => {
            isVisibleRef.current = entry.isIntersecting
        }, { threshold: 0 })
        io.observe(canvas)

        return () => {
            cancelled = true
            clearTimeout(quickTimer)
            ro.disconnect()
            io.disconnect()
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [buildParticles, fontSize, fontFamily])

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        if (animationRef.current) cancelAnimationFrame(animationRef.current)

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate)

            // Skip rendering when scrolled off screen
            if (!isVisibleRef.current) return

            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const w = canvas.width / dpr
            const h = canvas.height / dpr

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, w, h)

            if (backgroundColor !== "transparent") {
                ctx.fillStyle = backgroundColor
                ctx.fillRect(0, 0, w, h)
            }

            const { x: mx, y: my } = mouseRef.current
            const particles = particlesRef.current

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]

                if (mx !== null && my !== null) {
                    const dx = mx - p.x
                    const dy = my - p.y
                    const distSq = dx * dx + dy * dy
                    if (distSq < 8100) { // 90^2
                        const dist = Math.sqrt(distSq)
                        const force = (90 - dist) / 90
                        p.vx -= (dx / dist) * force * 3.5
                        p.vy -= (dy / dist) * force * 3.5
                    }
                }

                // Spring back with damping
                p.vx += (p.baseX - p.x) * 0.08
                p.vy += (p.baseY - p.y) * 0.08
                p.vx *= 0.82
                p.vy *= 0.82
                p.x += p.vx
                p.y += p.vy

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = p.color
                ctx.fill()
            }
        }

        animate()

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [backgroundColor])

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleMouseLeave = () => {
        mouseRef.current = { x: null, y: null }
    }

    return (
        <canvas
            ref={canvasRef}
            style={{ height: canvasHeight, display: "block" }}
            className={`w-full ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        />
    )
}
