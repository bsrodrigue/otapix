import DifficultyRadio from '../../Radio/DifficultyRadio/DifficultyRadio';
import style from './DifficultyRadioGroup.module.css';

interface DifficultyRadioGroupProps {
    difficulties: string[];
    checkedDifficulty: string;
    setCheckedDifficulty: Function;
}

export default function DifficultyRadioGroup({ difficulties, checkedDifficulty, setCheckedDifficulty }: DifficultyRadioGroupProps) {
    return (
        <div className={style.difficulty_radio_group}>
            {
                difficulties.map((difficulty: string, key: number) => (
                    <DifficultyRadio
                        key={key}
                        difficulty={difficulty}
                        checkedDifficulty={checkedDifficulty}
                        setCheckedDifficulty={setCheckedDifficulty} />
                ))
            }
        </div>
        )
}