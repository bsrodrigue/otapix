import style from './Header.module.css';
import { BsSearch } from 'react-icons/bs';
import Link from 'next/link';
import { useAuth } from '../../../hooks/index';

export default function Header() {
    const { user } = useAuth();

    return (
        <header className={style.header}>
            <div className='wrapper'>
                <div className={style.header_content}>
                    <Link href="/">
                        <a className={style.header_logo}>Otapix</a>
                    </Link>
                    <div className={style.auth_links}>
                        {
                            user ? (
                                <img className={`${style.avatar} material-shadow`} src={user.photoURL}>
                                </img>
                            ) : (
                                <>
                                    <Link href="/auth/login">Login</Link>
                                    <Link href="/auth/register">Register</Link>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>

            <div className={style.search_form}>
                <div className={style.search_form_content}>
                    <input className={style.search_form_input} type="text" name="search" id="" placeholder='Search for an otapix pack...' />
                    <div className={`${style.search_form_button} material-shadow`}>
                        <BsSearch />
                    </div>
                </div>
            </div>
        </header >
    )
}