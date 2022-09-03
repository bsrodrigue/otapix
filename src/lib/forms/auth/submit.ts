import { updateProfile } from "firebase/auth";
import { NextRouter } from "next/router";
import { signIn, signUp, uploadProfilePicture } from "../../../api/firebase";
import { BooleanSetter, LoginParams, RegisterParams } from "../../../types";
import { handleError, RequestNames } from "../../errors";
import { notifySuccess } from "../../notifications";

export async function submitLogin(
  { email, password }: LoginParams,
  setIsLoading: BooleanSetter,
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
  setIsLoading: BooleanSetter,
  router: NextRouter,
) {
  try {
    const tasks: Array<Promise<string | void>> = [];
    setIsLoading(true);
    const { user } = await signUp({ email, password });
    avatar && tasks.push(uploadProfilePicture(avatar, user));
    await Promise.all([updateProfile(user, { displayName: username }), ...tasks]);
    notifySuccess("Bienvenue sur Otapix 🎉");
    router.push("/");
  } catch (error) {
    handleError(error, RequestNames.REGISTER);
  } finally {
    setIsLoading(false);
  }
}
