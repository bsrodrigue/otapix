import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { signIn } from "../../api/firebase";
import { FormField } from "../../types";
import { AuthForm } from "../../ui/components/";
import { AuthFormField } from "../../ui/components/Form/Field/AuthFormField";
import { FirebaseError } from "firebase/app";

const formFields: Array<FormField> = [
  {
    label: "Adresse mail",
    placeholder: "Entrez votre adresse mail",
    type: "mail",
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
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="auth-page">
      <AuthForm
        id="login-form"
        title="Connexion"
        comment="Bon retour sur Otapix"
        isLoading={isLoading}
        subComment="Veuillez renseigner les informations de votre compte pour vous connecter"
        message={["Vous avez oublie votre mot de passe?", "/auth/reset_password"]}
        alternative={["Vous n'avez pas de compte?", "Inscrivez-vous!", "/auth/register"]}
        onSubmit={handleSubmit(async (data: FieldValues) => {
          try {
            const { email, password } = data;
            setIsLoading(true);
            await signIn({ email, password });
            toast("Bon retour sur Otapix 🎉", { type: "success" });
            router.push("/");
          } catch (error) {
            if (error instanceof FirebaseError) {
              if (error.code === "auth/user-not-found") {
                toast("Cet utilisateur n'existe pas!", { type: "error" });
              } else {
                toast(`Erreur lors de la connexion: ${error.code}`, { type: "error" });
              }
              console.error(error.code);
            }

          } finally {
            setIsLoading(false);
          }
        }, (e) => { console.log(e) })}
      >
        {
          formFields.map((field: FormField, key: number) => (
            <AuthFormField
              key={key}
              register={register}
              errors={errors}
              {...field} />
          ))
        }
      </AuthForm >
    </div >
  );
}
