import style from './AuthForm.module.css';

export default function AuthfForm() {

    return (
        <div className={style.authform_container}>

            <div className={style.authform_header}>
                <h1>Login</h1>
                <p>Welcome back to Otapix</p>
                <small>
                    Please, provide account credentials to log in
                </small>
            </div>

            <div className={style.authform_fields}>
                <div className={style.authform_field_container}>
                    <label className={style.authform_label} htmlFor="">Username</label>
                    <input className={style.authform_field} type="text" />
                </div>
                <div className={style.authform_field_container}>
                    <label className={style.authform_label} htmlFor="">Username</label>
                    <input className={style.authform_field} type="text" />
                </div>
            </div>

            <small className={style.authform_message}>Cannot log in?</small>

            <button className={style.authform_submit} >Submit</button>

            <a className={style.authform_alternative} href="">
                Don't have an account? <span className='primary-color'>Register</span>
            </a>
        </div>
    );

}