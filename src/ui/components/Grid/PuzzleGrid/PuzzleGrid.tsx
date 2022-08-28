import { Puzzle, Puzzles } from "../../../../types";
import { PuzzleCard } from "../../Card/PuzzleCard";
import { Grid } from "../Grid";
import style from "./PuzzleGrid.module.css";

interface PuzzleGridProps {
  puzzles: Puzzles;
  onDelete: (puzzle: Puzzle) => void;
  onEdit: (puzzle: Puzzle) => void;
}

export default function PuzzleGrid({ puzzles, onEdit, onDelete }: PuzzleGridProps) {
  return (
    <Grid className={style.container}>
      {puzzles?.map((puzzle, key) => {
        return (
          <PuzzleCard
            puzzle={puzzle}
            key={key}
            title={puzzle.word}
            pictures={puzzle.pictures}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        );
      })}
    </Grid>
  );
}
