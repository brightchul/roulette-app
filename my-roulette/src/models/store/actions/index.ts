import { atom } from "jotai";

import { elementsAtom, textAtom } from "../atoms";

export const uppercaseAtom = atom((get) => {
  return get(textAtom).toUpperCase();
});

export const addElementAtom = atom(null, (get, set, value: string) => {
  const origin = get(elementsAtom);
  set(elementsAtom, [...origin, { title: value, amount: 1 }]);
});

export const removeElementAtom = atom(null, (get, set, targetIdx: number) => {
  const origin = get(elementsAtom);
  set(
    elementsAtom,
    origin.filter((_, idx) => idx !== targetIdx)
  );
});
