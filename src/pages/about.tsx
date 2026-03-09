import {
    CursorAura,
    HeroSection,
    AccelerationLayer,
    ProblemInsight,
    StudioExplanation,
    TypographicStatements,
    SpeedVsEmotion,
    PsychologyAndEfficiency,
    ValueProposition,
    InfluenceSection,
    ConclusionCTA,
} from "../components/about/about-redesign";
import { AsciiUfo } from "../components/about/ascii-ufo";

export function About() {
    return (
        <div className="w-full relative bg-black overflow-x-clip">
            {/* Cursor-reactive aura — lives fixed above everything */}
            <CursorAura />

            {/* ASCII UFO — ghost-grid layout-aware background animation */}
            <AsciiUfo />

            <HeroSection />
            <AccelerationLayer />
            <ProblemInsight />
            <StudioExplanation />
            <TypographicStatements />
            <SpeedVsEmotion />
            <PsychologyAndEfficiency />
            <ValueProposition />
            <InfluenceSection />
            <ConclusionCTA />
        </div>
    );
}
