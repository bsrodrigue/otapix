import { SpinnerButton } from "../Button/SpinnerButton";
import Tilt from "react-tilt";
import style from "./Welcome.module.css";
import Link from "next/link";
import { useAuth } from "../../../hooks";

export default function Welcome() {
  const { user } = useAuth();
  return (
    <div className={style.container}>
      <div className="wrapper">
        <h1 className={`${style.welcome}`}>Otapix</h1>
        <h3>
          Inspiré du célèbre jeu mobile{" "}
          <Link href="https://play.google.com/store/apps/details?id=de.lotum.whatsinthefoto.us&hl=en&gl=US">
            <a className={style.span}>4 Images 1 Mot</a>
          </Link>{" "}
        </h3>
        <div className={style.description}>
          <div className={style.description_left}>
            <h1>Les règles du jeu sont simples 😄</h1>
            <h1>Devine le bon mot ou le nom du personnage!</h1>
            <h1>Crée et partage tes propres niveaux!</h1>
            <div className={style.call_to_action}>
              <Link href="#recommendations">
                <SpinnerButton
                  type="error"
                  text="Jouer à un pack"
                  style={{ height: "5em" }}
                />
              </Link>
              <Link href={user ? "/profile/dashboard" : "/auth/login"}>
                <SpinnerButton
                  text="Créer mon propre pack"
                  style={{ height: "5em" }}
                />
              </Link>
            </div>
          </div>
          <div>
            <Tilt data-tilt>
              <div className={style.phones}>
                <img
                  style={{
                    position: "absolute",
                    left: "3em",
                    transform: "rotate(10deg)",
                  }}
                  height={500}
                  src="img/otapix-phone-2.png"
                  alt=""
                />
                <img height={500} src="img/otapix-phone.png" alt="" />
              </div>
            </Tilt>
          </div>
        </div>
        <h1>
          Fait avec 🔥 par{" "}
          <Link href="https://github.com/bsrodrigue">
            <a className="primary">Miyamoto Moosashee</a>
          </Link>
        </h1>
      </div>
    </div>
  );
}
