import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { addDoc, collection, doc, DocumentData, getDocs, query, QueryDocumentSnapshot, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth } from "../../config/firebase/auth";
import { db } from "../../config/firebase/firestore";
import { storage } from "../../config/firebase/storage";
import { Difficulty } from "../../enums";
import { base64ToBlob, getBase64StringFromDataURL } from "../../lib/utils";
import { HasAuthor, HasID, HasTitle, Puzzle, PuzzlePack } from "../../types";

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

export async function uploadPuzzlePicture(path: string, file: Blob) {
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
  puzzles?: Array<Puzzle>;
}

export async function createPack({ pack, cover, puzzles }: CreatePackParams) {
  if (!cover) {
    console.error("No cover");
    return;
  }

  const localPuzzles = [];
  const result = await createDocument({ document: pack, path: "packs" });

  if (!result) throw Error("Error while creating pack on server");

  if (puzzles && puzzles.length !== 0) {
    for (let i = 0; i < puzzles?.length; i++) {
      const puzzle = puzzles[i];
      const pictures: Array<string> = [];
      const p: any = { word: "new_puzzle" };

      for (let j = 0; j < puzzle.pictures.length; j++) {
        const picture = puzzle.pictures[j];

        const base64 = getBase64StringFromDataURL(picture);
        const [, type] = picture.split(';')[0].split('/');
        const file = base64ToBlob(base64, `image/${type}`);
        const url = await uploadPuzzlePicture(`pack_data/${pack.title}/${puzzle.word}_picture_${j}.${file.type.replace("image/", "")}`, file);
        url && pictures.push(url);
      }

      p.word = puzzle.word;
      p.pictures = pictures;
      console.log(p);
      localPuzzles.push(p);
    }
  }
  const coverUrl = await uploadPackCover(pack.title, cover);

  await setDoc(result, { puzzles: localPuzzles }, { merge: true });
  await setDoc(result, { cover: coverUrl }, { merge: true });

  console.log(result);
  console.log(coverUrl);
}

export async function getPacksFromUser(uid: string) {
  const packsRef = collection(db, "packs");
  const q = query(packsRef, where("author", "==", uid));
  const querySnapshot = await getDocs(q);

  const result: Array<PuzzlePack> = [];

  let index = 0;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const puzzlePack: PuzzlePack = {
      id: index,
      title: data?.title,
      cover: data?.cover,
      author: data?.author,
      difficulty: data?.difficulty,
      puzzles: data?.puzzles,
    }
    result.push(puzzlePack);
  })
  return result;
}

