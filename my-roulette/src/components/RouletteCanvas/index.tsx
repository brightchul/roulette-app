import { useEffect, useRef, useState } from "react";
import useRender, { degToRad } from "./useRander";
import { useToggle } from "../../hooks";

interface RouletteCanvasProps {
  width?: string;
  height?: string;
}

export default function RouletteCanvas({
  width = "500",
  height = "500",
}: RouletteCanvasProps) {
  const { runRoulette, stopRoulette } = useRender(0);
  const [flag, toggleFlag] = useToggle(false);

  useEffect(() => {
    flag ? runRoulette() : stopRoulette();
  }, [flag]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={toggleFlag} style={{ outline: "1px solid black" }}>
          spin {flag.toString()}
        </button>
      </div>
      <canvas
        id="canvas"
        style={{ outline: "1px solid black" }}
        width={width}
        height={height}
      />
    </div>
  );
}
