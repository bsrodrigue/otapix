import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";
import { submitSendPasswordResetEmail } from "../../api/app";
import { auth } from "../../config/firebase";
import { useApi } from "../../hooks/useApi";
import { passwordForgotFormFields } from "../../lib/forms/auth/fields";
import { forgotPasswordSchema } from "../../lib/forms/auth/validationSchemas";
import { FormField } from "../../types";
import { AuthForm } from "../../ui/components/";
import { AuthFormField } from "../../ui/components/Form/Field/AuthFormField";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(forgotPasswordSchema) });
  const router = useRouter();
  const [doSendPasswordResetEmail, sendPasswordResetEmailIsLoading] = useApi(
    submitSendPasswordResetEmail,
    () => router.push("/auth/login")
  );

  return (
    <div className="auth-page">
      <AuthForm
        id="login-form"
        title="Password Reset"
        comment="Did you forget your password?"
        isLoading={sendPasswordResetEmailIsLoading}
        subComment="Do not worry, it happens to everyone. Please enter your email to receive a password reset link!"
        message={["Remember your password again?", "/auth/login"]}
        alternative={["Don't have an account?", "Register!", "/auth/register"]}
        onSubmit={handleSubmit(async (data: FieldValues) => {
          await doSendPasswordResetEmail(auth, data.email);
        })}
      >
        {passwordForgotFormFields.map((field: FormField, key: number) => (
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
