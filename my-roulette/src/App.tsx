import { useAtom } from "jotai";
import { flexContainer } from "./App.css";
import RouletteCanvas from "./components/RouletteCanvas";
import RouletteElementsLists from "./components/RouletteElementsLists";
import { uppercaseAtom } from "./models/store/actions";
import { textAtom } from "./models/store/atoms";
import { ChangeEventHandler } from "react";

// Use them anywhere in your app
const Input = () => {
  const [text, setText] = useAtom(textAtom);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setText(e.target.value);
  return <input value={text} onChange={handleChange} />;
};

const Uppercase = () => {
  const [uppercase] = useAtom(uppercaseAtom);
  return <div>Uppercase: {uppercase}</div>;
};

function App() {
  return (
    <>
      <div>
        <div>test</div>
        <div>
          <Input />
          <Uppercase />
        </div>
      </div>
      <div className={flexContainer}>
        <RouletteCanvas />
        <RouletteElementsLists />
      </div>
    </>
  );
}

export default App;
