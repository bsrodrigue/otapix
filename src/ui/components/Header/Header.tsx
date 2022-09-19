import style from "./Header.module.css";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";
import Modal from "react-modal";
import { useAuth } from "../../../hooks/index";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { Avatar } from "../Avatar";
import { IconButton } from "../IconButton";
import { SpinnerButton } from "../Button/SpinnerButton";
import { headerLinks } from "../../../config/site";
import FullScreenModal from "../FullScreenModal/FullScreenModal";
import { UserProfileView } from "../../Views/UserProfileView";

export default function Header() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuth();

  return (
    <header className={style.header}>
      <div className="wrapper">
        <div className={style.header_content}>
          <Link href="/">
            <a className={style.header_logo}>Otapix</a>
          </Link>
          <div className={style.auth_links}>
            {headerLinks.map((link, key) => (
              <Link key={key} href={link.url}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Avatar
                  src={user.photoURL}
                  width={50}
                  height={50}
                  onClick={() => setModalIsOpen(true)}
                />
                {
                  isEditMode ? (
                    <FullScreenModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} >
                      <UserProfileView user={user} onCloseButtonClick={() => setModalIsOpen(false)} />
                    </FullScreenModal>
                  ) : (
                    <FullScreenModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} >
                      <UserProfileView user={user} onCloseButtonClick={() => setModalIsOpen(false)} />
                    </FullScreenModal>
                  )
                }
              </>
            ) : (
              user !== undefined && (
                <>
                  <Link href="/auth/login">Login</Link>
                  <Link href="/auth/register">Register</Link>
                </>
              )
            )}
          </div>
        </div>
      </div>

      <div className="wrapper">
        <div className={style.search_form}>
          <div className={style.search_form_content}>
            <input
              className={style.search_form_input}
              type="text"
              name="search"
              id=""
              placeholder="Search for an otapix pack..."
            />
            <div className={`${style.search_form_button} material-shadow`}>
              <BsSearch />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
