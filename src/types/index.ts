import { Dispatch, SetStateAction } from "react";
import { Difficulty } from "../enums";

export type Setter<T> = Dispatch<SetStateAction<T>>;
export type BooleanSetter = Setter<boolean>;
export type StringSetter = Setter<string>;
export type NumberSetter = Setter<number>;

export type PackSetter = Setter<Pack>;
export type PacksSetter = Setter<Packs>;

export type Packs = Array<Pack>;
export type Puzzles = Array<Puzzle>;
export interface Pack {
  id: string;
  authorId: string;
  title: string;
  cover: string;
  difficulty: Difficulty;
  online?: boolean;
  puzzles?: Puzzles;
}
export interface Puzzle {
  id: string;
  packId: string;
  word: string;
  pictures: Array<string>;
  online?: boolean;
}
export interface FormField {
  label: string;
  placeholder: string;
  type: string;
  name?: string;
  className?: string;
}
