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
      ctx.arc(0, 0, radius / 20, 0, 2 * Math.PI);
      ctx.fillStyle = palette.highlight;
      ctx.fill();

      ctx.fillStyle = palette.dim;
      ctx.font = radius * 0.15 + "px arial";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (let num = 1; num < 13; num++) {
        let ang = (num * Math.PI) / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
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

      drawHand(hour, radius * 0.45, radius * 0.09, palette.highlight);
      drawHand(minute, radius * 0.75, radius * 0.05, palette.text);
      drawHand(second, radius * 0.9, radius * 0.02, palette.dim);
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
