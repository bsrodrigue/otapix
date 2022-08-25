/* eslint-disable @next/next/no-img-element */
import style from "./Header.module.css";
import { BsSearch } from "react-icons/bs";
import Link from "next/link";
import Modal from "react-modal";
import { useAuth } from "../../../hooks/index";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";

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
                <img
                  className={`${style.avatar} material-shadow`}
                  src={user.photoURL || ""}
                  onClick={(e: any) => {
                    e.preventDefault();
                    setModalIsOpen(!modalIsOpen);
                  }}
                  alt="avatar"
                />
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
                      padding: "3em 1.5em",
                      borderRadius: "2em",
                      border: "none",
                      boxShadow:
                        "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
                      textAlign: "center",
                    },
                  }}
                >
                  <div>
                    <img
                      className={`${style.avatar} ${style.modal_avatar}`}
                      src={user.photoURL || ""}
                      alt="avatar"
                    />
                    <p className={style.modal_username}>{user.displayName}</p>
                    <small>{user.email}</small>
                  </div>

                  <div className={style.modal_actions}>
                    <Link href="/profile/dashboard">
                      <a className={` ${style.modal_action}`}>
                        Tableau de bord
                      </a>
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
