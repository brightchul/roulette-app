import { useSetAtom } from "jotai";

import { elementsAtom } from "../../models/store/atoms";
import {
  amountContainer,
  removeButton,
  rouletteElementContainer,
} from "./RouletteElement.css";

interface RouletteElementProps {
  idx: number;
  title: string;
  amount: number;
  ratio: number;
}

export default function RouletteElement({
  idx,
  title,
  amount,
  ratio,
}: RouletteElementProps) {
  const setElements = useSetAtom(elementsAtom);

  const remove = () =>
    setElements((draft) => {
      draft.splice(idx, 1);
    });

  const amountUp = () =>
    setElements((draft) => {
      draft[idx].amount += 1;
    });

  const amountDown = () =>
    setElements((draft) => {
      draft[idx].amount = Math.max(1, draft[idx].amount - 1);
    });

  return (
    <li className={rouletteElementContainer}>
      <div className={removeButton}>
        <button onClick={remove}>{idx + 1}</button>
      </div>
      <div>
        <input type="text" defaultValue={title} />
      </div>
      <div className={amountContainer}>
        <div>x{amount}</div>
        <div>
          <button onClick={amountUp}>+</button>
          <button onClick={amountDown}>-</button>
        </div>
      </div>
      <div>{(ratio * 100).toFixed(2)}%</div>
    </li>
  );
}
