import { collection, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

export function getPuzzleIsFromPackQuery(packId: string) {
  return query(collection(db, "puzzles"), where("packId", "==", packId));
}

export function getUserIsAuthorQuery(uid: string) {
  return query(collection(db, "packs"), where("authorId", "==", uid));
}

export function getUserOwnsProfileQuery(uid: string) {
  return query(collection(db, "user_profiles"), where("userId", "==", uid));
}
