import { useEffect, useRef } from "react";

const SineWave = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let phase = 0; // Tracks wave movement

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 200; // Adjust height as needed
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawWave = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      const amplitude = 20; // Wave height
      const frequency = 0.02; // Wave frequency
      const speed = -1; // Wave speed
      const yOffset = canvas.height / 2;

      ctx.moveTo(0, yOffset);
      const waveOffset = 50; // Shifts the start position to the left

      for (let x = -waveOffset; x < canvas.width; x++) {
        const y = yOffset + amplitude * Math.sin(x * frequency + phase);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "#0095ff";
      ctx.lineWidth = 5;
      ctx.stroke();

      phase += speed * 0.01; // Moves the wave

      requestAnimationFrame(drawWave);
    };

    drawWave();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />;
};

export default SineWave;
