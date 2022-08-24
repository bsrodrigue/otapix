import { FormField } from "../../types/form";
import { AuthForm } from "../../ui/components/";
import { AuthFormField } from "../../ui/components/Form/Field/AuthFormField";

const formFields: Array<FormField> = [
  {
    label: "Nouveau mot de passe",
    placeholder: "Entrez votre nouveau mot de passe",
    type: "password",
    name: "password1",
  },
  {
    label: "Confirmation",
    placeholder: "Entrez a nouveau votre mot de passe",
    type: "password",
    name: "password2",
  },

]

export default function ResetPasswordPage() {
  return (
    <div className="auth-page">
      <AuthForm title="Reinitialisation de mot de passe"
        subComment="Remplissez les champs ci-dessous pour remplacer votre mot de passe"
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
