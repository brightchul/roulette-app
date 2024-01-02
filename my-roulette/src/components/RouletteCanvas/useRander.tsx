import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

import { elementsAtom, elementsData } from "../../models/store/atoms";
import { decelerateSpeed, sum } from "../../utils";

const ANGLE_OFFSET = -90;
const RAF_NONE = -1;

export function degToRad(degree: number) {
  return (degree * Math.PI) / 180;
}

const mathSin = Math.sin;
const mathCos = Math.cos;

function getPos(
  x: number,
  y: number,
  distance: number,
  radian: number
): [number, number] {
  const disY = mathSin(radian) * distance;
  const disX = mathCos(radian) * distance;
  return [x + disX, y + disY];
}

function drawArc(
  x: number,
  y: number,
  radius: number,
  startRad: number,
  endRad: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.lineTo(x, y);
  ctx.arc(x, y, radius, startRad, endRad);

  ctx.closePath();
  // ctx.fill();
  ctx.stroke();
}

function writeText(
  text: string,
  x: number,
  y: number,
  radian: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(radian);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export default function useRender(angle: number) {
  const angleRef = useRef<number>(angle);
  const rafRef = useRef<number>(RAF_NONE);
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const elements = useAtomValue(elementsAtom);

  useEffect(() => {
    canvasRef.current = document.querySelector("#canvas");
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    drawRoulette(elements, angle, ctx);
  }, [canvasRef, elements, angle]);

  let verlocity = 10;

  const runAnimation = (timestamp = 0) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d")!;
    verlocity = decelerateSpeed(10, timestamp, 2000);

    if (verlocity <= 0.001) {
      return stopAnimation();
    }
    const nextAngel = angleRef.current + verlocity;
    angleRef.current = nextAngel > 360 ? nextAngel - 360 : nextAngel;

    drawRoulette(elements, angleRef.current, ctx);
    rafRef.current = requestAnimationFrame(runAnimation);
  };

  const runRoulette = () => {
    verlocity = 10;
    runAnimation();
  };

  const stopRoulette = () => {
    runAnimation();
  };

  const stopAnimation = () => {
    cancelAnimationFrame(rafRef.current);
  };

  return {
    runRoulette,
    stopRoulette,
    runAnimation,
    stopAnimation,
  };
}

function drawRoulette(
  elements: elementsData[],
  angle: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  const total = sum(...elements.map(({ amount }) => amount));

  const radius = Math.min(centerX, centerY);

  ctx.fillStyle = "#000";

  let startAngle = angle + ANGLE_OFFSET;

  elements.forEach(({ amount, title }) => {
    const ratio = amount / total;
    const endAngle = startAngle + 360 * ratio;

    const startRad = degToRad(startAngle);
    const endRad = degToRad(endAngle);
    const halfRadian = degToRad((startAngle + endAngle) / 2);
    const [halfX, halfY] = getPos(centerX, centerY, radius / 2, halfRadian);

    drawArc(centerX, centerY, radius, startRad, endRad, ctx);
    writeText(title, halfX, halfY, halfRadian, ctx);

    startAngle = endAngle;
  });
}
