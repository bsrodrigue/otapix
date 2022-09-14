import { FirebaseError } from "firebase/app";
import { successEmoji } from "../../config/site";
import { notifyError, notifySuccess } from "../notifications";

export enum RequestNames {
  LOGIN = "login",
  REGISTER = "register",
  GET_ALL_PACKS = "get_all_packs",
  GET_USER_PACKS = "get_user_packs",
  CREATE_PACK = "create_pack",
  CREATE_PUZZLE = "create_puzzle",
  DELETE_PACK = "delete_pack",
  DELETE_PUZZLE = "delete_puzzle",
  SEND_EMAIL_VERIFICATION = "send_email_verification",
  SEND_PASSWORD_RESET_MAIL = "send_password_reset_mail",
}

export const SuccessMessages: Record<string, string> = {
  login: "Welcome back to otapix " + successEmoji,
  register: "Welcome to otapix " + successEmoji,
  delete_pack: "Pack deleted with success " + successEmoji,
  delete_puzzle: "Puzzle deleted with success " + successEmoji,
  create_pack: "Pack created with success " + successEmoji,
  create_puzzle: "Puzzle created with success " + successEmoji,
  send_password_reset_mail:
    "A password reset link has been sent to mail, please check",
};

export const ErrorCodeMessage: Record<string, string> = {
  "auth/user-not-found": "This user does not exist",
  "auth/email-already-in-use": "This email is already taken",
  "auth/weak-password": "Please type a stronger password",
  "auth/wrong-password": "Your password is wrong",
};

export function handleError(error: unknown, operationName: RequestNames) {
  if (error instanceof FirebaseError) {
    notifyError(ErrorCodeMessage[error.code] || error.message);
  } else {
    notifyError("An error occured");
    console.error(operationName, "===>", error);
  }
}

export function handleSuccess(operationName: RequestNames) {
  notifySuccess(SuccessMessages[operationName]!);
}
