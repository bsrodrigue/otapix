import style from "./PackCard.module.css";
import { BsFillStarFill } from "react-icons/bs";

export default function PackCard() {
  return (
    <div className={style.packcard_container}>
      <img
        className={style.packcard_cover}
        src="/img/packcard-cover.jpg"
        alt="Pack cover"
      />
      <div className={style.packcard_content}>
        <div className={style.packcard_infos}>
          <div>
            <p className={style.packcard_title}>Geass Pack</p>
            <small className={style.packcard_author}>
              by &nbsp;
              <span>doomer_coder</span>
            </small>
            <p className={style.packcard_puzzle_count}>
              32
              <span> puzzles</span>
            </p>
            <div className={style.packcard_rating}>
              {[1, 2, 3, 4, 5].map((item: any, key: number) => (
                <BsFillStarFill key={key} />
              ))}
            </div>
          </div>
          <div className={style.packcard_level}>S</div>
        </div>
        <div className={style.packcard_actions}>
          <button className={style.packcard_action}>Play</button>
          <button className={style.packcard_action}>Add to collection</button>
          <button className={style.packcard_action}>Rate</button>
        </div>
      </div>
    </div>
  );
}
