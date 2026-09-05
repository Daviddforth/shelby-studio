"use client";

import { useEffect, useRef } from "react";

type Orb = {
  size: number;
  color: string;
  x: number;
  y: number;
  speed: number;
  drift: number;
};

const ORBS: Orb[] = [
  {
    size: 620,
    color: "rgba(37, 99, 235, 0.34)",
    x: 8,
    y: 18,
    speed: 0.00012,
    drift: 100,
  },
  {
    size: 580,
    color: "rgba(139, 92, 246, 0.32)",
    x: 88,
    y: 12,
    speed: 0.0001,
    drift: 120,
  },
  {
    size: 560,
    color: "rgba(6, 182, 212, 0.30)",
    x: 12,
    y: 82,
    speed: 0.00013,
    drift: 110,
  },
  {
    size: 600,
    color: "rgba(236, 72, 153, 0.28)",
    x: 90,
    y: 78,
    speed: 0.00011,
    drift: 125,
  },
  {
    size: 500,
    color: "rgba(168, 85, 247, 0.26)",
    x: 52,
    y: 42,
    speed: 0.00009,
    drift: 90,
  },
  {
    size: 460,
    color: "rgba(14, 165, 233, 0.24)",
    x: 48,
    y: 92,
    speed: 0.00014,
    drift: 105,
  },
  {
    size: 440,
    color: "rgba(34, 197, 94, 0.20)",
    x: 94,
    y: 48,
    speed: 0.0001,
    drift: 115,
  },
  {
    size: 420,
    color: "rgba(245, 158, 11, 0.20)",
    x: 46,
    y: 4,
    speed: 0.00013,
    drift: 95,
  },
];

export default function InteractiveWatermark() {
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pointer = useRef({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (mediaQuery.matches) {
      return;
    }

    pointer.current.x = window.innerWidth / 2;
    pointer.current.y = window.innerHeight / 2;

    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      pointer.current.active = true;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      pointer.current.x = touch.clientX;
      pointer.current.y = touch.clientY;
      pointer.current.active = true;
    };

    const handlePointerLeave = () => {
      pointer.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    window.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    window.addEventListener("pointerleave", handlePointerLeave);

    let animationFrame = 0;

    const animate = (time: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ORBS.forEach((config, index) => {
        const orb = orbRefs.current[index];

        if (!orb) {
          return;
        }

        /*
         * Slow organic movement.
         */
        const angle = time * config.speed + index * 1.8;

        let x =
          (config.x / 100) * width +
          Math.sin(angle) * config.drift;

        let y =
          (config.y / 100) * height +
          Math.cos(angle * 0.82) * config.drift * 0.72;

        /*
         * Mouse / touch interaction.
         *
         * The closer the pointer gets to an orb,
         * the stronger the movement becomes.
         */
        if (pointer.current.active) {
          const dx = pointer.current.x - x;
          const dy = pointer.current.y - y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          const interactionRadius = 700;

          if (distance < interactionRadius) {
            const strength =
              Math.pow(
                1 - distance / interactionRadius,
                2
              ) * 100;

            if (distance > 0) {
              x -= (dx / distance) * strength;
              y -= (dy / distance) * strength;
            }
          }
        }

        orb.style.transform =
          `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "touchmove",
        handleTouchMove
      );

      window.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[20] overflow-hidden"
    >
      {/* Large ambient rainbow background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at 50% 50%,
              rgba(99, 102, 241, 0.08),
              transparent 50%
            )
          `,
        }}
      />

      {/* Moving rainbow orbs */}
      {ORBS.map((orb, index) => (
        <div
          key={index}
          ref={(element) => {
            orbRefs.current[index] = element;
          }}
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,

            background: `
              radial-gradient(
                circle at center,
                ${orb.color} 0%,
                ${orb.color.replace(
                  /0\.\d+\)/,
                  "0.12)"
                )} 38%,
                transparent 72%
              )
            `,

            filter: "blur(50px)",

            willChange: "transform",

            transform:
              "translate3d(-1000px, -1000px, 0)",

            contain: "layout paint",
          }}
        />
      ))}

      {/* Rainbow atmospheric wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              120deg,
              rgba(37, 99, 235, 0.045),
              rgba(124, 58, 237, 0.04),
              rgba(236, 72, 153, 0.045),
              rgba(6, 182, 212, 0.04),
              rgba(34, 197, 94, 0.025),
              rgba(245, 158, 11, 0.025)
            )
          `,
        }}
      />

      {/* Soft center glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 68%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
