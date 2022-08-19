import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { collection, doc, DocumentData, getDocs, QueryDocumentSnapshot, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth } from "../../config/firebase/auth";
import { db } from "../../config/firebase/firestore";
import { storage } from "../../config/firebase/storage";
import { HasID, PuzzlePack } from "../../types";

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

export async function createPuzzlePack(pack: Extract<PuzzlePack, HasID>) {
  const { cover, ...rest } = pack;
  await setDoc(doc(db, "packs", "player"), { ...rest });
}
