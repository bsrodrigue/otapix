import { FormField } from "../../types";
import { AuthForm } from "../../ui/components/";
import { AuthFormField } from "../../ui/components/Form/Field/AuthFormField";

const formFields: Array<FormField> = [
    {
        label: "Nom d'utilisateur",
        placeholder: "Entrez votre nom d'utilisateur",
        type: "text",
        name: "username",
    },
    {
        label: "Mot de passe",
        placeholder: "Entrez votre mot de passe",
        type: "password",
        name: "password",
    },

]

export default function ChangePasswordPage() {
    return (
        <div className="auth-page">
            <AuthForm title="Connexion"
                comment="Bon retour sur Otapix"
                subComment="Veuillez renseigner les informations de votre compte pour vous connecter"
                alternative={["Vous n'avez pas de compte?", "Inscrivez-vous!", "/auth/register"]}
            >
                {
                    formFields.map((field: FormField, key: number) => (
                        <AuthFormField key={key} {...field} />
                    ))
                }
            </AuthForm >
        </div>
    );
}