import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

import { elementsAtom, elementsData } from "../../models/store/atoms";
import {
  decelerateSpeed,
  degreeToRadian,
  getRandomTime,
  mathCos,
  mathSin,
  min,
  sum,
} from "../../utils";

const ANGLE_OFFSET = -90;
const RAF_NONE = -1;
const MAX_DEGREE = 360;
const MIN_VERLOCITY = 0.002;
const MAX_RUNNING_VERLOCITY = 10;

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
  const stopFlagRef = useRef<boolean>(false);
  const elements = useAtomValue(elementsAtom);
  const startTImeRef = useRef<number>(0);
  const isStopCheckFlag = useRef<boolean>(true);

  useEffect(() => {
    canvasRef.current = document.querySelector("#canvas");
  }, []);

  function getCtx() {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  useEffect(() => {
    const ctx = getCtx();
    if (!ctx) return;
    drawRoulette(elements, angleRef.current, ctx);
  }, [canvasRef, elements]);

  let verlocity = MAX_RUNNING_VERLOCITY;

  const runAnimation = (timestamp = 0) => {
    const ctx = getCtx()!;

    // stop logic
    if (stopFlagRef.current) {
      const elapsedTime = timestamp - startTImeRef.current;
      verlocity = decelerateSpeed(
        MAX_RUNNING_VERLOCITY,
        elapsedTime,
        getRandomTime(1900, 100)
      );
    }

    // stop logic
    if (verlocity <= MIN_VERLOCITY) {
      return stopAnimation();
    }

    const nextAngel = angleRef.current + verlocity;
    angleRef.current =
      nextAngel > MAX_DEGREE ? nextAngel - MAX_DEGREE : nextAngel;

    drawRoulette(elements, angleRef.current, ctx);
    rafRef.current = requestAnimationFrame(runAnimation);
  };

  const runRoulette = () => {
    if (!isStopCheckFlag.current) return;
    isStopCheckFlag.current = false;
    stopFlagRef.current = false;
    verlocity = 10;
    runAnimation();
  };

  const stopRoulette = () => {
    if (!(isStopCheckFlag.current === false && stopFlagRef.current === false))
      return;
    startTImeRef.current = Number(document.timeline.currentTime);
    stopFlagRef.current = true;
  };

  const stopAnimation = () => {
    cancelAnimationFrame(rafRef.current);
    isStopCheckFlag.current = true;
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

  const radius = min(centerX, centerY);

  ctx.fillStyle = "#000";

  let startAngle = angle + ANGLE_OFFSET;

  elements.forEach(({ amount, title }) => {
    const ratio = amount / total;
    const endAngle = startAngle + 360 * ratio;

    const startRad = degreeToRadian(startAngle);
    const endRad = degreeToRadian(endAngle);
    const halfRadian = degreeToRadian((startAngle + endAngle) / 2);
    const [halfX, halfY] = getPos(centerX, centerY, radius / 2, halfRadian);

    drawArc(centerX, centerY, radius, startRad, endRad, ctx);
    writeText(title, halfX, halfY, halfRadian, ctx);

    startAngle = endAngle;
  });
}
