import { updateProfile } from "firebase/auth";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { signIn, signUp, uploadProfilePicture } from "../../../api/firebase";
import { LoginParams, RegisterParams } from "../../../types";
import { handleError, RequestNames } from "../../errors";
import { notifySuccess } from "../../notifications";

export async function submitLogin(
  { email, password }: LoginParams,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  router: NextRouter,
) {
  try {
    setIsLoading(true);
    await signIn({ email, password });
    notifySuccess("Bon retour sur Otapix 🎉");
    router.push("/");
  } catch (error) {
    handleError(error, RequestNames.LOGIN);
  } finally {
    setIsLoading(false);
  }
}

export async function submitRegister(
  { avatar, username, email, password }: RegisterParams,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  router: NextRouter,
) {
  try {
    setIsLoading(true);
    const { user } = await signUp({ email, password });
    await Promise.all([updateProfile(user, { displayName: username }), uploadProfilePicture(avatar, user)]);
    notifySuccess("Bienvenue sur Otapix 🎉");
    router.push("/");
  } catch (error) {
    handleError(error, RequestNames.REGISTER);
  } finally {
    setIsLoading(false);
  }
}
