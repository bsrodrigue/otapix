import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";
import { signIn } from "../../api/firebase";
import { useApi } from "../../hooks/useApi";
import { RequestNames } from "../../lib/errors";
import { loginFormFields } from "../../lib/forms/auth/fields";
import { loginSchema } from "../../lib/forms/auth/validationSchemas";
import { FormField } from "../../types";
import { AuthForm } from "../../ui/components/";
import { AuthFormField } from "../../ui/components/Form/Field/AuthFormField";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });
  const router = useRouter();
  const [doSignIn, signInIsLoading] = useApi(signIn, RequestNames.LOGIN, () => router.push("/"));

  return (
    <div className="auth-page">
      <AuthForm
        id="login-form"
        title="Connexion"
        comment="Bon retour sur Otapix"
        isLoading={signInIsLoading}
        subComment="Veuillez renseigner les informations de votre compte pour vous connecter"
        message={["Vous avez oublie votre mot de passe?", "/auth/reset_password"]}
        alternative={["Vous n'avez pas de compte?", "Inscrivez-vous!", "/auth/register"]}
        onSubmit={handleSubmit(async (data: FieldValues) => {
          await doSignIn({
            email: data.email,
            password: data.password,
          })
        })}
      >
        {loginFormFields.map((field: FormField, key: number) => (
          <AuthFormField key={key} register={register} errors={errors} {...field} />
        ))}
      </AuthForm>
    </div>
  );
}
