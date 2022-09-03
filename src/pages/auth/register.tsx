import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { registerFormFields } from "../../lib/forms/auth/fields";
import { submitRegister } from "../../lib/forms/auth/submit";
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
          submitRegister(
            {
              avatar: data.avatar[0],
              username: data.username,
              email: data.email,
              password: data.password,
            },
            setIsLoading,
            router,
          );
        })}
      >
        <CircularDropzone label="Photo de profil" {...avatarRegister} />
        {registerFormFields.map((field: FormField, key: number) => (
          <AuthFormField key={key} register={register} errors={errors} {...field} />
        ))}
      </AuthForm>
    </div>
  );
}
