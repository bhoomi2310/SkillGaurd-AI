import { useEffect, useRef } from 'react';

const FloatingLines = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const lines = [];
    const lineCount = 150;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize lines
    const initLines = () => {
      lines.length = 0; // Clear existing lines
      for (let i = 0; i < lineCount; i++) {
        lines.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8,
          length: Math.random() * 180 + 100,
          opacity: Math.random() * 0.2 + 0.4, // Lower opacity: 0.4-0.6
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    resizeCanvas();
    initLines();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line, i) => {
        // Update position
        line.x += line.vx;
        line.y += line.vy;
        line.angle += 0.01;

        // Bounce off edges
        if (line.x < 0 || line.x > canvas.width) line.vx *= -1;
        if (line.y < 0 || line.y > canvas.height) line.vy *= -1;

        // Draw line with high opacity gradient
        const gradient = ctx.createLinearGradient(
          line.x, line.y,
          line.x + line.length * Math.cos(line.angle),
          line.y + line.length * Math.sin(line.angle)
        );
        // Use bright colors with lower opacity
        const baseOpacity = Math.min(line.opacity, 0.6);
        gradient.addColorStop(0, `rgba(96, 165, 250, ${baseOpacity})`); // bright blue
        gradient.addColorStop(0.5, `rgba(147, 51, 234, ${baseOpacity * 0.95})`); // bright purple
        gradient.addColorStop(1, `rgba(168, 85, 247, ${baseOpacity * 0.9})`); // bright purple
        
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(
          line.x + line.length * Math.cos(line.angle),
          line.y + line.length * Math.sin(line.angle)
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3.5; // Thicker lines
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(96, 165, 250, ${baseOpacity * 0.3})`;
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // Connect nearby lines
        lines.slice(i + 1).forEach((otherLine) => {
          const dx = line.x - otherLine.x;
          const dy = line.y - otherLine.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 220) {
            const connectionGradient = ctx.createLinearGradient(line.x, line.y, otherLine.x, otherLine.y);
            const connectionOpacity = (1 - distance / 220) * 0.45; // Lower opacity connections
            connectionGradient.addColorStop(0, `rgba(96, 165, 250, ${connectionOpacity})`);
            connectionGradient.addColorStop(1, `rgba(168, 85, 247, ${connectionOpacity * 0.9})`);
            
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(otherLine.x, otherLine.y);
            ctx.strokeStyle = connectionGradient;
            ctx.lineWidth = 2.5; // Thicker connections
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgba(96, 165, 250, ${connectionOpacity * 0.2})`;
            ctx.stroke();
            ctx.shadowBlur = 0; // Reset shadow
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
      initLines();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        opacity: 1,
        zIndex: 1,
      }}
    />
  );
};

export default FloatingLines;
