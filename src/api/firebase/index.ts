import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  WithFieldValue,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../config/firebase";
import { Difficulty } from "../../enums";
import {
  base64ToBlob,
  dataURLToBlob,
  getBase64StringFromDataURL,
  getImageExtensionFromFile,
} from "../../lib/utils";
import { HasAuthor, HasID, HasTitle } from "../../types/base";
import { LoginParams } from "../../types/form";
import { BasePuzzle, LocalPuzzle, RemotePuzzle } from "../../types/puzzle";
import { RemotePuzzlePack } from "../../types/puzzle_pack";

const PACKS = "packs";

// Auth
export async function signUp({ email, password }: LoginParams) {
  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredentials;
}

export async function signIn({ email, password }: LoginParams) {
  const userCredentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredentials;
}
// Storage
export async function uploadFile(path: string, file: Blob) {
  const fileRef = ref(storage, path);
  const snapShop = await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(snapShop.ref);
  return downloadURL;
}

export async function uploadUserFile(fileName: string, file: Blob, user: User) {
  const path = `user_data/user_${user.email}/${fileName}`;
  return await uploadFile(path, file);
}

export async function uploadProfilePicture(file: Blob, user: User) {
  const fileName = `profile_picture.${file.type.replace("image/", "")}`;
  const photoURL = await uploadUserFile(fileName, file, user);
  await updateProfile(user, {
    photoURL,
  });
  return photoURL;
}
export async function uploadPackCover(title: string, file: Blob) {
  // console.log(file);
  const path = `pack_data/${title}/cover.${getImageExtensionFromFile(file)}`;
  return await uploadFile(path, file);
}

// Collections
interface CreateDocumentParams {
  document: WithFieldValue<DocumentData>;
  path: string;
}

export async function createDocument({ document, path }: CreateDocumentParams) {
  return await addDoc(collection(db, path), { ...document });
}

interface UploadPuzzlePictureParams {
  packTitle: string;
  word: string;
  index: number;
  file: Blob;
}

export async function uploadPuzzlePicture({
  packTitle,
  word,
  index,
  file,
}: UploadPuzzlePictureParams) {
  const path = `pack_data/${packTitle}/${word}/picture_${index}.${getImageExtensionFromFile(
    file
  )}`;
  return await uploadFile(path, file);
}

export async function uploadPuzzlePicturesFromPuzzle(
  puzzle: BasePuzzle,
  packTitle: string
) {
  const destinationPuzzle: BasePuzzle = {
    word: puzzle.word,
    pictures: [],
    local: false,
  };

  const picturesToBeUploaded = puzzle.pictures;
  const uploadTasks: Array<Promise<string>> = [];
  for (let i = 0; i < picturesToBeUploaded.length; i++) {
    uploadTasks.push(
      uploadPuzzlePicture({
        packTitle,
        word: puzzle.word,
        index: i,
        file: dataURLToBlob(picturesToBeUploaded[i]),
      })
    );
  }

  const urls = await Promise.all(uploadTasks);
  urls && destinationPuzzle.pictures.push(...urls);

  return destinationPuzzle;
}

interface EditPackParams extends HasID, HasTitle {
  difficulty: Difficulty;
}

interface AddPuzzleParams {
  packId: string | number;
  packTitle: string;
  puzzle: LocalPuzzle;
}

export async function addPuzzle({
  packId,
  packTitle,
  puzzle,
}: AddPuzzleParams) {
  const packRef = doc(db, "packs", packId.toString());

  const destinationPuzzle = await uploadPuzzlePicturesFromPuzzle(
    puzzle,
    packTitle
  );
  await updateDoc(packRef, {
    puzzles: arrayUnion(JSON.stringify(destinationPuzzle)),
  });
}

export async function editPack({ id, ...rest }: EditPackParams) {
  const docRef = doc(db, "packs", id.toString());
  await updateDoc(docRef, { ...rest });
}

interface EditPackCoverParams {
  id: string | number;
  packTitle: string;
  cover: File;
}

export async function editPackCover({
  id,
  packTitle,
  cover,
}: EditPackCoverParams) {
  const docRef = doc(db, "packs", id.toString());
  const url = await uploadPackCover(packTitle, cover);
  await updateDoc(docRef, { cover: url });
}

interface CreatePackParams {
  pack: HasTitle & HasAuthor & { difficulty: Difficulty };
  cover: File;
  puzzles: Array<LocalPuzzle>;
}

export async function createPack({ pack, cover, puzzles }: CreatePackParams) {
  if (puzzles.length === 0)
    throw new Error("Veuillez ajouter au moins un puzzle!");
  if (!cover) throw new Error("Veuillez ajouter une couverture!");
  if (!pack.title || !pack.author || !pack.difficulty)
    throw new Error("Veuillez renseigner toutes les informations!");

  const uploadTasks: Array<Promise<RemotePuzzle>> = [];

  for (let i = 0; i < puzzles.length; i++) {
    uploadTasks.push(uploadPuzzlePicturesFromPuzzle(puzzles[i], pack.title));
  }

  const [result, coverUrl, ...remotePuzzles] = await Promise.all([
    createDocument({ document: pack, path: "packs" }),
    uploadPackCover(pack.title, cover),
    ...uploadTasks,
  ]);

  await Promise.all([
    setDoc(result, { puzzles: remotePuzzles }, { merge: true }),
    setDoc(result, { cover: coverUrl }, { merge: true }),
  ]);

  return {
    id: result.id,
    cover: coverUrl,
    puzzles: remotePuzzles,
  };
}

export function getRef(documentPath: string) {
  return collection(db, documentPath);
}

export async function getAllPacks() {
  const packsRef = getRef(PACKS);
  const packsDocs = await getDocs(packsRef);

  const result: Array<RemotePuzzlePack> = [];

  packsDocs.forEach((doc) => {
    const data = doc.data();
    const puzzles = convertPuzzlesToObj(data.puzzles);
    const puzzlePack: RemotePuzzlePack = {
      id: doc.id,
      title: data.title,
      cover: data.cover,
      author: data.author,
      difficulty: data.difficulty,
      puzzles,
      local: false,
    };
    result.push(puzzlePack);
  });
  return result;
}

function convertPuzzlesToObj(puzzles: Array<any>) {
  return puzzles.map((puzzle) =>
    typeof puzzle === "string" ? JSON.parse(puzzle) : puzzle
  );
}

export async function getPacksFromUser(uid: string) {
  const q = getUserIsAuthorQuery(uid);
  const querySnapshot = await getDocs(q);

  const result: Array<RemotePuzzlePack> = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const puzzles = convertPuzzlesToObj(data.puzzles);
    const puzzlePack: RemotePuzzlePack = {
      id: doc.id,
      title: data.title,
      cover: data.cover,
      author: data.author,
      difficulty: data.difficulty,
      puzzles,
      local: false,
    };
    result.push(puzzlePack);
  });
  return result;
}

export function getUserIsAuthorQuery(uid: string) {
  return query(collection(db, "packs"), where("author", "==", uid));
}
