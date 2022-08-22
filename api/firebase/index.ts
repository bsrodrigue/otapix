import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { addDoc, arrayUnion, collection, doc, DocumentData, getDocs, query, QueryDocumentSnapshot, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth } from "../../config/firebase/auth";
import { db } from "../../config/firebase/firestore";
import { storage } from "../../config/firebase/storage";
import { Difficulty } from "../../enums";
import { base64ToBlob, getBase64StringFromDataURL } from "../../lib/utils";
import { HasAuthor, HasTitle, Puzzle, PuzzlePack } from "../../types";


// Collections
const PACKS = "packs";
const USER_PROFILES = "user_profiles";

export interface RegisterRequestParams {
  email: string;
  password: string;
};

export async function signUp({ email, password }: RegisterRequestParams) {
  const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
  return userCredentials;
}

export async function signIn({ email, password }: RegisterRequestParams) {
  const userCredentials = await signInWithEmailAndPassword(auth, email, password);
  return userCredentials;
}

export async function uploadFile(path: string, file: Blob) {
  const fileRef = ref(storage, path);
  const snapShop = await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(snapShop.ref);
  return downloadURL;
}

export async function uploadPackCover(title: string, file: Blob) {
  const path = `pack_data/${title}/cover.${file.type.replace("image/", "")}`
  const downloadURL = await uploadFile(path, file);
  return downloadURL;
}


export async function uploadUserFile(fileName: string, file: Blob, user: User) {
  const path = `user_data/user_${user.email}/${fileName}`;
  const downloadURL = await uploadFile(path, file);
  return downloadURL;
}

export async function uploadProfilePicture(file: Blob, user: User) {
  const fileName = `profile_picture.${file.type.replace("image/", "")}`;
  const photoURL = await uploadUserFile(fileName, file, user);
  await updateProfile(user, {
    photoURL,
  });
  return photoURL;
}

export async function getUserProfiles() {
  const profiles: any[] = [];
  const querySnapshot = await getDocs(collection(db, USER_PROFILES));
  querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
    profiles.push(doc.data());
  })
  return profiles;
}

interface CreateDocumentParams {
  document: any;
  path?: string;
  documentId?: string;
}

export async function createDocument({ document, path, documentId }: CreateDocumentParams) {
  let result = null;
  path = path || "misc";
  if (documentId) {
    await setDoc(doc(db, path, documentId), { ...document });
  } else {
    result = await addDoc(collection(db, path), { ...document });
  }
  return result;
}


interface CreatePackParams {
  pack: HasTitle & HasAuthor & { difficulty: Difficulty };
  cover: File;
  puzzles: Array<Puzzle>;
}

export function dataURLToBlob(dataURL: string) {
  const base64 = getBase64StringFromDataURL(dataURL);
  const [, type] = dataURL.split(';')[0].split('/');
  const file = base64ToBlob(base64, `image/${type}`);
  return file;
}

interface UploadPuzzlePictureParams {
  title: string;
  word: string;
  index: number;
  file: Blob;
}

export async function uploadPuzzlePicture({ title, word, index, file }: UploadPuzzlePictureParams) {
  const path = `pack_data/${title}/${word}/picture_${index}.${file.type.replace("image/", "")}`;
  const downloadURL = await uploadFile(path, file);
  return downloadURL;
}

export async function uploadPuzzlePicturesFromPuzzle(puzzle: Puzzle, title: string) {
  const p: { word: string, pictures: Array<string> } = { word: puzzle.word, pictures: [] };

  for (let i = 0; i < puzzle.pictures.length; i++) {
    const picture = puzzle.pictures[i];
    const file = dataURLToBlob(picture);
    const url = await uploadPuzzlePicture({ title, word: puzzle.word, index: i, file });
    url && p.pictures.push(url);
  }

  return p;
}

export async function editPack({ id, puzzles, ...rest }: any) {
  const docRef = doc(db, "packs", id.toString());

  const remotePuzzles = [];
  if (puzzles && puzzles?.length !== 0) {

    for (let i = 0; i < puzzles?.length; i++) {
      const puzzle = puzzles[i];
      const p = await uploadPuzzlePicturesFromPuzzle(puzzle, rest.title);
      remotePuzzles.push(p);
    }
  }
  if (remotePuzzles.length !== 0) {
    for (let i = 0; i < remotePuzzles.length; i++) {
      await updateDoc(docRef, { puzzles: arrayUnion(JSON.stringify(remotePuzzles[i])), ...rest });
    }
  } else {
    await updateDoc(docRef, { ...rest });
  }
  return {
    id,
    puzzles: remotePuzzles,
    ...rest
  }
}

export async function createPack({ pack, cover, puzzles }: CreatePackParams) {
  if (puzzles.length === 0) throw Error("No puzzles provided for this pack");
  const result = await createDocument({ document: pack, path: "packs" });
  if (!result) throw Error("Error while creating pack on server");

  const coverUrl = await uploadPackCover(pack.title, cover);

  const remotePuzzles = [];

  for (let i = 0; i < puzzles?.length; i++) {
    const puzzle = puzzles[i];
    const p = await uploadPuzzlePicturesFromPuzzle(puzzle, pack.title);
    remotePuzzles.push(p);
  }

  await setDoc(result, { puzzles: remotePuzzles }, { merge: true });
  await setDoc(result, { cover: coverUrl }, { merge: true });

  const localPack: PuzzlePack = {
    id: result.id,
    title: pack.title,
    difficulty: pack.difficulty,
    cover: coverUrl,
    author: pack.author,
    puzzles: remotePuzzles,
  }

  return localPack;
}


export function getRef(documentPath: string) {
  return collection(db, documentPath);
}

export async function getAllPacks() {
  const packsRef = getRef(PACKS);
  const packsDocs = await getDocs(packsRef);

  const result: Array<PuzzlePack> = [];

  packsDocs.forEach((doc) => {
    const data = doc.data();
    const puzzles = convertPuzzlesToObj(data.puzzles);
    const puzzlePack: PuzzlePack = {
      id: doc.id,
      title: data.title,
      cover: data.cover,
      author: data.author,
      difficulty: data.difficulty,
      puzzles,
    }
    result.push(puzzlePack);
  })
  return result;

}

function convertPuzzlesToObj(puzzles: Array<any>) {
  console.log(puzzles);
  return puzzles.map((puzzle) => (typeof puzzle === "string") ? JSON.parse(puzzle) : puzzle)
}

export async function getPacksFromUser(uid: string) {
  const q = getUserIsAuthorQuery(uid);
  const querySnapshot = await getDocs(q);

  const result: Array<PuzzlePack> = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const puzzles = convertPuzzlesToObj(data.puzzles);
    console.log(puzzles);
    const puzzlePack: PuzzlePack = {
      id: doc.id,
      title: data.title,
      cover: data.cover,
      author: data.author,
      difficulty: data.difficulty,
      puzzles,
    }
    result.push(puzzlePack);
  })
  return result;
}

export function getUserIsAuthorQuery(uid: string) {
  return query(collection(db, "packs"), where("author", "==", uid));
} 
