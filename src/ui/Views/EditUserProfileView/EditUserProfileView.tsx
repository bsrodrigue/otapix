import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from 'react-hook-form';
import { submitEditUserProfile } from "../../../api/app";
import { uploadProfilePicture } from "../../../api/firebase";
import { useApi } from "../../../hooks/useApi";
import { SpinnerButton } from "../../components/Button/SpinnerButton";
import { RectangularDropzone } from "../../components/Dropzone";
import { IconButton } from "../../components/IconButton";
import style from "./EditUserProfileView.module.css";

interface UserProfileViewProps {
    user: User;
    onCloseButtonClick: () => void;
    onCancelEditClick: () => void;
}

export default function EditUserProfileView({ user, onCloseButtonClick, onCancelEditClick }: UserProfileViewProps) {
    const methods = useForm();
    const { register, setValue, handleSubmit } = methods;
    const [isLoading, setIsLoading] = useState(false);
    const [doEditUserProfile] = useApi(submitEditUserProfile);

    useEffect(() => {
        if (user) {
            setValue("avatar", user.photoURL || "");
            setValue("username", user.displayName || "");
        }

    }, [user, setValue]);

    return (
        <FormProvider {...methods}>
            <div style={{ position: "relative", width: "100%" }}>
                <IconButton onClick={onCloseButtonClick} />
                <RectangularDropzone className={style.avatar} isSquare src={user.photoURL || ""} {...register("avatar")} />
                <input
                    type="text"
                    placeholder="Please enter your username"
                    className={style.username}
                    {...register("username")}
                />
                <small className={style.email}>{user.email}</small>
            </div>

            <div style={{ width: "100%" }}>
                <div className={style.actions}>
                    <SpinnerButton
                        type="error"
                        onClick={onCancelEditClick}
                        text="Cancel"
                        disabled={isLoading}
                    />
                    <SpinnerButton
                        onClick={handleSubmit(async (data) => {
                            let { username, avatar } = data;
                            setIsLoading(true);
                            if (avatar instanceof FileList) {
                                const file = avatar[0];
                                avatar = await uploadProfilePicture(file, user);
                            }
                            await doEditUserProfile(user, { username, avatar })
                            setIsLoading(false);
                        })}
                        buttonType="submit"
                        isLoading={isLoading}
                        text="Confirm" />
                </div>
            </div>
        </FormProvider>
    )
}