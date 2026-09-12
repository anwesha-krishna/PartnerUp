import React, { useEffect, useRef } from 'react';

/**
 * Animated Background Canvas Component
 * Renders floating constellation nodes and glowing connection vectors across a #050505 pitch-black backdrop.
 */
export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Color palette for nodes and connections: Electric Cyan, Neon Purple & Soft Indigo
    const colors = [
      { r: 6, g: 182, b: 212 },   // Electric Cyan (#06B6D4)
      { r: 168, g: 85, b: 247 },  // Neon Purple (#A855F7)
      { r: 99, g: 102, b: 241 }   // Vibrant Indigo (#6366F1)
    ];

    // Determine particle count based on viewport area
    const particleCount = Math.min(85, Math.max(35, Math.floor((width * height) / 18000)));
    const maxConnectionDistance = 140;

    // Initialize particles
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const colorScheme = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1.0,
        baseAlpha: Math.random() * 0.4 + 0.3,
        color: colorScheme,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // Mouse coordinate tracking for subtle interactive magnetism
    let mouse = { x: null, y: null, maxDist: 160 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let frame = 0;

    const render = () => {
      frame++;

      // Clear with deep pitch black #050505
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric background nebula glows
      const grad1 = ctx.createRadialGradient(width * 0.2, height * 0.2, 10, width * 0.2, height * 0.2, width * 0.5);
      grad1.addColorStop(0, 'rgba(6, 182, 212, 0.03)'); // Electric Cyan glow
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 10, width * 0.8, height * 0.7, width * 0.5);
      grad2.addColorStop(0, 'rgba(168, 85, 247, 0.035)'); // Neon Purple glow
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Update and draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move particles
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce on boundary
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Mouse gentle repulsion/magnetism
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist && dist > 0) {
            const force = (1 - dist / mouse.maxDist) * 0.4;
            p1.x -= (dx / dist) * force;
            p1.y -= (dy / dist) * force;
          }
        }

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            const alpha = (1 - dist / maxConnectionDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Gradient connection stroke
            ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.15;

        // Glow ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${Math.max(0, currentAlpha * 0.25)})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${Math.max(0, currentAlpha)})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
      style={{ background: '#050505' }}
    />
  );
}
