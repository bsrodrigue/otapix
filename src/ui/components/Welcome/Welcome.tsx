import { SpinnerButton } from "../Button/SpinnerButton";
import Tilt from "react-tilt";
import style from "./Welcome.module.css";
import Link from "next/link";

export default function Welcome() {
  return (
    <div className={style.container}>
      <div className="wrapper">
        <h1 className={`${style.welcome}`}>Otapix</h1>
        <h3>
          Inspiré du célèbre jeu mobile <span className={style.span}>4 Images 1 Mot</span>{" "}
        </h3>
        <div className={style.description}>
          <div className={style.description_left}>
            <h1>Les règles du jeu sont hyper simples 😄</h1>
            <h1>Devine le bon mot ou le nom du personnage!</h1>
            <h3>OU encore... 🌚</h3>
            <h1>Crée et partage tes propres niveaux! (packs)</h1>
            <div style={{ display: "flex", gap: "1em" }}>
              <SpinnerButton text="Jouer à un pack" style={{ height: "5em" }} />
              <SpinnerButton text="Créer mon propre pack" style={{ height: "5em" }} />
            </div>
          </div>
          <div>
            <Tilt data-tilt>
              <div style={{ position: "relative", height: "30em" }}>
                <img
                  style={{ position: "absolute", left: "3em", transform: "rotate(10deg)" }}
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
          <Link className="primary" href="https://github.com/bsrodrigue">
            Miyamoto Moosashee
          </Link>
        </h1>
      </div>
    </div>
  );
}
