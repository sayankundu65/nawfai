'use client'

import { AppleWatchBubbles } from "@/src/components/ui/apple-watch-bubbles"

export function CardStackDemo() {
    const images = [
        { src: "/images after hero (1).jpg", alt: "Campaign Image 1" },
        { src: "/images after hero (2).jpg", alt: "Campaign Image 2" },
        { src: "/images after hero (3).jpg", alt: "Campaign Image 3" },
        { src: "/images after hero (4).jpg", alt: "Campaign Image 4" },
        { src: "/images after hero (5).jpg", alt: "Campaign Image 5" },
    ]

    return (
        /*
          Taller box so the bottom bubbles don't get cut off.
          overflow-visible lets bubbles breathe slightly outside the box edges.
          w-full fills the entire left column.
        */
        <div className="w-full" style={{ height: 'clamp(380px, 55vw, 620px)', overflow: 'visible' }}>
            <AppleWatchBubbles images={images} />
        </div>
    )
}
