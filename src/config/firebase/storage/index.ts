import { getStorage } from "firebase/storage";
import { app } from "../core";

export const storage = getStorage(app);