import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { addDoc, collection, doc, DocumentData, getDocs, QueryDocumentSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth } from "../../config/firebase/auth";
import { db } from "../../config/firebase/firestore";
import { storage } from "../../config/firebase/storage";
import { Difficulty } from "../../enums";
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
  const path = `pack_data/${title}/cover`
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
  const result = await createDocument({ document: pack, path: "packs" });
  if (!result) throw Error("Error while creating pack on server");
  if (puzzles?.length !== 0) {
    const serverPuzzles: any[] = [];
    puzzles?.forEach(async (puzzle) => {
      // const p1 = await uploadPuzzlePicture(`pack_data/${pack.title}/pictures/`, puzzle.pictures[0]);
      // const urls = await Promise.all([
      //   puzzle.pictures.map(async (picture) => {

      //   })
      // ]);
      // const puzzleDoc = createDocument({ document: {}, path: `packs/${}` })
    });
    // await setDoc(result, { puzzles: coverUrl }, { merge: true });
  }
  const coverUrl = await uploadPackCover(pack.title, cover);
  console.log(result);
  console.log(coverUrl);
  await setDoc(result, { cover: coverUrl }, { merge: true });
}

// export async function createPuzzlePack(pack: Extract<PuzzlePack, HasID>) {
//   const { cover, ...rest } = pack;
//   await setDoc(doc(db, "packs", "player"), { ...rest });
// }
