import "./App.css";
import { SudokuContextProvider } from "./providers/SudokuProvider";
import { SudokuGame } from "./components/SudokuGame";

const App = () => (
  <SudokuContextProvider>
    <SudokuGame />
  </SudokuContextProvider>
);

export default App;
