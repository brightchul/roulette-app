import { useAtomValue, useSetAtom } from "jotai";
import RouletteElement from "../RouletteElement";
import {
  root,
  rouletteElementListContainer,
  rouletteElementsInputContainer,
} from "./index.css";
import { elementsAtom } from "../../models/store/atoms";
import { KeyboardEventHandler } from "react";
import { addElementAtom } from "../../models/store/actions";

export default function RouletteElementsLists() {
  const elements = useAtomValue(elementsAtom);
  const total = elements.reduce((total, value) => total + value.amount, 0);

  return (
    <div className={root}>
      <div>
        <RouletteElementsInput />
      </div>
      <div>
        <ul className={rouletteElementListContainer}>
          {elements.map((element, idx) => {
            return (
              <RouletteElement
                key={`${element.title}-${idx}`}
                idx={idx}
                {...element}
                ratio={element.amount / total}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function RouletteElementsInput() {
  const addElement = useSetAtom(addElementAtom);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value.trim();
    if (e.key !== "Enter" || !value) return;

    addElement(value);
    e.currentTarget.value = "";
  };

  return (
    <div className={rouletteElementsInputContainer}>
      <input type="text" onKeyDown={handleKeyDown} />
    </div>
  );
}
