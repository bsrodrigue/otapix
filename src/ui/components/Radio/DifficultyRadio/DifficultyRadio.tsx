import { UseDifficultyState } from '../../../../types';
import style from './DifficultyRadio.module.css';

interface DifficultyRadioProps extends UseDifficultyState {
    difficulty: string;
}

export default function DifficultyRadio({
    difficulty,
    checkedDifficulty,
    setCheckedDifficulty
}: DifficultyRadioProps) {
    const isChecked = difficulty === checkedDifficulty;

    function onClickLabel(e: any) {
        setCheckedDifficulty(e.target.value);
    }

    return (
        <label
            // onClick={onClickLabel}
            htmlFor={`difficulty-${difficulty}`}
            className={`${style.difficulty_radio_container} ${isChecked && style.checked}`}
        >
            {difficulty}
            <input onChange={(e: any) => {
                onClickLabel(e);
            }} id={`difficulty-${difficulty}`}
                type="radio"
                name="difficulty"
                value={difficulty}
                hidden />
        </label>
    )
}