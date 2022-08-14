import { ReactNode } from 'react';
import { TailSpin } from 'react-loader-spinner';
import style from './AuthForm.module.css';

export interface AuthFormProps {
    id?: string;
    title?: string;
    comment?: string;
    subComment?: string;
    children?: ReactNode;
    message?: string[];
    alternative?: string[];
    onSubmit?: (e: any) => void;
    isLoading?: boolean;
}

export default function AuthfForm({
    id,
    title,
    comment,
    subComment,
    children,
    message,
    alternative,
    onSubmit,
    isLoading,
}: AuthFormProps) {

    return (
        <form
            id={id}
            className={style.authform_container}
            onSubmit={onSubmit}
            method="POST"
        >
            <div className={style.authform_header}>
                <h1>{title}</h1>
                <p>{comment}</p>
                <small>{subComment}</small>
            </div>
            <div className={style.authform_fields}>
                {children}
            </div>
            <div className={style.authform_footer}>
                <a href={message?.[1]}>
                    <small className={style.authform_message}>{message?.[0]}</small>
                </a>
                <button type="submit" className={`${style.authform_submit} ${isLoading && style.loading}`}>
                    {isLoading ? <TailSpin color='white' /> : "Valider"}
                </button>
                <a className={style.authform_alternative} href={alternative?.[2]}>
                    {alternative?.[0]}<span className='primary-color'>&nbsp;{alternative?.[1]}</span>
                </a>
            </div>
        </form>
    );

}