import { onMount } from "solid-js";
/*
#ffcc88  — orange-red   (cool, M-class)
#ffd9a0  — warm orange  (K-class)
#fff4e0  — yellow-white (sun-like, G-class)
#ffffff  — pure white   (A-class)
#e8f0ff  — blue-white   (hot, B-class)
*/

const colors = [
  [255, 204, 136], // orange-red (cool, M-class)
  [255, 217, 160], // warm-orange (K-class)
  [255, 244, 224], // yellow-white (sun-like, G-class)
  [255, 255, 255], // pure-white (A-class)
  [232, 240, 255], // blue-white (hot, B-class)
];

let canvas!: HTMLCanvasElement;

function buildStars() {
  const ctx = canvas.getContext("2d");
  if (ctx === null) {
    return;
  }

  for (let i = 1; i < 500; i++) {
    const color: number = Math.ceil(Math.random() * colors.length) - 1;
    const [r, g, b] = colors[color];

    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 1.5 + 0.3;
    const opacity = Math.random();

    if (size > 1.0) {
      const grd = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
      grd.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.3})`);
      grd.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.beginPath();
      ctx.arc(x, y, size * 4, 0, 2 * Math.PI);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.random()})`;
    ctx.fill();
  }
}

export function Starfield() {
  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "#06040a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    buildStars();
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
