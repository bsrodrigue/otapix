import { signOut, User } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { Avatar } from "../../components/Avatar";
import { SpinnerButton } from "../../components/Button/SpinnerButton";
import { IconButton } from "../../components/IconButton";
import style from "./EditUserProfileView.module.css";

interface UserProfileViewProps {
    user: User;
    onCloseButtonClick: () => void;
    onCancelEditClick: () => void;
}

export default function EditUserProfileView({ user, onCloseButtonClick, onCancelEditClick }: UserProfileViewProps) {
    return (
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <IconButton onClick={onCloseButtonClick} />
                <Avatar width={150} height={150} src={user.photoURL} />
                <p className={style.username}>{user.displayName}</p>
                <small className={style.email}>{user.email}</small>
            </div>

            <div style={{ width: "100%" }}>
                <div className={style.actions}>
                    <SpinnerButton
                        type="error"
                        onClick={onCancelEditClick}
                        text="Cancel"
                    />
                    <SpinnerButton text="Confirm" />
                </div>
            </div>
        </>
    )
}