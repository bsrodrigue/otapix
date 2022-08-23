import { HasID } from "./base";

export interface BasePuzzle extends HasID {
  word: string;
  pictures: Array<string>;
}

export interface LocalPuzzle extends BasePuzzle {
  local: boolean;
}

export interface RemotePuzzle extends BasePuzzle {}
