import { onMount } from "solid-js";

const colors = [
  [255, 204, 136],
  [255, 217, 160],
  [255, 244, 224],
  [255, 255, 255],
  [232, 240, 255],
];

let canvas!: HTMLCanvasElement;
let stars: Array<any> = [];

function build() {
  stars = [];
  for (let i = 0; i < 500; i++) {
    const color = Math.floor(Math.random() * colors.length);
    const [r, g, b] = colors[color];
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.5,
      color: [r, g, b],
      twinkleSpeed: Math.random() * 0.8 + 0.2,
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }
}

function draw() {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#06040a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    const { x, y, size } = star;
    const [r, g, b] = star.color;

    if (size > 1.0) {
      const t = performance.now() / 1000;
      const twinkle = Math.sin(t * star.twinkleSpeed + star.twinklePhase);
      const opacity = star.opacity + twinkle * 0.15;

      const grd = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
      grd.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`);
      grd.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.beginPath();
      ctx.arc(x, y, size * 4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${star.opacity})`;
    ctx.fill();
  });
}

export function Starfield() {
  onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    build();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      build();
    });

    function loop() {
      draw();
      requestAnimationFrame(loop);
    }

    loop();
  });

  return (
    <canvas
      ref={canvas!}
      style={{
        position: "fixed",
        inset: "0",
        "z-index": "0",
        "pointer-events": "none",
      }}
    />
  );
}
