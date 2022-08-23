import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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
import { FirebaseError } from "firebase/app";

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

const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});


export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
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
          if (!avatar) {
            toast("Veuillez ajouter une photo de profil", { type: "error" });
            return;
          }
          const username = data.username;
          const { email, password } = data;
          try {
            setIsLoading(true);
            const { user } = await signUp({ email, password });
            await Promise.all([
              updateProfile(user, { displayName: username, }),
              uploadProfilePicture(avatar, user),
            ])
            toast("Bienvenue sur Otapix 🎉", { type: "success" });
            router.push("/");
          } catch (error) {
            if (error instanceof FirebaseError) {
              if (error.code === "auth/email-already-in-use") {
                toast("Cet email est deja utilise!", { type: "error" });
              } else {
                toast(`Erreur lors de la connexion: ${error.code}`, { type: "error" });
              }
              console.error(error.code);
            }
          } finally {
            setIsLoading(false);
          }
        }, (e) => console.log(e))}
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
              errors={errors}
              {...field}
            />
          ))
        }
      </AuthForm >
    </div>
  );
}
