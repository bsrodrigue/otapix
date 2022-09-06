import { FirebaseError } from "firebase/app";
import { successEmoji } from "../../config/site";
import { notifyError, notifySuccess } from "../notifications";

export enum RequestNames {
  LOGIN = "login",
  REGISTER = "register",
  GET_ALL_PACKS = "get_all_packs",
  GET_USER_PACKS = "get_user_packs",
  DELETE_PACK = "delete_pack",
  DELETE_PUZZLE = "delete_puzzle",
}

export const SuccessMessages: Record<string, string> = {
  "login": "Welcome back to otapix " + successEmoji,
  "register": "Welcome to otapix " + successEmoji,
  "delete_pack": "Pack deleted with success " + successEmoji,
  "delete_puzzle": "Puzzle deleted with success " + successEmoji,
}


export const ErrorCodeMessage: Record<string, string> = {
  "auth/user-not-found": "This user does not exist",
  "auth/email-already-in-use": "This email is already taken",
  "auth/weak-password": "Please type a stronger password",
};


export function handleError(error: unknown, operationName: RequestNames) {
  if (error instanceof FirebaseError) {
    notifyError(ErrorCodeMessage[error.code] || error.message);
  }
  else {
    notifyError("An error occured");
    console.error(operationName, "===>", error);
  }
}

export function handleSuccess(operationName: RequestNames) {
  notifySuccess(SuccessMessages[operationName]!);
}


