import { onAuthStateChanged, User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { createUserProfile, getUserProfile } from "../api/firebase";
import { anonymousUsername } from "../config/auth";
import { auth } from "../config/firebase";
import { UserProfile } from "../types";

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const setupUserProfile = useCallback(async (user: User) => {
    const result = await getUserProfile(user.uid);

    if (!result) {
      const profile: UserProfile = {
        userId: user.uid,
        username: user.displayName || anonymousUsername,
        email: user.email || "",
        avatar: user.photoURL || "",
      };
      createUserProfile(profile);
    }

  }, [])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setupUserProfile(user);
      } else {
        setUser(null);
      }
    });
  }, [setupUserProfile]);

  return {
    user,
  };
}
