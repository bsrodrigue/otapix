import { Difficulty } from '../../../../enums';
import { UseDifficultyState } from '../../../../types';
import DifficultyRadio from '../../Radio/DifficultyRadio/DifficultyRadio';
import style from './DifficultyRadioGroup.module.css';

interface DifficultyRadioGroupProps extends UseDifficultyState {
    difficulties?: Difficulty[];
}

const baseDifficulties = Object.values(Difficulty);

export default function DifficultyRadioGroup({ difficulties, ...rest }: DifficultyRadioGroupProps) {
    difficulties = difficulties || baseDifficulties;
    return (
        <div className={style.difficulty_radio_group}>
            {
                difficulties.map((difficulty: string, key: number) => (
                    <DifficultyRadio
                        key={key}
                        difficulty={difficulty}
                        {...rest}
                    />
                ))
            }
        </div>
    )
}