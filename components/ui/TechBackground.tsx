"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Sparkles, Float, Stars, Trail } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function AnimatedGrid() {
    const gridRef = useRef<any>(null);
    const { mouse } = useThree();

    useFrame((state) => {
        if (gridRef.current) {
            // Subtle breathing
            const t = state.clock.elapsedTime;
            gridRef.current.position.z = Math.sin(t * 0.2) * 0.5;

            // Tilt based on mouse
            gridRef.current.rotation.x = THREE.MathUtils.lerp(gridRef.current.rotation.x, mouse.y * 0.05, 0.1);
            gridRef.current.rotation.z = THREE.MathUtils.lerp(gridRef.current.rotation.z, -mouse.x * 0.05, 0.1);
        }
    });

    return (
        <group>
            <Grid
                ref={gridRef}
                renderOrder={-1}
                position={[0, -2, 0]}
                infiniteGrid
                cellSize={0.6}
                sectionSize={3}
                fadeDistance={30}
                sectionColor={"#ff0055"}
                cellColor={"#00f3ff"}
                sectionThickness={1.5}
                cellThickness={1}
            />
            <Grid
                renderOrder={-1}
                position={[0, 5, 0]}
                infiniteGrid
                cellSize={0.6}
                sectionSize={3}
                fadeDistance={40}
                sectionColor={"#bc13fe"}
                cellColor={"#0066ff"}
                sectionThickness={1}
                cellThickness={0.5}
                rotation={[Math.PI, 0, 0]}
                opacity={0.5}
            />
        </group>
    );
}

function FloatingObj() {
    const group = useRef<any>();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        group.current.rotation.y = t * 0.2;
    })

    // Random geometric shapes to float in the background
    const shapes = useMemo(() => {
        return new Array(15).fill(0).map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ],
            scale: Math.random() * 0.5 + 0.2,
            type: Math.random() > 0.5 ? 'box' : 'oct'
        }))
    }, [])

    return (
        <group ref={group}>
            {shapes.map((s, i) => (
                <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
                    <mesh position={s.position as any} scale={s.scale}>
                        {s.type === 'box' ? <boxGeometry /> : <octahedronGeometry />}
                        <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.1} />
                    </mesh>
                </Float>
            ))}
        </group>
    )
}

function WarpStars() {
    const ref = useRef<any>();
    const { mouse } = useThree();

    useFrame((state, delta) => {
        // Rotate stars based on mouse interaction for "warp" feel
        ref.current.rotation.y -= delta * 0.05 + (mouse.x * 0.01);
        ref.current.rotation.x -= delta * 0.02 + (mouse.y * 0.01);
        ref.current.position.z = (state.clock.elapsedTime * 0.5) % 10;
    });

    return (
        <group ref={ref}>
            <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    )
}

function CameraRig() {
    useFrame((state, delta) => {
        // Smooth camera movement
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, -state.pointer.x * 2, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -state.pointer.y * 1, 0.05);
        state.camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function TechBackground() {
    return (
        <div className="fixed inset-0 z-[-1] bg-[#020202]">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: false }}>
                <fog attach="fog" args={['#020202', 5, 40]} />
                <ambientLight intensity={1} />

                <WarpStars />
                <AnimatedGrid />
                <FloatingObj />

                <CameraRig />

                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
                </EffectComposer>
            </Canvas>

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
        </div>
    );
}
