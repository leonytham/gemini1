import React, { useRef, useEffect, useCallback } from 'react';
import { Particle } from '../types';

interface SparkleCanvasProps {
  primaryColor: string;
  secondaryColor: string;
  isInteracting: boolean;
}

const SparkleCanvas: React.FC<SparkleCanvasProps> = ({ primaryColor, secondaryColor, isInteracting }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const requestRef = useRef<number>();
  
  // Convert hex to rgb for alpha manipulation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const createParticle = (x: number, y: number, type: 'heart' | 'sparkle' = 'heart'): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    const size = Math.random() * 15 + 5;
    
    // Mix colors
    const isPrimary = Math.random() > 0.5;
    const baseColor = isPrimary ? primaryColor : secondaryColor;

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1, // Slight upward drift
      size,
      life: 0,
      maxLife: Math.random() * 60 + 40,
      color: baseColor,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      type
    };
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2, 0, size);
    ctx.bezierCurveTo(0, (size + topCurveHeight) / 2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;

    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, size);
        ctx.rotate(Math.PI / 2);
        ctx.lineTo(size * 0.2, size * 0.2);
        ctx.rotate(Math.PI / 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Auto-spawn particles if mouse is moving or just for ambience
    if (Math.random() > 0.8) {
        // Ambient background particles
        particlesRef.current.push(
            createParticle(Math.random() * canvas.width, Math.random() * canvas.height, 'sparkle')
        );
    }

    if (isInteracting) {
        // Spawn more when interacting
        for (let i = 0; i < 3; i++) {
            particlesRef.current.push(createParticle(mouseRef.current.x, mouseRef.current.y, 'heart'));
        }
    }

    // Update and Draw
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.vy += 0.02; // Gravity
      p.vx *= 0.99; // Friction

      const progress = p.life / p.maxLife;
      const alpha = 1 - progress;

      if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, alpha, p.rotation);
      } else {
          drawSparkle(ctx, p.x, p.y, p.size * 0.6, p.color, alpha, p.rotation);
      }

      if (p.life >= p.maxLife) {
        particlesRef.current.splice(i, 1);
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [primaryColor, secondaryColor, isInteracting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
        // Spawn particles on move
        for(let i=0; i<2; i++) {
            particlesRef.current.push(createParticle(e.clientX, e.clientY, 'heart'));
        }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        if(e.touches.length > 0) {
            mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
             for(let i=0; i<2; i++) {
                particlesRef.current.push(createParticle(e.touches[0].clientX, e.touches[0].clientY, 'heart'));
            }
        }
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    handleResize();
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default SparkleCanvas;