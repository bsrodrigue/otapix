import { Puzzle } from "../../../../types";
import { PuzzleCard } from "../../Card/PuzzleCard";
import { Grid } from "../Grid";
import style from "./PuzzleGrid.module.css";

interface PuzzleGridProps {
  puzzles: Array<Puzzle>;
}

export default function PuzzleGrid({ puzzles }: PuzzleGridProps) {
  return (
    <Grid className={style.container}>
      {puzzles?.map((puzzle, key) => {
        return (
          <PuzzleCard
            key={key}
            title={puzzle.word}
            pictures={puzzle.pictures}
          />
        );
      })}
    </Grid>
  );
}
