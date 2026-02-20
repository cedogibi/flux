import "./App.css";
import Clock from "./components/clock";
import Shop from "./components/shop";
import { Starfield } from "./components/starfield";

function App() {
  return (
    <>
      <Starfield />
      <Clock height={300} width={300} />
      <Shop />
    </>
  );
}

export default App;
