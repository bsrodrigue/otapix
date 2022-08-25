import { v4 as uuidv4 } from "uuid";
import { Difficulty } from "../../enums";
import { Pack, Puzzles } from "../../types";

export function setImagePreviewFromInput(
  sourceInput: HTMLInputElement,
  targetImage: HTMLImageElement
) {
  if (!sourceInput.files || !sourceInput.files[0]) return;
  const file = sourceInput.files[0];

  setImagePreviewFromFile(file, targetImage);
}

export function setImagePreviewFromFile(
  file: File,
  targetImage: HTMLImageElement
) {
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
  let result_base64 = await new Promise((resolve) => {
    let fileReader = new FileReader();
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
  return dataURL.replace("data:", "").replace(/^.+,/, "");
}

export function createPuzzlePack(uid: string): Required<Pack> {
  return {
    id: uuidv4(),
    title: "New pack",
    difficulty: Difficulty.D,
    authorId: uid,
    cover: "",
    online: false,
    puzzles: [],
  };
}

export function dataURLToBlob(dataURL: string) {
  const base64 = getBase64StringFromDataURL(dataURL);
  const [, type] = dataURL.split(";")[0].split("/");
  const file = base64ToBlob(base64, `image/${type}`);
  return file;
}

export function getImageExtensionFromFile(file: Blob) {
  return file.type.replace("image/", "");
}

interface ImageAdapterParams {
  image: string | File | FileList;
}

export function adaptImageToFile({ image }: ImageAdapterParams): File {
  if (image instanceof File) return image;
  if (image instanceof FileList) return image[0];
  if (typeof image === "string") {
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
