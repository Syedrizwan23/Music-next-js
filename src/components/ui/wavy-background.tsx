"use client";
import { cn } from "@/utils/cn";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number | null>(null);
  const ntRef = useRef(0);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const updateCanvasSize = () => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
  };

  const drawWave = (n: number) => {
    if (!canvasRef.current || !contextRef.current) return;

    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    
    ntRef.current += getSpeed();

    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      
      for (let x = 0; x < canvas.width; x += 5) {
        const y = noise(x / 800, 0.3 * i, ntRef.current) * 100;
        if (x === 0) {
          ctx.moveTo(x, y + canvas.height * 0.5);
        } else {
          ctx.lineTo(x, y + canvas.height * 0.5);
        }
      }
      
      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = () => {
    if (!canvasRef.current || !contextRef.current) return;

    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    
    ctx.fillStyle = backgroundFill;
    ctx.globalAlpha = waveOpacity;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawWave(5);
    animationRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    contextRef.current = ctx;
    updateCanvasSize();

    window.addEventListener("resize", updateCanvasSize);
    render();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [blur, backgroundFill, waveColors, speed, waveOpacity, waveWidth]);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};