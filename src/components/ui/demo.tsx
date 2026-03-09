'use client'

import { AppleWatchBubbles } from "@/src/components/ui/apple-watch-bubbles"

export function CardStackDemo() {
    const images = [
        { src: "/influencer/1 (8).jpg", alt: "Campaign Image 1" },
        { src: "/influencer/1 (9).jpg", alt: "Campaign Image 2" },
        { src: "/influencer/1 (10).jpg", alt: "Campaign Image 3" },
        { src: "/influencer/1 (11).jpg", alt: "Campaign Image 4" },
        { src: "/influencer/1 (12).jpg", alt: "Campaign Image 5" },
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
