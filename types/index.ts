import { Dispatch, SetStateAction } from "react";
import { Difficulty } from "../enums";

export interface HasID {
  id: string | number;
}

export interface HasAuthor {
  author: string;
}

export interface HasCover {
  cover: string;
}

export interface HasTitle {
  title: string;
}

export interface IdentifiableCreation extends HasID, HasAuthor { }

export interface FormField {
  label: string;
  placeholder: string;
  type: string;
  name?: string;
  className?: string;
}

export interface Puzzle {
  word: string;
  universe?: string;
  pictures: Array<string>;
  order?: number;
}

export interface LocalPuzzlePack extends HasTitle, HasID, HasCover {
  local: boolean;
  difficulty: Difficulty;
  puzzles: Array<{ word: string; pictures: Array<string> }>;
}

export interface PuzzlePack extends IdentifiableCreation, HasCover, HasTitle {
  difficulty: Difficulty;
  // rating: number;
  // playCount: number;
  puzzles: Array<Puzzle>;
}

export interface UsePackIndexState {
  currentPackIndex: number;
  setCurrentPackIndex: Dispatch<SetStateAction<number>>;
}

export interface UsePackArrayState {
  packs: Array<PuzzlePack | LocalPuzzlePack>;
  setPacks: Dispatch<SetStateAction<AppPacks>>;
}

export interface UseDifficultyState {
  checkedDifficulty: string;
  setCheckedDifficulty: Dispatch<SetStateAction<Difficulty>>;
}

export interface Styled {
  style?: any;
}

export interface AppPacks {
  local: Array<LocalPuzzlePack>;
  remote: Array<PuzzlePack>;
}

