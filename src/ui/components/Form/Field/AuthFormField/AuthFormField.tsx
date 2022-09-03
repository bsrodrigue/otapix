import { UseFormRegister } from "react-hook-form";
import { FieldValues } from "react-hook-form";
import style from "./AuthFormField.module.css";

export interface AuthFormFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  className?: string;
  register?: UseFormRegister<FieldValues>;
  errors?: any;
}

export default function AuthFormField({
  label,
  placeholder,
  type,
  name,
  className,
  register,
  errors,
}: AuthFormFieldProps) {
  return (
    <div className={style.authform_field_container}>
      <label className={style.authform_label} htmlFor="">
        {label}
      </label>
      <input
        name={name}
        placeholder={placeholder}
        className={`${style.authform_field} ${className}`}
        type={type}
        {...register?.(name!)}
      />
      <small className={style.authform_field_error}>{errors[name!]?.message}</small>
    </div>
  );
}
