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
    return (
        <div className="auth-page">
            <AuthForm title="Inscription"
                comment="Bienvenue sur Otapix"
                subComment="Veuillez remplir les champs ci-dessous pour creer un compte"
                alternative={["Vous avez deja un compte?", "Connectez-vous!", "/auth/login"]}
            >
                <CircularDropzone
                    label="Photo de profil"
                    name="avatar" />
                {
                    formFields.map((field: FormField, key: number) => (
                        <AuthFormField key={key} {...field} />
                    ))
                }
            </AuthForm >
        </div>
    );
}