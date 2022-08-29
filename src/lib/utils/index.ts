import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Difficulty } from '../../enums';
import { LetterSlot, LetterSlotsState, Pack, Puzzle, Puzzles } from '../../types';

export function setImagePreviewFromInput(sourceInput: HTMLInputElement, targetImage: HTMLImageElement) {
  if (!sourceInput.files || !sourceInput.files[0]) return;
  const file = sourceInput.files[0];

  setImagePreviewFromFile(file, targetImage);
}

export function setImagePreviewFromFile(file: File, targetImage: HTMLImageElement) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const image = e.target?.result as string;
    targetImage.src = image;
  };

  reader.readAsDataURL(file);
}

export async function getSrcFromFile(file: File) {
  const src = (await readFileAsDataURL(file)) as string;
  return src;
}

export async function readFileAsDataURL(file: File) {
  const result_base64 = await new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });
  return result_base64;
}

export function base64ToBlob(base64: string, type?: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type });
  return blob;
}

export function getBase64StringFromDataURL(dataURL: string) {
  return dataURL.replace('data:', '').replace(/^.+,/, '');
}

export function createPuzzlePack(uid: string): Required<Pack> {
  return {
    id: uuidv4(),
    title: 'New pack',
    difficulty: Difficulty.D,
    authorId: uid,
    cover: '',
    online: false,
    puzzles: [],
  };
}

export function dataURLToBlob(dataURL: string) {
  const base64 = getBase64StringFromDataURL(dataURL);
  const [, type] = dataURL.split(';')[0].split('/');
  const file = base64ToBlob(base64, `image/${type}`);
  return file;
}

export function getImageExtensionFromFile(file: Blob) {
  return file.type.replace('image/', '');
}

interface ImageAdapterParams {
  image: string | File | FileList;
}

export function adaptImageToFile({ image }: ImageAdapterParams): File {
  if (image instanceof File) return image;
  if (image instanceof FileList) return image[0];
  if (typeof image === 'string') {
    const base64 = getBase64StringFromDataURL(image);
    const blob = base64ToBlob(base64) as File;
    return blob;
  }
  throw new Error("Erreur lors de l'adaptation de l'image");
}

export function getNewPuzzles(puzzles: Puzzles) {
  return puzzles.filter((puzzle) => !puzzle.online);
}

export function getOldPuzzles(puzzles: Puzzles) {
  return puzzles.filter((puzzle) => puzzle.online);
}

export function insertRandomAlphabetLetters(count: number) {
  const arr: string[] = [];
  const alphabet = 'abcdefghijklmnopqurstuvwxyz';
  for (let i = 0; i < count; i++) {
    const randomIndex = _.random(0, alphabet.length - 1);
    arr.push(alphabet[randomIndex]);
  }
  return arr;
}

export class SlotHelper {
  public static getFirstEmptyIndex(slots: LetterSlot[]): number {
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].letter === '') {
        return i;
      }
    }
    return -1;
  }

  public static getFirstNonEmptyIndex(slots: LetterSlot[]): number {
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].letter !== '') {
        return i;
      }
    }
    return -1;
  }

  public static getLastNonEmptyIndex(slots: LetterSlot[]): number {
    for (let i = slots.length - 1; i >= 0; i--) {
      if (slots[i].letter !== '') {
        return i;
      }
    }
    return -1;
  }

  public static slotsAreFull(slots: LetterSlot[]) {
    let nonEmptySlots = 0;
    const slotCount = slots.length;
    for (let i = 0; i < slotCount; i++) {
      if (slots[i].letter !== '') nonEmptySlots++;
    }
    return nonEmptySlots === slotCount;
  }

  public static toSlots(arr: string[], selected = false): LetterSlot[] {
    const slotLetters: LetterSlot[] = arr.map((slotLetter: string, index: number) => ({
      letter: slotLetter,
      index,
      selected,
    }));
    return slotLetters;
  }

  public static toLetters(slots: LetterSlot[]): string {
    let result = '';
    slots.forEach((slot: LetterSlot) => {
      result = result.concat(slot.letter);
    });
    return result;
  }

  public static pushLetter(
    gameSlots: LetterSlotsState,
    slot: LetterSlot,
    onLetterPushed: (newGameSlots: LetterSlotsState) => void,
  ) {
    const targetSlots = [...gameSlots.targetSlots];
    const pickerSlots = [...gameSlots.pickerSlots];
    const selected = true;
    const newSlotState = { ...slot, selected };
    const index: number = SlotHelper.getFirstEmptyIndex(targetSlots);
    if (index === -1) return;
    targetSlots[index] = newSlotState;
    pickerSlots[slot.index] = newSlotState;
    const newGameSlots: LetterSlotsState = {
      targetSlots,
      pickerSlots,
    };
    onLetterPushed(newGameSlots);
  }

  public static popLetter(gameSlots: LetterSlotsState, onLetterPushed: (newGameSlots: LetterSlotsState) => void) {
    const targetSlots = [...gameSlots.targetSlots];
    const pickerSlots = [...gameSlots.pickerSlots];
    const selected = false;
    const index: number = SlotHelper.getLastNonEmptyIndex(targetSlots);
    if (index === -1) return;
    const targetSlot = targetSlots[index];
    pickerSlots[targetSlot.index] = { ...targetSlot, selected };
    targetSlots[index] = { ...targetSlot, selected, letter: '' };
    const newGameSlots: LetterSlotsState = {
      targetSlots,
      pickerSlots,
    };
    onLetterPushed(newGameSlots);
  }

  public static setupCurrentPuzzle(puzzle: Puzzle, onPuzzleSetup: Function) {
    const { word } = puzzle;
    const letters = word.split('');
    const emptyLetters = Array(word.length).fill('');
    const targetSlots: LetterSlot[] = SlotHelper.toSlots(emptyLetters);
    const pickerSlots: LetterSlot[] = SlotHelper.toSlots(
      _.shuffle(insertRandomAlphabetLetters(letters.length).concat(letters)),
    );
    onPuzzleSetup({ targetSlots, pickerSlots });
  }

  public static checkIfResultIsCorrect(
    puzzle: Puzzle,
    targetSlots: Array<LetterSlot>,
    onCorrect: Function,
    onIncorrect: Function,
  ) {
    const { word } = puzzle;
    const playerWord = SlotHelper.toLetters(targetSlots);
    if (word === playerWord) {
      onCorrect();
    } else {
      onIncorrect();
    }
  }
}
