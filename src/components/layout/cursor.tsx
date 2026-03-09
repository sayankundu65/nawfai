import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, .cursor-pointer')) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a, button, .cursor-pointer')) {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-[var(--color-neon)] rounded-full pointer-events-none z-[9999]"
                animate={{
                    x: mousePosition.x - 4,
                    y: mousePosition.y - 4,
                    opacity: isHovering ? 0 : 1
                }}
                transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-[var(--color-neon)] pointer-events-none z-[9998] flex items-center justify-center"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isHovering ? 1.5 : 1,
                    rotate: isHovering ? 45 : 0,
                    borderRadius: isHovering ? "50%" : "0%"
                }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
            >
                <motion.div
                    className="w-1 h-1 bg-[var(--color-neon)] opacity-0"
                    animate={{ opacity: isHovering ? 1 : 0 }}
                />
            </motion.div>
        </>
    );
}
