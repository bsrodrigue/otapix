import { UseFormRegister } from 'react-hook-form';
import style from './AuthFormField.module.css';
import { FieldValues } from 'react-hook-form';

export interface AuthFormFieldProps {
    label?: string;
    placeholder?: string;
    type?: string;
    name?: string;
    className?: string;
    register?: UseFormRegister<FieldValues>;
}


export default function AuthFormField({ label, placeholder, type, name, className, register }: AuthFormFieldProps) {
    return (
        <div className={style.authform_field_container}>
            <label className={style.authform_label} htmlFor="">{label}</label>
            <input
                name={name}
                placeholder={placeholder}
                className={`${style.authform_field} ${className}`}
                type={type}
                {...register?.(name!)}
            />
        </div>
    );
}