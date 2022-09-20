import Link from "next/link";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { headerLinks } from "../../../config/site";
import { useAuth } from "../../../hooks/index";
import EditUserProfileView from "../../Views/EditUserProfileView/EditUserProfileView";
import { UserProfileView } from "../../Views/UserProfileView";
import { Avatar } from "../Avatar";
import FullScreenModal from "../FullScreenModal/FullScreenModal";
import style from "./Header.module.css";

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
                      <EditUserProfileView
                        user={user}
                        onCancelEditClick={() => setIsEditMode(false)}
                        onCloseButtonClick={() => setModalIsOpen(false)}
                      />
                    </FullScreenModal>
                  ) : (
                    <FullScreenModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} >
                      <UserProfileView
                        user={user}
                        onEditProfileClick={() => setIsEditMode(true)}
                        onCloseButtonClick={() => setModalIsOpen(false)} />
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
        {headerLinks.map((link, key) => (
          <Link key={key} href={link.url}>
            <a className={style.header_link}>
              {link.label}
            </a>
          </Link>
        ))}
      </div>
    </header>
  );
}
