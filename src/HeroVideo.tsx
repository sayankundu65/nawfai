import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAspect } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uHoverState;
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Calculate raw video color
  vec4 videoColor = texture2D(uTexture, uv);
  
  // Create a localized hover area using distance
  float dist = distance(uv, uMouse);
  float radius = 0.15; // Hover area radius
  
  // Smoothly blend the transition boundary
  float hoverMask = smoothstep(radius, radius - 0.05, dist) * uHoverState;
  
  // Calculate monochrome (grayscale) value
  // Standard luminance weights: 0.299*R + 0.587*G + 0.114*B
  float luminance = dot(videoColor.rgb, vec3(0.299, 0.587, 0.114));
  vec3 monochromeColor = vec3(luminance);
  
  // Mix original color with monochrome based on hover mask (spotlight area)
  vec3 finalColor = mix(videoColor.rgb, monochromeColor, hoverMask);
  
  gl_FragColor = vec4(finalColor, videoColor.a);
}
`;

function Scene({ videoUrl, isHovered, isVisible }: { videoUrl: string, isHovered: boolean, isVisible: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { size } = useThree();

    // object-contain logic
    const videoAspect = 16 / 9;
    const screenAspect = size.width / size.height;

    let width = size.width;
    let height = size.height;

    if (screenAspect > videoAspect) {
        height = size.height;
        width = size.height * videoAspect;
    } else {
        width = size.width;
        height = size.width / videoAspect;
    }

    const [videoTexture, setVideoTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.crossOrigin = "Anonymous";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        videoRef.current = video;

        const tex = new THREE.VideoTexture(video);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.format = THREE.RGBAFormat;

        setVideoTexture(tex);

        return () => {
            video.pause();
            video.src = "";
            video.load();
            tex.dispose();
            videoRef.current = null;
        };
    }, [videoUrl]);

    // Handle play/pause based on visibility
    useEffect(() => {
        if (videoRef.current) {
            if (isVisible) {
                videoRef.current.play().catch(() => {
                    // Fallback for browsers that block autoplay
                    console.warn("Video play interrupted or blocked");
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isVisible]);

    const uniforms = useMemo(
        () => ({
            uTexture: { value: null },
            uTime: { value: 0 },
            uHoverState: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        }),
        []
    );

    useFrame((state, delta) => {
        if (!isVisible) return; // Skip updates when not visible

        if (materialRef.current) {
            if (videoTexture) {
                materialRef.current.uniforms.uTexture.value = videoTexture;
            }
            materialRef.current.uniforms.uTime.value += delta;

            const targetHover = isHovered ? 1.0 : 0.0;
            materialRef.current.uniforms.uHoverState.value += (targetHover - materialRef.current.uniforms.uHoverState.value) * 0.1;

            const uvX = (state.pointer.x + 1) / 2;
            const uvY = (state.pointer.y + 1) / 2;

            materialRef.current.uniforms.uMouse.value.x += (uvX - materialRef.current.uniforms.uMouse.value.x) * 0.1;
            materialRef.current.uniforms.uMouse.value.y += (uvY - materialRef.current.uniforms.uMouse.value.y) * 0.1;
        }
    });

    if (!videoTexture) return null;

    return (
        <mesh ref={meshRef} scale={[width, height, 1]}>
            <planeGeometry args={[1, 1, 1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    );
}

export default function HeroVideo({ src }: { src: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const observerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={observerRef}
            className="w-full h-full cursor-none relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
        >
            <Canvas
                orthographic
                camera={{ position: [0, 0, 1], zoom: 1 }}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: false
                }}
                dpr={[1, 2]} // Limit DPR for performance
            >
                <Scene videoUrl={src} isHovered={isHovered} isVisible={isVisible} />
            </Canvas>
        </div>
    );
}
