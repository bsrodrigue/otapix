import { updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getUserProfiles, signUp, uploadProfilePicture } from "../../api/firebase";
import { FormField } from "../../types";
import { AuthForm } from "../../ui/components/";
import { CircularDropzone } from "../../ui/components/Dropzone/CircularDropzone";
import { AuthFormField } from "../../ui/components/Form/Field/AuthFormField";

const formFields: Array<FormField> = [
    {
        label: "Nom d'utilisateur",
        placeholder: "Entrez votre nom d'utilisateur",
        type: "text",
        name: "username",
    },
    {
        label: "Adresse mail",
        placeholder: "Entrez votre adresse mail",
        type: "email",
        name: "email",
    },
    {
        label: "Mot de passe",
        placeholder: "Entrez votre mot de passe",
        type: "password",
        name: "password",
    },
]


export default function RegisterPage() {
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const avatarRegister = register("avatar");
    const router = useRouter();

    return (
        <div className="auth-page">
            <AuthForm
                id="register-form"
                title="Inscription"
                comment="Bienvenue sur Otapix"
                isLoading={isLoading}
                subComment="Veuillez remplir les champs ci-dessous pour creer un compte"
                alternative={["Vous avez deja un compte?", "Connectez-vous!", "/auth/login"]}
                onSubmit={handleSubmit(async (data: FieldValues) => {
                    const avatar = data.avatar[0];
                    const username = data.username;
                    const { email, password } = data;
                    try {
                        setIsLoading(true);
                        const { user } = await signUp({ email, password });
                        await Promise.all([
                            updateProfile(user, { displayName: username, }),
                            uploadProfilePicture(avatar, user),
                        ])
                        toast("Bienvenue!");
                        router.push("/");
                    } catch (error) {
                        toast("Error while signup");
                        console.error(error);
                    } finally {
                        setIsLoading(false);
                        const result = await getUserProfiles();
                    }
                })}
            >
                <CircularDropzone
                    label="Photo de profil"
                    {...avatarRegister}
                />
                {
                    formFields.map((field: FormField, key: number) => (
                        <AuthFormField
                            key={key}
                            register={register}
                            {...field}
                        />
                    ))
                }
            </AuthForm >
        </div>
    );
}