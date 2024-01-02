import { style } from "@vanilla-extract/css";

export const root = style({
  padding: 10,
});

export const rouletteElementListContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const rouletteElementsInputContainer = style({
  border: "1px solid black",
  padding: 10,
});
