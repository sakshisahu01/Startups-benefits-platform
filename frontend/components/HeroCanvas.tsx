'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Canvas = dynamic(() => import('@react-three/fiber').then((m) => m.Canvas), { ssr: false });
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 flex min-h-[320px] items-center justify-center overflow-hidden opacity-40">
      <Suspense
        fallback={
          <div className="h-48 w-48 animate-pulse rounded-full bg-brand-200/50" />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          className="h-full w-full"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 4, 4]} intensity={1} />
          <pointLight position={[-4, -2, 2]} intensity={0.5} color="#7dd3fc" />
          <HeroScene />
        </Canvas>
      </Suspense>
    </div>
  );
}
