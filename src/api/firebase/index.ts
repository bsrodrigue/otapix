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
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
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
import { dataURLToBlob, getImageExtensionFromFile } from "../../lib/utils";
import { Pack, Packs, Puzzle, Puzzles } from "../../types";

const PACKS = "packs";

interface LoginParams {
  email: string;
  password: string;
}

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

export async function uploadUserFile(fileName: string, file: Blob) {
  const path = `user/files/${fileName}`;
  return await uploadFile(path, file);
}

export async function uploadProfilePicture(file: Blob, user: User) {
  const fileName = `profile-pictures/${user.email}avatar.${file.type.replace(
    "image/",
    ""
  )}`;
  const photoURL = await uploadUserFile(fileName, file);
  await updateProfile(user, {
    photoURL,
  });
  return photoURL;
}
export async function uploadPackCover(title: string, file: Blob) {
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

export async function deleteDocument(docRef: DocumentReference) {
  await deleteDoc(docRef);
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
  id: string,
  packId: string,
  puzzle: Puzzle,
  packTitle: string
) {
  const destinationPuzzle: Puzzle = {
    id,
    packId,
    word: puzzle.word,
    pictures: [],
    online: true,
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
interface AddPuzzlesParams {
  packId: string | number;
  packTitle: string;
  puzzles: Array<LocalPuzzle>;
}
export async function addPuzzles({
  packId,
  packTitle,
  puzzles,
}: AddPuzzlesParams) {
  const packRef = doc(db, "packs", packId.toString());
  const uploadTasks: Array<Promise<RemotePuzzle>> = [];
  const updateTasks: Array<Promise<void>> = [];

  for (let i = 0; i < puzzles.length; i++) {
    uploadTasks.push(uploadPuzzlePicturesFromPuzzle(puzzles[i], packTitle));
  }
  const destinationPuzzles = await Promise.all([...uploadTasks]);
  for (let i = 0; i < destinationPuzzles.length; i++) {
    updateTasks.push(
      updateDoc(packRef, {
        puzzles: arrayUnion(JSON.stringify(destinationPuzzles[i])),
      })
    );
  }
  await Promise.all([...updateTasks]);

  return destinationPuzzles;
}

export async function editPack({ id, ...rest }: EditPackParams) {
  const docRef = doc(db, "packs", id.toString());
  await updateDoc(docRef, { ...rest });
}

export async function deletePack(packId: string) {
  const docRef = doc(db, "packs", packId);
  await deleteDocument(docRef);
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

export async function createPuzzle(
  puzzle: { word: string; pictures: Array<string> },
  packRef: DocumentReference,
  packTitle: string
) {
  const { pictures, word } = puzzle;
  const puzzleRef = await createDocument({
    document: { word, packId: packRef.id },
    path: "puzzles",
  });
  const puzzlePicturesUploadTasks: Array<Promise<string>> = [];
  for (let j = 0; j < pictures.length; j++) {
    puzzlePicturesUploadTasks.push(
      uploadPuzzlePicture({
        packTitle,
        word,
        index: j,
        file: dataURLToBlob(pictures[j]),
      })
    );
  }
  const urls = await Promise.all(puzzlePicturesUploadTasks);
  await setDoc(puzzleRef, { pictures: urls }, { merge: true });
  return {
    id: puzzleRef.id,
    packId: packRef.id,
    pictures: urls,
    word,
  };
}

interface CreatePackParams {
  pack: Omit<Pack, "id" | "online" | "puzzles" | "cover">;
  cover: File;
  puzzles: Puzzles;
}

export async function createPack({ pack, cover, puzzles }: CreatePackParams) {
  const puzzleDocCreationTasks: Array<Promise<Puzzle>> = [];
  const packRef = await createDocument({ document: pack, path: "packs" });

  for (let i = 0; i < puzzles.length; i++) {
    const puzzle = puzzles[i];
    puzzleDocCreationTasks.push(createPuzzle(puzzle, packRef, pack.title));
  }
  const [coverUrl, ...createdPuzzles] = await Promise.all([
    uploadPackCover(pack.title, cover),
    ...puzzleDocCreationTasks,
  ]);

  return {
    id: packRef.id,
    cover: coverUrl,
    puzzles: createdPuzzles,
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
  const result: Packs = [];

  // querySnapshot.forEach((doc) => {
  //   const data = doc.data();
  //   const puzzles = convertPuzzlesToObj(data.puzzles);
  //   const puzzlePack: Packs = {
  //     id: doc.id,
  //     title: data.title,
  //     cover: data.cover,
  //     author: data.author,
  //     difficulty: data.difficulty,
  //     puzzles,
  //     local: false,
  //   };
  //   result.push(puzzlePack);
  // });
  return result;
}

export function getUserIsAuthorQuery(uid: string) {
  return query(collection(db, "packs"), where("author", "==", uid));
}
