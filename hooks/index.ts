import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase/auth";

export function useAuth() {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user);
                setUser(user);
            } else {
                setUser(null);
            }
        })
    }, [])

    return {
        user,
    };
}