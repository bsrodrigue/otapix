import { ReactNode } from 'react';
import style from './AuthForm.module.css';

export interface AuthFormProps {
    title?: string;
    comment?: string;
    subComment?: string;
    children?: ReactNode;
    message?: string[];
    alternative?: string[];
}

export default function AuthfForm({ title, comment, subComment, children, message, alternative }: AuthFormProps) {

    return (
        <div className={style.authform_container}>

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
                <button className={style.authform_submit} >Valider</button>
                <a className={style.authform_alternative} href={alternative?.[2]}>
                    {alternative?.[0]}<span className='primary-color'>&nbsp;{alternative?.[1]}</span>
                </a>
            </div>
        </div>
    );

}