import { signOut, User } from "firebase/auth";
import Link from "next/link";
import { auth } from "../../../config/firebase";
import { Avatar } from "../../components/Avatar";
import { SpinnerButton } from "../../components/Button/SpinnerButton";
import { IconButton } from "../../components/IconButton";
import style from "./UserProfileView.module.css";

interface UserProfileViewProps {
    user: User;
    onCloseButtonClick: () => void;
}

export default function UserProfileView({ user, onCloseButtonClick }: UserProfileViewProps) {
    return (
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <IconButton onClick={onCloseButtonClick} />
                <Avatar width={150} height={150} src={user.photoURL} />
                <p className={style.username}>{user.displayName}</p>
                <small className={style.email}>{user.email}</small>
            </div>

            <div style={{ width: "100%" }}>
                <SpinnerButton text="Edit my profile" />
                <div className={style.actions}>
                    <SpinnerButton
                        type="error"
                        onClick={() => signOut(auth)}
                        text="Logout"
                    />
                    <Link href="/profile/dashboard">
                        <SpinnerButton text="Dashboard" />
                    </Link>
                </div>
            </div>
        </>
    )
}