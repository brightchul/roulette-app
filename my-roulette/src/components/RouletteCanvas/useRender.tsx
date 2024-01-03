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
const MAX_DEGREE = 360;
const MIN_VERLOCITY = 0.002;
const MAX_RUNNING_VERLOCITY = 10;
const BASE_TIME = 1900;
const INTERVAL_TIME = 100;
const SELECT_ANGLE = MAX_DEGREE + ANGLE_OFFSET;

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
  ctx.font = "15px Arial";
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function getCanvasCtx() {
  const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
  return canvas?.getContext("2d") ?? null;
}

export default function useRender(angle: number) {
  const angleRef = useRef<number>(angle);
  let raf = -1;
  const elementsData = useAtomValue(elementsAtom);

  const startTimeRef = useRef<number>(0);
  const stopFlagRef = useRef<boolean>(false);
  const isStopCheckFlag = useRef<boolean>(true);

  useEffect(() => {
    const ctx = getCanvasCtx();
    ctx && drawRoulette(elementsData, angleRef.current, ctx);
  }, [elementsData]);

  let verlocity = MAX_RUNNING_VERLOCITY;

  const runAnimation = (timestamp = 0) => {
    const ctx = getCanvasCtx()!;

    // stop logic
    if (stopFlagRef.current) {
      const elapsedTime = timestamp - startTimeRef.current;
      verlocity = decelerateSpeed(
        MAX_RUNNING_VERLOCITY,
        elapsedTime,
        getRandomTime(BASE_TIME, INTERVAL_TIME)
      );
    }

    // stop logic
    if (verlocity <= MIN_VERLOCITY) {
      return stopAnimation();
    }

    const nextAngel = angleRef.current + verlocity;
    angleRef.current =
      nextAngel > MAX_DEGREE ? nextAngel - MAX_DEGREE : nextAngel;

    drawRoulette(elementsData, angleRef.current, ctx);
    raf = requestAnimationFrame(runAnimation);
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
    startTimeRef.current = Number(document.timeline.currentTime);
    stopFlagRef.current = true;
  };

  const stopAnimation = () => {
    cancelAnimationFrame(raf);
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
  elementsData: elementsData[],
  angle: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const centerX = ctx.canvas.width / 2;
  const centerY = ctx.canvas.height / 2;

  const total = sum(...elementsData.map(({ amount }) => amount));

  const radius = min(centerX, centerY) - 30;

  ctx.fillStyle = "#000";

  let startAngle = angle + ANGLE_OFFSET;
  let selectedTitle = "";

  elementsData.forEach(({ amount, title }) => {
    const ratio = amount / total;
    const endAngle = startAngle + MAX_DEGREE * ratio;

    const startRad = degreeToRadian(startAngle);
    const endRad = degreeToRadian(endAngle);
    const halfRadian = degreeToRadian((startAngle + endAngle) / 2);
    const [halfX, halfY] = getPos(centerX, centerY, radius / 2, halfRadian);

    drawArc(centerX, centerY, radius, startRad, endRad, ctx);
    writeText(title, halfX, halfY, halfRadian, ctx);

    if (startAngle <= SELECT_ANGLE && SELECT_ANGLE <= endAngle) {
      selectedTitle = title;
    }

    startAngle = endAngle;
  });

  drawSelectTriangle(10, 20, ctx);
  writeText(selectedTitle, centerX, 10, 0, ctx);
}

function drawSelectTriangle(
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D
) {
  const centerWidth = ctx.canvas.width / 2;
  const startY = 20;

  ctx.beginPath();
  ctx.moveTo(centerWidth - width / 2, startY);
  ctx.lineTo(centerWidth + width / 2, startY);
  ctx.lineTo(centerWidth, startY + height);
  ctx.closePath();
  ctx.stroke();
}
