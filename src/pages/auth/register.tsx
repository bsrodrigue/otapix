import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";
import { signUp, uploadProfilePicture } from "../../api/firebase";
import { RequestNames, useApi } from "../../lib/errors";
import { registerFormFields } from "../../lib/forms/auth/fields";
import { registerSchema } from "../../lib/forms/auth/validationSchemas";
import { FormField } from "../../types";
import { AuthForm } from "../../ui/components/";
import { CircularDropzone } from "../../ui/components/Dropzone/CircularDropzone";
import { AuthFormField } from "../../ui/components/Form/Field/AuthFormField";

async function submit(data: FieldValues) {
  const tasks: Array<Promise<string | void>> = [];
  const { user } = await signUp({ email: data.email, password: data.password });
  data.avatar && tasks.push(uploadProfilePicture(data.avatar, user));
  await Promise.all([updateProfile(user, { displayName: data.username }), ...tasks]);
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });
  const avatarRegister = register("avatar");
  const [doRegister, registerIsLoading] = useApi(submit, RequestNames.REGISTER, () => router.push("/"));
  const router = useRouter();

  return (
    <div className="auth-page">
      <AuthForm
        id="register-form"
        title="Inscription"
        comment="Bienvenue sur Otapix"
        isLoading={registerIsLoading}
        subComment="Veuillez remplir les champs ci-dessous pour creer un compte"
        alternative={["Vous avez deja un compte?", "Connectez-vous!", "/auth/login"]}
        onSubmit={handleSubmit(async (data: FieldValues) => await doRegister(data))}
      >
        <CircularDropzone label="Photo de profil" {...avatarRegister} />
        {registerFormFields.map((field: FormField, key: number) => (
          <AuthFormField key={key} register={register} errors={errors} {...field} />
        ))}
      </AuthForm>
    </div >
  );
}
