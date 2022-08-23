import { FirebaseError } from "firebase/app";
import { logError } from "../logging";
import { notifyError } from "../notifications";

export enum RequestNames {
  LOGIN = "login",
  REGISTER = "register",
}

export const ErrorCodeMessage: Record<string, string> = {
  "auth/user-not-found": "Cet utilisateur n'existe pas!",
  "auth/email-already-in-use": "Cet email est deja utilise",
};

export function handleLoginError(error: unknown) {
  //   handleError(error, "connexion");
}

export function handleRegisterError(error: unknown) {
  //   handleError(error, "inscription");
}

export const ErrorHandlers: Record<string, (error: unknown) => void> = {
  login: handleLoginError,
  register: handleRegisterError,
};

export function handleError(error: unknown, requestName: RequestNames) {
  if (error instanceof FirebaseError) {
    notifyError(ErrorCodeMessage[error.code] || error.code);
    ErrorHandlers[requestName](error);
  } else {
    notifyError(`Erreur lors de la requete: ${requestName}`);
  }
  logError(error);
}
