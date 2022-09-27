import { FirebaseError } from "firebase/app";
import { successEmoji } from "../../config/site";
import { notifyError, notifySuccess } from "../notifications";
import { OtapixError } from "./classes";
import { log } from '../logging/index';

export enum OtapixErrorCodes {
  NO_PUZZLE_CREATED = "pack-creation/no-puzzle-created",
  NO_COVER_PROVIDED = "pack-creation/no-cover-provided",
  PACK_REPLACEMENT_FAILED = "pack-replacement/error",
  NO_PACK_TITLE_PROVIDED = "pack-creation/no-pack-title-provided",
  NO_PACK_DIFFICULTY_PROVIDED = "pack-creation/no-pack-difficulty-provided",
  NO_PUZZLE_PICTURES_PROVIDED = "puzzle-creation/no-puzzle-pictures-provided",
  NO_PUZZLE_WORD_PROVIDED = "puzzle-creation/no-puzzle-word-provided",
  NO_USER_INFORMATION_PROVIDED = "profile-edit/no-user-information-provided",
}

export enum RequestNames {
  LOGIN = "login",
  REGISTER = "register",
  GET_ALL_PACKS = "get_all_packs",
  GET_USER_PACKS = "get_user_packs",
  CREATE_PACK = "create_pack",
  EDIT_PACK = "edit_pack",
  DELETE_PACK = "delete_pack",
  CREATE_PUZZLE = "create_puzzle",
  EDIT_PUZZLE = "edit_puzzle",
  DELETE_PUZZLE = "delete_puzzle",
  SEND_EMAIL_VERIFICATION = "send_email_verification",
  SEND_PASSWORD_RESET_MAIL = "send_password_reset_mail",
  UPDATE_USER_PROFILE = "update_user_profile",
}

export const SuccessMessages: Record<string, string> = {
  login: "Welcome back to otapix ",
  register: "Welcome to otapix ",
  delete_pack: "Pack deleted with success ",
  delete_puzzle: "Puzzle deleted with success ",
  create_pack: "Pack created with success ",
  create_puzzle: "Puzzle created with success ",
  send_password_reset_mail:
    "A password reset link has been sent to your mail, please check your inbox ",
  edit_pack: "Pack edited with success ",
  edit_puzzle: "Puzzle edited with success ",
  update_user_profile: "Profile edited with success ",
};

export const FirebaseErrorMessages: Record<string, string> = {
  "auth/user-not-found": "This user does not exist",
  "auth/email-already-in-use": "This email is already taken",
  "auth/weak-password": "Please, type a stronger password",
  "auth/wrong-password": "Your password is wrong",
};

export const OtapixErrorMessages: Record<OtapixErrorCodes, string> = {
  "pack-replacement/error": "An error occured while replacing the pack",
  "pack-creation/no-cover-provided": "Please, upload a cover for this pack",
  "pack-creation/no-puzzle-created":
    "Please, create a least one puzzle for this pack",
  "pack-creation/no-pack-title-provided":
    "Please, provide a title for your pack",
  "pack-creation/no-pack-difficulty-provided":
    "Please, select a difficulty for your pack",
  "puzzle-creation/no-puzzle-pictures-provided":
    "Please, select four pictures for your puzzle",
  "puzzle-creation/no-puzzle-word-provided":
    "Please, enter the word or name to guess",
  "profile-edit/no-user-information-provided": "Please, enter at lease one information"
};

export function handleError(error: unknown, operationName: RequestNames) {
  if (error instanceof FirebaseError) {
    notifyError(FirebaseErrorMessages[error.code] || error.message);
  } else if (error instanceof OtapixError) {
    const code = error.code as OtapixErrorCodes;
    notifyError(OtapixErrorMessages[code] || error.message);
  } else {
    notifyError("An error occured");
    log(operationName, "===> " + error);
  }
}

export function handleSuccess(operationName: RequestNames) {
  const message = SuccessMessages[operationName];
  message && notifySuccess(message + successEmoji);
}
