import { style } from "@vanilla-extract/css";

export const rouletteElementContainer = style({
  display: "flex",
  gap: 10,
  alignItems: "center",
  padding: 10,
  boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
  ":hover": {
    boxShadow: "rgba(0, 0, 0, 0.5) 1.95px 1.95px 2.6px",
  },
});

export const removeButton = style({
  background: "#eee",
  padding: 5,
  ":hover": {},
});

export const amountContainer = style({
  display: "flex",
  alignItems: "center",
  gap: 10,
});

export const amountButton = style({
  minWidth: 20,
  textAlign: "center",
  outline: "1px solid black",
});
