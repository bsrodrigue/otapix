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

export type HasId = { id: string };
export interface Pack extends HasId {
  authorId: string;
  title: string;
  cover: string;
  difficulty: Difficulty;
  online?: boolean;
  puzzles?: Puzzles;
  packAuthor?: string;
}
export interface Puzzle extends HasId {
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

export interface LetterSlot {
  letter: string;
  index: number;
  selected: boolean;
}

export interface GameState {
  puzzles: Array<Puzzle>;
  currentLevelIndex: number;
  letterSlotsState: LetterSlotsState;
}

export interface LetterSlotsState {
  targetSlots: LetterSlot[];
  pickerSlots: LetterSlot[];
}

export interface LoginParams {
  email: string;
  password: string;
}
export interface RegisterParams {
  avatar: Blob;
  username: string;
  email: string;
  password: string;
}
export interface UrlLink {
  label: string;
  url: string;
}

export interface UserProfile extends Partial<HasId> {
  userId: string;
  username: string;
  email: string;
  avatar?: string;
}