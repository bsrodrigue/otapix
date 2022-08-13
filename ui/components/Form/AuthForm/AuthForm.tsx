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
                    <label className={style.authform_label} htmlFor="">Email</label>
                    <input placeholder='Enter your email address' className={style.authform_field} type="text" />
                </div>
                <div className={style.authform_field_container}>
                    <label className={style.authform_label} htmlFor="">Password</label>
                    <input placeholder='Enter your password' className={style.authform_field} type="text" />
                </div>
            </div>


            <div className={style.authform_footer}>
                <small className={style.authform_message}>Cannot log in?</small>
                <button className={style.authform_submit} >Submit</button>
                <a className={style.authform_alternative} href="">
                    Don't have an account? <span className='primary-color'>Register</span>
                </a>
            </div>
        </div>
    );

}