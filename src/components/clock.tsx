import { onMount, type Component, createEffect } from "solid-js";
import "../App.css";
import { game } from "./game";
import { opacity, palette } from "./palette";

interface ClockProps {
  height: number;
  width: number;
}

const Clock: Component<ClockProps> = (props) => {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) {
      return;
    }

    const canvas = canvasRef;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius *= 0.9;

    createEffect(() => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = palette.face;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.clip();

      // dark overlay, the main part of the clock face background
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#000000" + opacity(50);
      ctx.fill();

      // faded cutout
      // we make this minus and that makes the bright purple circle appear on top left instead of bottom right
      const offset = radius * 0.35;

      const grd = ctx.createRadialGradient(
        -offset,
        -offset,
        0,
        -offset,
        -offset,
        radius * 1.2
      );
      grd.addColorStop(0, "#1a1020");
      grd.addColorStop(1, "#1a1020" + opacity(0));

      ctx.beginPath();
      ctx.arc(-offset, -offset, radius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.restore();

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = palette.faint;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.04, 0, 2 * Math.PI);
      ctx.fillStyle = palette.highlight;
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 0.32;
      ctx.arc(0, 0, radius / 10, 0, 2 * Math.PI);
      ctx.fillStyle = palette.dim;
      ctx.stroke();

      ctx.fillStyle = palette.dim;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const r1 = radius * 0.88;
        const r2 = i % 3 === 0 ? radius * 0.8 : radius * 0.84;

        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.strokeStyle =
          i % 3 === 0 ? "rgba(200,150,42,0.5)" : "rgba(200,150,42,0.2)";
        ctx.lineWidth = i % 3 === 0 ? 1 : 0.5;
        ctx.stroke();
      }

      const drawHand = (
        pos: number,
        length: number,
        width: number,
        color: string
      ) => {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
      };

      let hour = (game.time / 720) % 60;
      let minute = (game.time / 60) % 60;
      let second = game.time % 60;

      hour = (hour * Math.PI) / 30;
      minute = (minute * Math.PI) / 30;
      second = (second * Math.PI) / 30;

      drawHand(hour, radius * 0.45, radius * 0.009 * 2, palette.highlight);
      drawHand(minute, radius * 0.75, radius * 0.005 * 2, palette.text);
      drawHand(second, radius * 0.9, radius * 0.002 * 2, palette.dim);
    });
  });

  return (
    <>
      <div class="clock__time">{game.format(game.time)}</div>
      <div class="clock__tps">{game.format(game.tps)}</div>
      <canvas
        class="clock"
        ref={canvasRef}
        height={props.height}
        width={props.width}
      />
    </>
  );
};

export default Clock;
