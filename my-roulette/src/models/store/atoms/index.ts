import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";

export const textAtom = atom("hello");

export interface elementsData {
  title: string;
  amount: number;
}

const initialElements: elementsData[] = [
  { title: "하나", amount: 10 },
  { title: "두우우우우", amount: 20 },
  { title: "셋!", amount: 100 },
  { title: "네네에에에에에엣!!!", amount: 5 },
  { title: "다섯!", amount: 30 },
];

export const elementsAtom = atomWithImmer<elementsData[]>(initialElements);
