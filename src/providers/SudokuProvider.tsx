import { createContext, useContext, type JSX } from "solid-js";
import { useSudoku, type ISudokuHookReturn } from "../hooks/useSudoku";

const SudokuContext = createContext<ISudokuHookReturn>(useSudoku());

export const useSudokuContext = () => {
  return useContext(SudokuContext);
};

export const SudokuContextProvider = (params: { children: JSX.Element }) => (
  <SudokuContext.Provider value={useSudoku()} children={params.children} />
);
