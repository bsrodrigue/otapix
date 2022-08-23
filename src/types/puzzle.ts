import { HasID } from "./base";

export interface BasePuzzle extends Partial<HasID> {
  word: string;
  pictures: Array<string>;
  local: boolean;
}

export interface LocalPuzzle extends BasePuzzle {
}

export interface RemotePuzzle extends BasePuzzle { }
