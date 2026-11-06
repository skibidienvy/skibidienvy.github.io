'use client';

import { useEffect, useRef } from 'react';
import { MountainPicture, VhsShader } from './mountain';
import { DesktopWindows } from './windows';
import { Marquee } from './marquee';
import { SystemBar } from './system-bar';

const meowLoop = 'meow '.repeat(128);

export default function Home() {
  const sceneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const layers = Array.from(
      scene.querySelectorAll<HTMLElement>('[data-depth]'),
    );
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const updateTarget = (event: PointerEvent) => {
      target.x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      target.y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };

    const resetTarget = () => {
      target.x = 0;
      target.y = 0;
    };

    const draw = () => {
      const ease = reducedMotion.matches ? 0.025 : 0.065;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      const motionScale = reducedMotion.matches ? 0.3 : 1;

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0);
        const x = current.x * depth * -22 * motionScale;
        const y = current.y * depth * -10 * motionScale;
        const scale = 1.045 + depth * 0.012;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      });

      frame = window.requestAnimationFrame(draw);
    };

    window.addEventListener('pointermove', updateTarget, { passive: true });
    document.documentElement.addEventListener('mouseleave', resetTarget);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', updateTarget);
      document.documentElement.removeEventListener('mouseleave', resetTarget);
    };
  }, []);

  return (
    <main ref={sceneRef} className="mountain-scene">
      <SystemBar />
      <MountainPicture />
      <div className="mountain-distortion-window" aria-hidden="true">
        <MountainPicture glitch />
      </div>
      <VhsShader />
      <DesktopWindows />
      <Marquee text={meowLoop} label="meow meow meow" />
    </main>
  );
}
