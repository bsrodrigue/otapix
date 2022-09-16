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
          Inpired from the famous &nbsp;
          <Link href="https://play.google.com/store/apps/details?id=de.lotum.whatsinthefoto.us&hl=en&gl=US">
            <a className={style.span}>4 Pictures 1 Word</a>
          </Link>{" "}
        </h3>
        <div className={style.description}>
          <div className={style.description_left}>
            <h1>The rules are simple 😄</h1>
            <h1>You just have to guess the correct word or name</h1>
            <h1>
              Or, create your own levels and share them with the community
            </h1>
            <div className={style.call_to_action}>
              <Link href="#recommendations">
                <SpinnerButton
                  type="error"
                  text="Play a pack"
                  style={{ height: "5em" }}
                />
              </Link>
              <Link href={user ? "/profile/dashboard" : "/auth/login"}>
                <SpinnerButton
                  text="Create my own pack"
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
          Built with 🔥 by{" "}
          <Link href="https://github.com/bsrodrigue">
            <a className="primary">Miyamoto Moosashee</a>
          </Link>
        </h1>
      </div>
    </div>
  );
}
