import { Difficulty } from "../enums";
import { HasAuthor, HasCover, HasID, HasTitle } from "./base";
import { LocalPuzzle, RemotePuzzle } from "./puzzle";

export interface BasePuzzlePack extends HasID, HasAuthor, HasCover, HasTitle {
  difficulty: Difficulty;
  puzzles: Array<LocalPuzzle | RemotePuzzle>;
  local: boolean;
}

export interface RemotePuzzlePack extends BasePuzzlePack { }

export interface LocalPuzzlePack extends BasePuzzlePack { }

export type GenericPuzzlePack = LocalPuzzlePack | RemotePuzzlePack;
