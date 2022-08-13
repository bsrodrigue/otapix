import style from './AuthFormField.module.css';

export interface AuthFormFieldProps {
    label?: string;
    placeholder?: string;
    type?: string;
    name?: string;
    className?: string;
}

export default function AuthFormField({ label, placeholder, type, name, className }: AuthFormFieldProps) {
    return (
        <div className={style.authform_field_container}>
            <label className={style.authform_label} htmlFor="">{label}</label>
            <input name={name}
                placeholder={placeholder}
                className={`${style.authform_field} ${className}`}
                type={type} />
        </div>
    );
}