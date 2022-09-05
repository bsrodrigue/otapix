import { FirebaseError } from "firebase/app";
import { useCallback, useState } from "react";
import { notifyError, notifySuccess } from "../notifications";


export enum RequestNames {
  LOGIN = "login",
  REGISTER = "register",
}

export const SuccessMessages: Record<RequestNames, string> = {
  "login": "Welcome back to otapix 🎉",
  "register": "Welcome to otapix 🎉",
}


export const ErrorCodeMessage: Record<string, string> = {
  "auth/user-not-found": "This user does not exist",
  "auth/weak-password": "Please type a stronger password",
  "auth/email-already-in-use": "This email is already taken",
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
  notifySuccess(SuccessMessages[operationName]);
}


