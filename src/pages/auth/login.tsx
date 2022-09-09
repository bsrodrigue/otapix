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
  const [doSignIn, signInIsLoading] = useApi<typeof signIn, void>(
    signIn,
    RequestNames.LOGIN,
    () => router.push("/")
  );

  return (
    <div className="auth-page">
      <AuthForm
        id="login-form"
        title="Login"
        comment="Welcome back to otapix 🥳"
        isLoading={signInIsLoading}
        subComment="Please enter your login informations"
        message={["Forgot your password?", "/auth/reset_password"]}
        alternative={["Don't have an account?", "Register!", "/auth/register"]}
        onSubmit={handleSubmit(async (data: FieldValues) => {
          await doSignIn({
            email: data.email,
            password: data.password,
          });
        })}
      >
        {loginFormFields.map((field: FormField, key: number) => (
          <AuthFormField
            key={key}
            register={register}
            errors={errors}
            {...field}
          />
        ))}
      </AuthForm>
    </div>
  );
}
