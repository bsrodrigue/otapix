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

export default function Header() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
                <Avatar src={user.photoURL} width={50} height={50} onClick={() => setModalIsOpen(true)} />
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={() => setModalIsOpen(false)}
                  ariaHideApp={false}
                  style={{
                    content: {
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "2em 1.5em 1.5em 1.5em",
                      margin: "-2em",
                      borderRadius: "2em",
                      textAlign: "center",
                    },
                  }}
                >
                  <div style={{ position: "relative", width: "100%" }}>
                    <IconButton onClick={() => setModalIsOpen(false)} />
                    <Avatar width={150} height={150} src={user.photoURL} />
                    <p className={style.modal_username}>{user.displayName}</p>
                    <small className={style.modal_email}>{user.email}</small>


                  </div>

                  <div className={style.modal_actions}>
                    <Link href="/profile/dashboard">
                      <a className={` ${style.modal_action}`}>Tableau de bord</a>
                    </Link>
                    <Link href="">
                      <a
                        onClick={() => {
                          signOut(auth);
                        }}
                        className={` ${style.modal_action}`}
                      >
                        Deconnexion
                      </a>
                    </Link>
                  </div>
                </Modal>
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
