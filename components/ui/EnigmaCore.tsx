"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function CoreMesh() {
    const meshRef = useRef<any>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Icosahedron args={[1, 0]} ref={meshRef}>
                <MeshDistortMaterial
                    color="#00f3ff"
                    wireframe
                    transparent
                    opacity={0.3}
                    distort={0.4}
                    speed={2}
                    roughness={0}
                />
            </Icosahedron>
            <Icosahedron args={[0.8, 0]}>
                <meshBasicMaterial color="#ff0055" wireframe transparent opacity={0.1} />
            </Icosahedron>
        </Float>
    );
}

export default function EnigmaCore() {
    return (
        <div className="w-full h-full absolute inset-0 z-0 pointer-events-none opacity-50">
            <Canvas>
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} />
                <CoreMesh />
            </Canvas>
        </div>
    );
}
