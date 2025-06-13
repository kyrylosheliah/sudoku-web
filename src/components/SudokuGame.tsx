import { For, Show } from "solid-js";
import { useSudokuContext } from "../providers/SudokuProvider";
import { SudokuBoard } from "./SudokuBoard";

export const SudokuGame = () => {

  const sudoku = useSudokuContext();

  const [showSolution, setShowSolution] = sudoku.info.showSolutionState;

  const toggleSolution = () => {
    setShowSolution(!showSolution());
  };

  const difficultyLevels = {
    test: 1,
    easy: 20,
    medium: 40,
    hard: 60,
    impossible: 70,
  };

  const setDifficulty = sudoku.info.difficultyState[1];
  const inputSelectedCell = sudoku.actions.inputSelectedCell;
  const gameComplete = sudoku.info.gameCompleteState[0];
  const selectedCell= sudoku.info.selectedCellState[0];
  const newGame = sudoku.actions.newGame;
  
  const handleNumberInput = (num: number) => {
    inputSelectedCell(num);
  };

  const clearCell = () => {
    inputSelectedCell(null);
  };

  return (
    <div class="gap-12 mt-8 flex flex-col">
      <div class="gap-4 flex-wrap flex flex-row justify-center items-center">
        <button class="p-0 p-x-1 p-t-1" onClick={toggleSolution}>
          {showSolution() ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-eye-icon lucide-eye"
            >
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-eye-closed-icon lucide-eye-closed"
            >
              <path d="m15 18-.722-3.25" />
              <path d="M2 8a10.645 10.645 0 0 0 20 0" />
              <path d="m20 15-1.726-2.05" />
              <path d="m4 15 1.726-2.05" />
              <path d="m9 18 .722-3.25" />
            </svg>
          )}
        </button>
        <h1 class="text-4xl font-bold text-align-center">Sudoku</h1>
        <For each={Object.entries(difficultyLevels)}>
          {([key, value]) => (
            <button
              onClick={() => {
                setDifficulty(value);
                newGame();
              }}
              children={key}
            />
          )}
        </For>
      </div>
      <div class="gap-12 flex-wrap flex flex-row flex-wrap justify-center items-center">
        <SudokuBoard />
        {/* Number Input Panel */}
        <div class="w-40 flex flex-col gap-4">
          <Show
            when={gameComplete()}
            children={
              <h3 class="text-xl font-bold text-align-center text-green-600">
                Solved
              </h3>
            }
            fallback={
              <h3 class="text-xl font-bold text-align-center">Select a Number</h3>
            }
          ></Show>
          <div class="grid grid-cols-3 gap-4 items-center justify-center">
            <For each={[1, 2, 3, 4, 5, 6, 7, 8, 9]}>
              {(num) => (
                <div class="flex justify-center items-center">
                  <button
                    onClick={() => handleNumberInput(num)}
                    disabled={!selectedCell() || gameComplete()}
                    class="w-12 h-12 font-bold"
                    children={num}
                  />
                </div>
              )}
            </For>
          </div>
          <button
            onClick={clearCell}
            disabled={!selectedCell() || gameComplete()}
            class="w-full font-bold"
          >
            Clear
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <h3>How to play:</h3>
        <ol class="m-0 p-0 p-l-4">
          <li>Click a cell to select it</li>
          <li>Click a number to fill the cell</li>
          <li>
            Each row, column, and 3x3 box must contain only unique digits (1-9)
          </li>
          <li>No duplicates allowed!</li>
        </ol>
      </div>
    </div>
  );
};
