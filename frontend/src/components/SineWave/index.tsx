import { useEffect, useRef } from "react";

const HEIGHT = 200;

const SineWave = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let phase = 0;
    let rafId = 0;
    let running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      canvas.width = width * dpr;
      canvas.height = HEIGHT * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Two layered waves: a bright foreground and a fainter, slower one for depth.
    const drawWave = (amplitude: number, frequency: number, color: string, lineWidth: number, shift: number) => {
      ctx.beginPath();
      const yOffset = HEIGHT / 2;
      for (let x = -60; x <= width; x++) {
        const y = yOffset + amplitude * Math.sin(x * frequency + phase + shift);
        if (x === -60) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, HEIGHT);
      drawWave(10, 0.018, "rgba(10, 156, 255, 0.28)", 3, 1.6);
      drawWave(20, 0.02, "#0a9cff", 4, 0);
    };

    const loop = () => {
      phase -= 0.01;
      render();
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    // Only animate while the canvas is on-screen and the tab is visible.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: "100%", height: `${HEIGHT}px`, display: "block" }}
    />
  );
};

export default SineWave;
