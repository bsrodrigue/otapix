import { Puzzle } from '../../../../types';
import style from './PuzzleGrid.module.css';

interface PuzzleGridProps {
    puzzles: Array<Puzzle>;
}

export default function PuzzleGrid({ puzzles }: PuzzleGridProps) {

    return (
        <div id='puzzle-grid-container' className={style.puzzle_grid_container}>
            <div className={style.puzzle_grid}>
                {
                    puzzles.map((puzzle, key) => {
                        return (<div
                            key={key}
                            className={style.puzzle_card}>
                            <div className={style.puzzle_card_pictures}>
                                {
                                    puzzle.pictures.map((picture, key) => (
                                        <img key={key} src={picture} />
                                    ))
                                }
                            </div>
                            <p className={style.puzzle_card_title}>{puzzle.word}</p>
                        </div>)
                    })
                }
            </div>
        </div>
    )
}