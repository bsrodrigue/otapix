import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  setDoc,
  startAfter,
  updateDoc,
  WithFieldValue,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../config/firebase";
import { Difficulty } from "../../enums";
import { getPackModificationTasksToPerform } from "../../lib/forms/editor";
import { notifyError } from "../../lib/notifications";
import {
  dataURLToBlob,
  getImageExtensionFromFile,
  getSrcFromFile,
} from "../../lib/utils";
import { Pack, Packs, Puzzle, Puzzles } from "../../types";
import { hydratePack, hydratePuzzle } from "./hydrators";
import { getPuzzleIsFromPackQuery, getUserIsAuthorQuery, getUserOwnsProfileQuery } from "./queries";
import { UserProfile } from '../../types/index';

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

export async function updateUserProfile(user: User, { username, avatar }: { username: string; avatar: string }) {
  await updateProfile(user, {
    displayName: username,
    photoURL: avatar,
  });
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

export async function createUserProfile(userProfile: UserProfile) {
  return await createDocument({ document: userProfile, path: "user_profiles" })
}

export async function editUserProfile(userProfile: Partial<UserProfile>, uid: string) {
  const q = getUserOwnsProfileQuery(uid);
  const profileDoc = await getDocs(q);
  const ref = profileDoc.docs[0];
  return await updateDoc(ref.ref, { ...userProfile });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const q = getUserOwnsProfileQuery(uid);
  const profileDoc = await getDocs(q);
  if (profileDoc.empty) {
    return null;
  } else {
    const data = profileDoc.docs[0].data();
    const ref = profileDoc.docs[0];
    return {
      id: ref.id,
      userId: data.userId,
      email: data.email,
      avatar: data.avatar,
      username: data.username,
    };
  }
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

interface EditPackParams {
  id: string | number;
  title: string;
  difficulty: Difficulty;
}

interface AddPuzzleParams {
  packTitle: string;
  puzzle: Puzzle;
}

interface EditPuzzleParams {
  packTitle: string;
  puzzle: Puzzle;
}

export async function addPuzzle({ packTitle, puzzle }: AddPuzzleParams) {
  const docRef = doc(db, "puzzles", puzzle.packId);
  return await createPuzzle(puzzle, docRef, packTitle);
}

export async function editPuzzle({ packTitle, puzzle }: EditPuzzleParams) {
  const docRef = doc(db, "puzzles", puzzle.id);
  const tasks: Array<Promise<string>> = [];
  const alreadyUploadedPictures: Array<string> = [];
  for (let i = 0; i < 4; i++) {
    const picture = puzzle.pictures[i];
    let file: Blob | string;

    try {
      file = dataURLToBlob(picture);
      tasks.push(
        uploadPuzzlePicture({
          packTitle,
          word: puzzle.word,
          index: i,
          file,
        })
      );
    } catch (error) {
      if (typeof picture === "string") {
        alreadyUploadedPictures.push(picture);
      } else {
        notifyError("Impossible de upload pictures...");
      }
    }
  }
  const urls = await Promise.all(tasks);
  urls.push(...alreadyUploadedPictures);
  await updateDoc(docRef, { word: puzzle.word, pictures: urls });
  const p: Puzzle = { ...puzzle, pictures: urls, online: true };
  return p;
}

interface AddPuzzlesParams {
  packTitle: string;
  puzzles: Puzzles;
}
export async function addPuzzles({ packTitle, puzzles }: AddPuzzlesParams) {
  const uploadTasks: Array<Promise<Puzzle>> = [];
  for (let i = 0; i < puzzles.length; i++) {
    uploadTasks.push(addPuzzle({ packTitle, puzzle: puzzles[i] }));
  }
  return await Promise.all(uploadTasks);
}

export async function editPack({ id, ...rest }: EditPackParams) {
  const docRef = doc(db, "packs", id.toString());
  await updateDoc(docRef, { ...rest });
}

export async function deletePack(packId: string) {
  const docRef = doc(db, "packs", packId);
  const q = getPuzzleIsFromPackQuery(docRef.id);
  const puzzlesDocs = await getDocs(q);
  puzzlesDocs.forEach((doc) => {
    deleteDocument(doc.ref);
  });
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

export async function deletePuzzle(puzzleId: string) {
  const docRef = doc(db, "puzzles", puzzleId);
  await deleteDocument(docRef);
}

export async function createPuzzle(
  puzzle: { word: string; pictures: Array<string> },
  packRef: DocumentReference,
  packTitle: string
): Promise<Required<Puzzle>> {
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
    online: true,
  };
}

interface CreatePackParams {
  pack: Omit<Pack, "id" | "online" | "puzzles" | "cover">;
  cover: File;
}

export async function createPack({
  pack,
  cover,
}: CreatePackParams): Promise<Pack> {
  const { title, difficulty, authorId } = pack;

  const packRef = await createDocument({
    document: { title, difficulty, authorId },
    path: "packs",
  });

  const coverUrl = await uploadPackCover(pack.title, cover);

  await setDoc(packRef, { cover: coverUrl }, { merge: true });

  return {
    id: packRef.id,
    title: pack.title,
    difficulty: pack.difficulty,
    authorId: pack.authorId,
    cover: coverUrl,
    puzzles: [],
    online: true,
  };
}

export async function editPackFields({
  backup,
  data,
  cover,
}: {
  backup: Pack;
  data: { title: string; difficulty: Difficulty };
  cover: File;
}): Promise<Pack> {
  const tasks = getPackModificationTasksToPerform({
    pack: { id: backup.id, title: data.title, difficulty: data.difficulty },
    backup,
    cover,
  });
  await Promise.all([Promise.all(tasks)]);
  const newCover =
    typeof cover === "string" ? cover : await getSrcFromFile(cover);
  return {
    id: backup.id,
    authorId: backup.authorId,
    cover: newCover,
    title: data.title,
    difficulty: data.difficulty,
    puzzles: backup.puzzles,
    online: true,
  };
}

export function getRef(documentPath: string) {
  return collection(db, documentPath);
}

function extractDocs(docs: QuerySnapshot<DocumentData>) {
  const temp: any[] = [];
  docs.forEach((doc) => {
    temp.push(doc);
  });
  return temp;
}

async function getAuthorNameById(userId: string): Promise<string | null> {
  const userProfile = await getUserProfile(userId);
  return userProfile?.username || null;
}

async function packDocsToPacks(packsDocs: QuerySnapshot<DocumentData>) {
  const result: Packs = [];
  for (const doc of extractDocs(packsDocs)) {
    const pack = hydratePack(doc, []);
    const q = getPuzzleIsFromPackQuery(doc.id);
    const puzzlesDocs = await getDocs(q);
    const authorName = await getAuthorNameById(pack.authorId);

    if (authorName) {
      pack.packAuthor = authorName;
    }

    puzzlesDocs.forEach((doc) => {
      pack.puzzles?.push(hydratePuzzle(doc));
    });

    result.push(pack);
  }
  return result;
}

async function packDocToPacks(doc: DocumentSnapshot<DocumentData>) {
  const pack = hydratePack(doc, []);
  const q = getPuzzleIsFromPackQuery(doc.id);
  const puzzlesDocs = await getDocs(q);

  puzzlesDocs.forEach((doc) => {
    pack.puzzles?.push(hydratePuzzle(doc));
  });

  return pack;
}

export async function getPack(packId: string) {
  const packRef = doc(db, "packs", packId);
  const packDoc = await getDoc(packRef);
  return await packDocToPacks(packDoc);
}

export async function firstBatch() {
  const firstBatch = query(collection(db, "packs"), orderBy("title", "desc"), limit(3))
  const packDocs = await getDocs(firstBatch);
  const packs = await packDocsToPacks(packDocs);
  const lastKey = packs[packs.length - 1].title;
  return { packs, lastKey };
}

export async function nextBatch(lastDocTitle: string) {
  const next = query(collection(db, "packs"), orderBy("title", "desc"), startAfter(lastDocTitle), limit(3))
  const packDocs = await getDocs(next);
  const packs = await packDocsToPacks(packDocs);
  const lastKey = packs[packs.length - 1]?.title || "";
  return { packs, lastKey };
}

export async function getAllPacks() {
  const starterPacks = query(collection(db, "packs"), orderBy("title", "desc"), limit(4))
  const packsDocs = await getDocs(starterPacks);
  return await packDocsToPacks(packsDocs);
}

export async function getPacksFromUser(uid: string) {
  const q = getUserIsAuthorQuery(uid);
  const packDocs = await getDocs(q);
  return await packDocsToPacks(packDocs);
}