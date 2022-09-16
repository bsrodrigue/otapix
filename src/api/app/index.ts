import {
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { FieldValues } from "react-hook-form";
import { Difficulty } from "../../enums";
import { OtapixErrorCodes, RequestNames } from "../../lib/errors";
import { PackCreationError } from "../../lib/errors/classes";
import { LoginParams, Pack, Puzzle, Puzzles } from "../../types";
import {
  createPack,
  deletePack,
  deletePuzzle,
  getAllPacks,
  getPacksFromUser,
  signIn,
  signUp,
  uploadProfilePicture,
} from "../firebase";
interface SubmitCreatePackParams {
  pack: {
    title: string;
    authorId: string;
    difficulty: Difficulty;
  };
  cover: File;
}

// API Calls

export interface APICall<F extends (...args: any) => any> {
  call: (...args: Parameters<F>) => ReturnType<F>;
  requestName: RequestNames;
}

export const submitGetAllPacks: APICall<typeof getAllPacks> = {
  call: async () => {
    return await getAllPacks();
  },
  requestName: RequestNames.GET_ALL_PACKS,
};

export const submitGetUserPacks: APICall<typeof getPacksFromUser> = {
  call: async (uid: string) => {
    return await getPacksFromUser(uid);
  },
  requestName: RequestNames.GET_USER_PACKS,
};

export const submitSendVerificationMail: APICall<typeof sendEmailVerification> =
{
  call: async (user: User) => {
    await sendEmailVerification(user);
  },
  requestName: RequestNames.SEND_EMAIL_VERIFICATION,
};

export const submitRegister: APICall<(data: FieldValues) => void> = {
  call: async (data: FieldValues) => {
    const tasks: Array<Promise<string | void>> = [];
    const { email, password, username, avatar } = data;
    const { user } = await signUp({ email, password });

    tasks.push(sendEmailVerification(user));
    tasks.push(updateProfile(user, { displayName: username }));

    if (avatar instanceof FileList && avatar.length !== 0) {
      tasks.push(uploadProfilePicture(avatar[0], user));
    }
    await Promise.all(tasks);
  },

  requestName: RequestNames.REGISTER,
};

export const submitLogin: APICall<
  (params: LoginParams) => Promise<UserCredential>
> = {
  call: async (params: LoginParams) => {
    return await signIn(params);
  },

  requestName: RequestNames.LOGIN,
};

export const submitDeletePack: APICall<(pack: Pack) => void> = {
  call: async (pack: Pack) => {
    pack.online && (await deletePack(pack.id.toString()));
  },

  requestName: RequestNames.DELETE_PACK,
};

export const submitDeletePuzzle: APICall<(puzzle: Puzzle) => void> = {
  call: async (puzzle: Puzzle) => {
    puzzle?.online && (await deletePuzzle(puzzle.id));
  },

  requestName: RequestNames.DELETE_PUZZLE,
};

export const submitCreatePack: APICall<typeof createPack> = {
  call: async ({ pack, cover }: SubmitCreatePackParams) => {
    if (!pack.title) throw new PackCreationError(OtapixErrorCodes.NO_PACK_TITLE_PROVIDED);
    if (!pack.difficulty) throw new PackCreationError(OtapixErrorCodes.NO_PACK_DIFFICULTY_PROVIDED);
    if (!cover) throw new PackCreationError(OtapixErrorCodes.NO_COVER_PROVIDED);

    const result = await createPack({
      pack,
      cover,
    });

    return result;
  },

  requestName: RequestNames.CREATE_PACK,
};

export const submitSendPasswordResetEmail: APICall<
  (...params: Parameters<typeof sendPasswordResetEmail>) => void
> = {
  call: async (...params: Parameters<typeof sendPasswordResetEmail>) => {
    await sendPasswordResetEmail(...params);
  },
  requestName: RequestNames.SEND_PASSWORD_RESET_MAIL,
};
