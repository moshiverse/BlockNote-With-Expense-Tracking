import React, { useEffect, useRef } from "react";

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 200 }).map(() => {
      const radius = Math.random() * 2;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseRadius: radius,
        radius,
        color: ["#ffffff", "#a0c4ff", "#ffb3c6", "#c77dff", "#f8f9fa"][
          Math.floor(Math.random() * 5)
        ],
        speed: Math.random() * 0.3 + 0.2,
      };
    });

    const nebulae = Array.from({ length: 4 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 400 + 200,
      color: [
        "rgba(142,45,226,0.25)",
        "rgba(255,0,150,0.2)",
        "rgba(0,200,255,0.15)",
        "rgba(255,150,50,0.1)",
      ][Math.floor(Math.random() * 4)],
    }));

    function draw() {
      ctx.fillStyle = "rgba(10, 10, 30, 0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nebulae.forEach((n) => {
        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        gradient.addColorStop(0, n.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
      });

      stars.forEach((star) => {
        ctx.beginPath();
        star.radius =
          star.baseRadius + Math.sin(Date.now() * 0.002 + star.x) * 0.5;
        ctx.arc(star.x, star.y, Math.max(0.5, star.radius), 0, 2 * Math.PI);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(draw);
    }

    draw();

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    />
  );
}

export default ParticleBackground;