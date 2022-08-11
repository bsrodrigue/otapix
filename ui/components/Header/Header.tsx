import style from './Header.module.css';

export default function Header() {

    return (
        <header className={style.header}>
            <div className='wrapper'>
                <div className={style.header_content}>
                    <a href="">Otapix</a>

                    <div className={style.auth_links}>
                        <a href="">Login</a>
                        <a href="">Register</a>
                    </div>
                </div>
            </div>

            <div className={style.search_form}>
                <input className={style.search_form_input} type="text" name="search" id="" placeholder='Search for an otapix pack...' />
            </div>
        </header>
    )
}