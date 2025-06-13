import { For } from "solid-js";
import { useSudokuContext } from "../providers/SudokuProvider";

export const SudokuBoard = () => {

  const sudoku = useSudokuContext();

  const currentBoard = sudoku.info.currentBoardState[0];
  const initialBoard = sudoku.info.initialBoardState[0];
  const solutionBoard = sudoku.info.solutionBoardState[0];
  const gameComplete = sudoku.info.gameCompleteState[0];
  const [selectedCell, setSelectedCell] = sudoku.info.selectedCellState;
  const showSolution = sudoku.info.showSolutionState[0];

  const handleCellClick = (row: number, col: number) => {
    if (gameComplete()) return;
    if (initialBoard()[row][col] != null) {
      setSelectedCell(null);
      return;
    };
    const selected = selectedCell();
    setSelectedCell(
      selected === null
        ? [row, col]
        : selected[0] === row && selected[1] === col
        ? null
        : [row, col]
    );
  };

  const getCellClass = (row: number, col: number, cell: number | null) => {
    const value = showSolution() ? solutionBoard()[row][col] : cell;
    const isSelected =
      selectedCell() && selectedCell()![0] === row && selectedCell()![1] === col;
    const isInitial = initialBoard()[row][col] !== null;
    const isCorrect = value !== null && value === solutionBoard()[row][col];
    const isIncorrect = value !== null && value !== solutionBoard()[row][col];
    const showingSolution = showSolution();

    let baseClass =
      "w-10 h-10 border-1 border-gray-200 border-solid flex items-center justify-center text-lg font-bold cursor-pointer ";

    // thicker borders for 3x3 boxes
    if (col !== 0 && col % 3 === 0) baseClass += "border-l-8 ";
    if (row !== 0 && row % 3 === 0) baseClass += "border-t-8 ";

    if (isInitial) {
      baseClass += "bg-gray-200 text-gray-500 ";
    } else if (showingSolution) {
      baseClass += "bg-green-100 text-green-700 ";
    } else if (isSelected) {
      baseClass += "bg-blue-400 text-white ";
    } else if (isCorrect) {
      baseClass += "hover:bg-blue-50 ";
    } else if (isIncorrect) {
      baseClass += "hover:bg-red-50 ";
    } else {
      baseClass += "hover:bg-blue-50";
    }

    return baseClass;
  };

  return (
    <div class="border-8 border-gray-200 border-solid">
      {/* Sudoku Grid */}
      <For each={currentBoard()}>
        {(row, rowIndex) => (
          <div class="flex flex-row">
            <For each={row}>
              {(cell, colIndex) => (
                <div
                  class={getCellClass(rowIndex(), colIndex(), cell)}
                  onClick={() => handleCellClick(rowIndex(), colIndex())}
                >
                  {(showSolution()
                    ? solutionBoard()[rowIndex()][colIndex()]
                    : cell) || ""}
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
};
