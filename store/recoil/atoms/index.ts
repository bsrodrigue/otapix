import { atom } from 'recoil';

const defaultUserState: {
    username?: string | null;
    avatar?: string | null;
    email?: string | null;
} = {
    username: '',
    avatar: '',
    email: '',
}

export const userState = atom({
    key: "USER_STATE",
    default: defaultUserState,
});

