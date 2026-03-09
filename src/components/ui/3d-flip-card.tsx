'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/src/lib/utils"

interface CardImage {
    src: string;
    alt: string;
}

interface CardStackProps {
    images: CardImage[];
    className?: string;
    cardWidth?: number;
    cardHeight?: number;
    spacing?: {
        x?: number;
        y?: number;
    };
}

interface CardProps extends CardImage {
    index: number;
    isHovered: boolean;
    isFirstCard?: boolean;
    isMobile: boolean;
    isFront?: boolean;
    frontCardIndex: number | null;
    onClick: (index: number) => void;
    width: number;
    height: number;
    spacing: { x?: number; y?: number };
}

const Card = ({
    src,
    alt,
    index,
    isHovered,
    isMobile,
    isFront,
    frontCardIndex,
    onClick,
    width,
    height,
    spacing
}: CardProps) => {
    return (
        <motion.div
            className={cn(
                "absolute overflow-hidden rounded-xl shadow-lg cursor-pointer",
                isFront && "z-20"
            )}
            style={{
                width,
                height,
                transformStyle: 'preserve-3d',
                transformOrigin: isMobile ? 'top center' : 'left center',
                zIndex: isFront ? 20 : 5 - index,
                filter: isFront || frontCardIndex === null ? 'none' : 'blur(5px)',
            }}
            initial={{
                rotateY: 0,
                x: 0,
                y: 0,
                scale: 1,
                boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
            }}
            animate={isFront
                ? {
                    scale: 1.2,
                    rotateY: 0,
                    x: 0,
                    y: isMobile ? 0 : -50,
                    z: 50,
                    boxShadow: '0px 15px 40px rgba(0, 0, 0, 0.5)',
                }
                : isHovered
                    ? {
                        rotateY: isMobile ? 0 : -45,
                        x: isMobile ? 0 : index * (spacing.x ?? 50),
                        y: isMobile ? index * (spacing.y ?? 50) : index * -5,
                        z: index * 15,
                        scale: 1.05,
                        boxShadow: `10px 20px 30px rgba(0, 0, 0, ${0.2 + index * 0.05})`,
                        transition: { type: 'spring', stiffness: 300, damping: 50, delay: index * 0.1 }
                    }
                    : {
                        rotateY: 0,
                        x: 0,
                        y: 0,
                        z: 0,
                        scale: 1,
                        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                        transition: { type: 'spring', stiffness: 300, damping: 20, delay: (4 - index) * 0.1 }
                    }
            }
            onClick={() => onClick(index)}
        >
            <img
                src={src}
                alt={alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                className="rounded-xl"
            />
        </motion.div>
    );
};

const MobileBubbleUI = ({ images }: { images: CardImage[] }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Honeycomb positions for 5 items
    const bubblePositions = [
        { x: 0, y: 0 },            // center
        { x: -90, y: -65 },        // top left
        { x: 90, y: -65 },         // top right
        { x: -90, y: 75 },         // bottom left
        { x: 90, y: 75 },          // bottom right
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setActiveIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden py-10 z-20">
            <motion.div
                ref={containerRef}
                drag={activeIndex === null}
                dragConstraints={{ top: -30, bottom: 30, left: -30, right: 30 }}
                dragElastic={0.2}
                className="relative flex justify-center items-center w-full h-full cursor-grab active:cursor-grabbing"
                style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
            >
                {images.map((img, i) => {
                    const isActive = activeIndex === i;
                    const isOtherActive = activeIndex !== null && !isActive;

                    return (
                        <motion.div
                            key={i}
                            onClick={() => setActiveIndex(isActive ? null : i)}
                            className="absolute overflow-hidden cursor-pointer"
                            style={{
                                width: isActive ? 280 : 130,
                                height: isActive ? 360 : 130,
                                borderRadius: isActive ? 20 : 100, // circle to rounded rect
                                zIndex: isActive ? 50 : 10 - i,
                                // 3d apple watch feel with inner shadows and lighting
                                boxShadow: isActive
                                    ? '0 25px 50px -12px rgba(0,0,0,0.5)'
                                    : 'inset 10px 10px 20px rgba(255,255,255,0.2), inset -10px -10px 20px rgba(0,0,0,0.5), 0 15px 25px rgba(0,0,0,0.3)',
                                transformStyle: 'preserve-3d',
                            }}
                            initial={false}
                            animate={{
                                x: isActive ? 0 : bubblePositions[i]?.x || 0,
                                y: isActive ? 0 : bubblePositions[i]?.y || 0,
                                z: isActive ? 100 : 0,
                                scale: isActive ? 1 : isOtherActive ? 0.6 : 1,
                                opacity: isOtherActive ? 0.5 : 1,
                                rotateX: isActive ? 0 : [0, 15, -15, 0],
                                rotateY: isActive ? 0 : [0, -15, 15, 0],
                                filter: isOtherActive ? 'blur(4px)' : 'none'
                            }}
                            transition={{
                                rotateX: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
                                rotateY: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut' },
                                x: { type: 'spring', stiffness: 300, damping: 25 },
                                y: { type: 'spring', stiffness: 300, damping: 25 },
                                z: { type: 'spring', stiffness: 300, damping: 25 },
                                scale: { type: 'spring', stiffness: 300, damping: 25 },
                                borderRadius: { duration: 0.3 }
                            }}
                        >
                            <img src={img.src} alt={img.alt} className="w-full h-full object-cover pointer-events-none" />
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}

export function CardStack3D({
    images,
    className,
    cardWidth = 320,
    cardHeight = 192,
    spacing = { x: 50, y: 50 }
}: CardStackProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [frontCardIndex, setFrontCardIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setFrontCardIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isMobile) {
        return <MobileBubbleUI images={images} />;
    }

    return (
        <div className={cn("flex justify-center items-center py-10 z-20", className)}>
            <div
                ref={containerRef}
                className="relative perspective-1000"
                style={{ width: cardWidth, height: cardHeight }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {images.map((image, index) => (
                    <Card
                        key={index}
                        {...image}
                        index={index}
                        isHovered={isHovered}
                        isFirstCard={index === 0}
                        isMobile={isMobile}
                        isFront={frontCardIndex === index}
                        frontCardIndex={frontCardIndex}
                        onClick={(idx) => setFrontCardIndex(prev => prev === idx ? null : idx)}
                        width={cardWidth}
                        height={cardHeight}
                        spacing={spacing}
                    />
                ))}
            </div>
        </div>
    );
}
