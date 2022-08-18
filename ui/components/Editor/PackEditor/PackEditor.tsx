import { useState, useEffect } from 'react';
import { Difficulty } from '../../../../enums';
import { PuzzlePack } from '../../../../types';
import { RectangularDropzone } from '../../Dropzone/RectangularDropzone';
import { PuzzleGrid } from '../../Grid/PuzzleGrid';
import { DifficultyRadioGroup } from '../../RadioGroup/DifficultyRadioGroup';
import { PuzzleEditor } from '../PuzzleEditor';
import style from './PackEditor.module.css';

interface PackEditorProps {
  currentPack: PuzzlePack;
}

export default function PackEditor({ currentPack }: PackEditorProps) {
  const [checkedDifficulty, setCheckedDifficulty] = useState<any>(Difficulty.F);
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setCheckedDifficulty(currentPack.difficulty);
  }, [currentPack]);

  return (
    <>
      <p>Couverture</p>
      <RectangularDropzone
        label='Telecharger une image'
        name='pack-cover'
        src={currentPack.cover}
      />
      <p>Titre</p>
      <input
        type="text"
        placeholder='Trouvez un titre pour votre pack...'
        value={currentPack?.title}
      />
      <p>Difficulte</p>
      <small>Veuillez choisir une difficulte pour votre pack</small>
      <DifficultyRadioGroup
        checkedDifficulty={checkedDifficulty}
        setCheckedDifficulty={setCheckedDifficulty} />
      {puzzleEditorIsOpen
        ?
        (<PuzzleEditor isOpen={puzzleEditorIsOpen} setIsOpen={setPuzzleEditorIsOpen} />)
        :
        (
          <>
            <p>Liste de puzzle</p>
            <PuzzleGrid puzzles={currentPack.puzzles} />
            <button onClick={() => { setPuzzleEditorIsOpen(true) }} className={`${style.action} ${style.success}`}>Ajouter un puzzle</button>
          </>
        )
      }
      <button style={{ marginTop: '1em' }} className={`${style.action}`}>Sauvegarder le pack</button>
    </>
  );
}
