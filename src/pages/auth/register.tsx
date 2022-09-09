import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";
import { submitRegister } from "../../api/app";
import { useApi } from "../../hooks/useApi";
import { RequestNames } from "../../lib/errors";
import { registerFormFields } from "../../lib/forms/auth/fields";
import { registerSchema } from "../../lib/forms/auth/validationSchemas";
import { FormField } from "../../types";
import { AuthForm } from "../../ui/components/";
import { CircularDropzone } from "../../ui/components/Dropzone/CircularDropzone";
import { AuthFormField } from "../../ui/components/Form/Field/AuthFormField";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });
  const avatarRegister = register("avatar");
  const [doRegister, registerIsLoading] = useApi(
    submitRegister,
    RequestNames.REGISTER,
    () => router.push("/")
  );
  const router = useRouter();

  return (
    <div className="auth-page">
      <AuthForm
        id="register-form"
        title="Registration"
        comment="Welcome to otapix 🥳"
        isLoading={registerIsLoading}
        subComment="Please, fill those fields to create an account"
        alternative={["Already have an account?", "Login!", "/auth/login"]}
        onSubmit={handleSubmit(
          async (data: FieldValues) => await doRegister(data)
        )}
      >
        <CircularDropzone label="Avatar" {...avatarRegister} />
        {registerFormFields.map((field: FormField, key: number) => (
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
