"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Torus, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function QuantumNode({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<any>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.002;
    }
  });

  return (
    <Sphere args={[0.08, 16, 16]} position={position} ref={meshRef}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        roughness={0.1}
      />
    </Sphere>
  );
}

function SingularityCore() {
  const groupRef = useRef<any>(null);
  const ring1Ref = useRef<any>(null);
  const ring2Ref = useRef<any>(null);
  const ring3Ref = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.3;
      ring1Ref.current.rotation.y = t * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.25;
      ring2Ref.current.rotation.z = t * 0.35;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.2;
      ring3Ref.current.rotation.z = -t * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Quantum Distorted Core */}
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1.2}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#00f3ff"
            distort={0.45}
            speed={2.5}
            roughness={0.1}
            metalness={0.9}
            wireframe
            transparent
            opacity={0.45}
          />
        </Sphere>
        <Sphere args={[0.7, 32, 32]}>
          <meshBasicMaterial color="#ff0055" wireframe transparent opacity={0.3} />
        </Sphere>
      </Float>

      {/* Orbiting Quantum Rings */}
      <group ref={ring1Ref}>
        <Torus args={[2.2, 0.02, 16, 100]}>
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={1.5} />
        </Torus>
      </group>

      <group ref={ring2Ref}>
        <Torus args={[2.8, 0.015, 16, 100]}>
          <meshStandardMaterial color="#bc13fe" emissive="#bc13fe" emissiveIntensity={1.8} />
        </Torus>
      </group>

      <group ref={ring3Ref}>
        <Torus args={[3.4, 0.01, 16, 100]}>
          <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={2} />
        </Torus>
      </group>

      {/* Orbiting Quantum Nodes */}
      <QuantumNode position={[1.8, 0.9, -0.5]} color="#00f3ff" />
      <QuantumNode position={[-1.7, -1.2, 0.8]} color="#ff0055" />
      <QuantumNode position={[0.5, 2.1, 1.2]} color="#00ff66" />
      <QuantumNode position={[-2.2, 0.5, -1.5]} color="#bc13fe" />
    </group>
  );
}

export default function Enigma2QuantumCore() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-72 h-72 rounded-full border-2 border-neon-cyan/20 animate-spin" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-75">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 15, 10]} intensity={2} color="#00f3ff" />
        <pointLight position={[-10, -15, -10]} intensity={2} color="#ff0055" />
        <SingularityCore />
      </Canvas>
    </div>
  );
}
