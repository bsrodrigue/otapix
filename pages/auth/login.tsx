import { useRouter } from "next/router";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { signIn } from "../../api/firebase";
import { FormField } from "../../types";
import { AuthForm } from "../../ui/components/";
import { AuthFormField } from "../../ui/components/Form/Field/AuthFormField";

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

export default function LoginPage() {
    const { register, handleSubmit } = useForm();
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
                        toast("Bienvenue!");
                        router.push("/");
                    } catch (error) {
                        toast("Error while signup");
                        console.error(error);
                    } finally {
                        setIsLoading(false);
                    }
                })}
            >
                {
                    formFields.map((field: FormField, key: number) => (
                        <AuthFormField
                            key={key}
                            register={register}
                            {...field} />
                    ))
                }
            </AuthForm >
        </div >
    );
}