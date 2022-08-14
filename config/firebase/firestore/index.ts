import { getFirestore } from "firebase/firestore";
import { app } from "../core";

export const db = getFirestore(app);
