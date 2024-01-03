import { flexContainer } from "./App.css";
import RouletteCanvas from "./components/RouletteCanvas";
import RouletteElementsLists from "./components/RouletteElementsLists";

function App() {
  return (
    <>
      <div className={flexContainer}>
        <RouletteCanvas />
        <RouletteElementsLists />
      </div>
    </>
  );
}

export default App;
