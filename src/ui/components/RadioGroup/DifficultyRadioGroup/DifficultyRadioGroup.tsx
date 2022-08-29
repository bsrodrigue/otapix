import { Dispatch, SetStateAction } from 'react';
import { Difficulty } from '../../../../enums';
import DifficultyRadio from '../../Radio/DifficultyRadio/DifficultyRadio';
import style from './DifficultyRadioGroup.module.css';

interface DifficultyRadioGroupProps {
  difficulties?: Difficulty[];
  checkedDifficulty: Difficulty;
  setCheckedDifficulty: Dispatch<SetStateAction<Difficulty>>;
}

const baseDifficulties = Object.values(Difficulty);

export default function DifficultyRadioGroup({ difficulties, ...rest }: DifficultyRadioGroupProps) {
  difficulties = difficulties || baseDifficulties;
  return (
    <div className={style.difficulty_radio_group}>
      {difficulties.map((difficulty: string, key: number) => (
        <DifficultyRadio key={key} difficulty={difficulty} {...rest} />
      ))}
    </div>
  );
}
