import { BsPen, BsTrash } from 'react-icons/bs';
import { Puzzle } from '../../../../types';
import style from './PuzzleCard.module.css';

interface PuzzleCardProps {
  puzzle: Puzzle;
  title: string;
  pictures: Array<string>;
  onDelete: (puzzle: Puzzle) => void;
  onEdit: (puzzle: Puzzle) => void;
}

export default function PuzzleCard({ puzzle, title, pictures, onDelete, onEdit }: PuzzleCardProps) {
  return (
    <div className={style.puzzle_card}>
      <div className={style.puzzle_card_pictures}>
        {pictures?.map((picture, key) => (
          <img key={key} src={picture} />
        ))}
      </div>
      <p className={style.puzzle_card_title}>{title}</p>

      <div className={style.actions}>
        <button
          onClick={() => {
            onDelete(puzzle);
          }}
          type="button"
        >
          <BsTrash />
        </button>
        <button
          onClick={() => {
            onEdit(puzzle);
          }}
          type="button"
        >
          <BsPen />
        </button>
      </div>
    </div>
  );
}
