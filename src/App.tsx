import { useRef, useState, useEffect } from "react";
import { AsciiInsects } from "./components/ui/ascii-insects";
import { MorphingCursorShape } from "./components/ui/morphing-cursor";
import { CustomCursor } from "./components/layout/cursor";
import { BackgroundEffects } from "./components/layout/background-effects";
import { Nav } from "./components/layout/nav";
import { Footer } from "./components/layout/footer";
import { Home } from "./pages/home";
import { About } from "./pages/about";
import { Contact } from "./pages/contact";
import { GenAIInfluencers } from "./pages/genai-influencers";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPath, setCurrentPath] = useState(window.location.hash || "#/");

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPath(window.location.hash || "#/");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPath]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] grid-lines selection:bg-[var(--color-neon)] selection:text-[var(--color-ink)] relative">
      {/* Desktop-only overlays: custom cursor, morphing shape, ASCII insect art */}
      <div className="hidden md:block">
        <CustomCursor />
        <MorphingCursorShape />
      </div>
      <BackgroundEffects />
      {/* ASCII insects — fixed overlay, desktop only */}
      <div
        aria-hidden="true"
        className="hidden md:block"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9,
          overflow: "hidden",
        }}
      >
        <AsciiInsects />
      </div>
      <Nav />
      {currentPath === "#/about" ? <About /> :
        currentPath === "#/contact" ? <Contact /> :
          currentPath === "#/genai-influencers" ? <GenAIInfluencers /> :
            <Home />}
      <Footer />
    </div>
  );
}
