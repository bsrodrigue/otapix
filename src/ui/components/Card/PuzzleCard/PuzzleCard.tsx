import { BsPen, BsTrash } from "react-icons/bs";
import style from "./PuzzleCard.module.css";

interface PuzzleCardProps {
  title: string;
  pictures: Array<string>;
}

export default function PuzzleCard({ title, pictures }: PuzzleCardProps) {
  return (
    <div className={style.puzzle_card}>
      <div className={style.puzzle_card_pictures}>
        {pictures?.map((picture, key) => (
          <img key={key} src={picture} />
        ))}
      </div>
      <p className={style.puzzle_card_title}>{title}</p>

      <div className={style.actions}>
        <button type="button">
          <BsTrash />
        </button>
        <button type="button">
          <BsPen />
        </button>
      </div>
    </div>
  );
}
