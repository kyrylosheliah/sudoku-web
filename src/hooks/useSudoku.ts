import { createEffect, createSignal, type Signal } from "solid-js";

export type TBoard = (number | null)[][];
export type TCell = [number, number] | null;

export interface ISudokuInfo {
  currentBoardState: Signal<TBoard>;
  initialBoardState: Signal<TBoard>;
  solutionBoardState: Signal<TBoard>;
  selectedCellState: Signal<TCell>;
  gameCompleteState: Signal<boolean>;
  difficultyState: Signal<number>;
  showSolutionState: Signal<boolean>;
}

export interface ISudokuActions {
  newGame: () => void;
  validate: () => void;
  inputSelectedCell: (value: number | null) => void;
}

export interface ISudokuHookReturn {
  info: ISudokuInfo;
  actions: ISudokuActions;
}

export const useSudoku = (): ISudokuHookReturn => {
  const emptyBoard = () =>
    Array(9)
      .fill(Array(9))
      .map(() => Array(9).fill(null));

  const currentBoardState = createSignal<TBoard>(emptyBoard());
  const [currentBoard, setCurrentBoard] = currentBoardState;
  const initialBoardState = createSignal<TBoard>(emptyBoard());
  const setInitialBoard = initialBoardState[1];
  const solutionBoardState = createSignal<TBoard>(emptyBoard());
  const [solutionBoard, setSolutionBoard] = solutionBoardState;
  const selectedCellState = createSignal<TCell>(null);
  const [selectedCell, setSelectedCell] = selectedCellState;
  const gameCompleteState = createSignal<boolean>(false);
  const [gameComplete, setGameComplete] = gameCompleteState;
  const difficultyState = createSignal<number>(0);
  const difficulty = difficultyState[0];
  const showSolutionState = createSignal<boolean>(false);
  const setShowSolution = showSolutionState[1];

  const newGame = () => {
    setGameComplete(false);
    setShowSolution(false);
    setSelectedCell(null);
    generateSudoku();
  };

  const inputSelectedCell = (value: number | null) => {
    const selected = selectedCell();
    if (!selected || gameComplete()) return;

    const [row, col] = selected;
    const newBoard = currentBoard().map((r) => [...r]);
    newBoard[row][col] = value;
    setCurrentBoard(newBoard);

    // Check if game is complete
    const solution = solutionBoard();
    const isComplete = newBoard.every((row, r) =>
      row.every((cell, c) => cell !== null && cell === solution[r][c])
    );

    if (isComplete) {
      setGameComplete(true);
      setSelectedCell(null);
    }
  };

  const isValidCell = (
    board: TBoard,
    row: number,
    col: number,
    cellValue: number | null
  ) => {
    if (cellValue === null) return true; // are always valid
    for (let i = 0; i < 9; ++i) { // check row
      if (i !== col && board[row][i] === cellValue) return false;
    }
    for (let i = 0; i < 9; ++i) { // check column
      if (i !== row && board[i][col] === cellValue) return false;
    }
    // Check 3x3 box
    const boxTopRow = row - (row % 3);
    const boxLeftCol = col - (col % 3);
    for (let i = boxTopRow; i < boxTopRow + 3; ++i) {
      for (let j = boxLeftCol; j < boxLeftCol + 3; ++j) {
        if (i !== row && j !== col && board[i][j] === cellValue) return false;
      }
    }
    return true;
  };

  const isValid = (board: TBoard) => {
    for (let row = 0; row < 9; ++row) {
      for (let col = 0; col < 9; ++col) {
        if (!isValidCell(board, row, col, board[row][col])) return false;
      }
    }
    return true;
  };

  const validate = () => {
    return isValid(currentBoard());
  };

  const solveSudoku = (board: TBoard) => {
    for (let row = 0; row < 9; ++row) {
      for (let col = 0; col < 9; ++col) {
        if (board[row][col] === null) {
          for (let num = 1; num <= 9; ++num) {
            if (isValidCell(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) return true;
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const generateSudoku = () => {
    const board = emptyBoard();

    // faster generation by initially filling only diagonal 3x3 boxes
    for (let box = 0; box < 9; box += 3) {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
      let idx = 0;
      for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
          board[box + i][box + j] = nums[idx++];
        }
      }
    }

    solveSudoku(board);
    console.log(board);

    // Remove numbers based on difficulty
    const diff = difficulty();
    const cellsToRemove = diff < 0 ? 0 : diff > 100 ? 100 : diff;

    const solution = board.map((row) => [...row]);
    const puzzle = board.map((row) => [...row]);

    // Create a list of all filled positions
    const filledPositions = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        filledPositions.push([r, c]);
      }
    }
    // Shuffle the positions array
    for (let i = filledPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filledPositions[i], filledPositions[j]] = [
        filledPositions[j],
        filledPositions[i],
      ];
    }
    // Remove cells from the shuffled positions
    const actualCellsToRemove = Math.min(cellsToRemove, filledPositions.length);
    for (let i = 0; i < actualCellsToRemove; i++) {
      const [row, col] = filledPositions[i];
      puzzle[row][col] = null;
    }

    setCurrentBoard(puzzle.map((row) => [...row]));
    setInitialBoard(puzzle.map((row) => [...row]));
    setSolutionBoard(solution);
  };

  createEffect(() => {
    newGame();
  }, []);

  return {
    info: {
      currentBoardState,
      initialBoardState,
      solutionBoardState,
      selectedCellState,
      gameCompleteState,
      difficultyState,
      showSolutionState,
    },
    actions: {
      newGame,
      validate,
      inputSelectedCell,
    },
  };
};
