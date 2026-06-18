/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  alphaSpeed: number;
}

export default function FloatingAccentLayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !isEnabled) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    canvas.width = width;
    canvas.height = height;

    // Create a pool of premium particles matching our clay rose + gold + sand colors
    const particleColors = [
      "rgba(207, 112, 81, 0.35)",  // Clay Rose
      "rgba(202, 169, 114, 0.3)",  // Muted Gold
      "rgba(147, 197, 253, 0.25)", // Luminous Indigo/Blue
      "rgba(167, 139, 250, 0.3)"   // Glowing Sage/Mint
    ];

    const particles: Particle[] = [];
    const maxParticles = Math.min(35, Math.floor((width * height) / 28000));

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(width, height, particleColors));
    }

    function createParticle(w: number, h: number, colors: string[], isNew = false): Particle {
      return {
        x: Math.random() * w,
        y: isNew ? h + 15 : Math.random() * h,
        size: Math.random() * 12 + 5, // Beautiful, prominent bubble sizes
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: -(Math.random() * 0.22 + 0.08), // upwards drift
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.65 + 0.15,
        alphaSpeed: (Math.random() - 0.5) * 0.004
      };
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        width = w;
        height = h;
        canvas.width = w;
        canvas.height = h;
      }
    });

    resizeObserver.observe(container);

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle decorative ambient radial background glow grid/orbs
      // Orbs stay centered but drift extremely slow
      const time = Date.now() * 0.0001;
      const glow1X = width * 0.35 + Math.sin(time) * 40;
      const glow1Y = height * 0.25 + Math.cos(time * 0.8) * 30;
      const glow2X = width * 0.75 + Math.cos(time * 0.5) * 50;
      const glow2Y = height * 0.7 + Math.sin(time * 0.9) * 40;

      // Draw soft primary glow orb (Clay Rose)
      const grad1 = ctx.createRadialGradient(glow1X, glow1Y, 0, glow1X, glow1Y, Math.min(width, height) * 0.45);
      grad1.addColorStop(0, "rgba(207, 112, 81, 0.045)");
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(glow1X, glow1Y, Math.min(width, height) * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Draw soft secondary glow orb (Muted Gold)
      const grad2 = ctx.createRadialGradient(glow2X, glow2Y, 0, glow2X, glow2Y, Math.min(width, height) * 0.4);
      grad2.addColorStop(0, "rgba(202, 169, 114, 0.03)");
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(glow2X, glow2Y, Math.min(width, height) * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.alphaSpeed;

        // Bounce alpha
        if (p.alpha <= 0.05 || p.alpha >= 0.85) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // if particle drifts off the top or sides, regenerate at the bottom
        if (p.y < -p.size - 5 || p.x < -p.size - 5 || p.x > width + p.size + 5) {
          particles[i] = createParticle(width, height, particleColors, true);
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        
        // Specular glow configuration matching bubble color
        ctx.shadowBlur = p.size * 2.2;
        ctx.shadowColor = p.color;

        // Custom multi-stop radial gradient for elegant glass bubble reflection
        const bubbleGrad = ctx.createRadialGradient(
          p.x - p.size * 0.25, 
          p.y - p.size * 0.25, 
          p.size * 0.05, 
          p.x, 
          p.y, 
          p.size
        );
        bubbleGrad.addColorStop(0, "rgba(255, 255, 255, 0.75)"); // Intense reflection dot
        bubbleGrad.addColorStop(0.2, p.color);
        bubbleGrad.addColorStop(0.85, "rgba(255, 255, 255, 0.04)");
        bubbleGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = bubbleGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Delicate, shiny high-contrast outer bubble rim
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.75;
        ctx.shadowBlur = 0; // Clear stroke contour
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [isEnabled]);

  // Read toggle setting from localStorage dynamic support
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("creatoros_animations_disabled");
      setIsEnabled(stored !== "true");
    };
    handleStorageChange();
    
    window.addEventListener("creatoros_settings_updated", handleStorageChange);
    return () => window.removeEventListener("creatoros_settings_updated", handleStorageChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
    >
      {isEnabled && <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />}
    </div>
  );
}
