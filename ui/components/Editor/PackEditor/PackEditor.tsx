import { useState } from 'react';
import { RectangularDropzone } from '../../Dropzone/RectangularDropzone';
import { DifficultyRadioGroup } from '../../RadioGroup/DifficultyRadioGroup';
import style from './PackEditor.module.css';

const DIFFICULTIES = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
export default function PackEditor() {
    const [checkedDifficulty, setCheckedDifficulty] = useState<string>(DIFFICULTIES[0]);
    return (
        <div className={style.container}>
            <p>Couverture</p>
            <RectangularDropzone
                label='Telecharger une image'
            />
            <p>Titre</p>
            <input
                className={style.title_input}
                type="text"
                placeholder='Trouvez un titre pour votre pack...' />
            <p>Difficulte</p>
            <small>Veuillez choisir une difficulte pour votre pack</small>
            <DifficultyRadioGroup
                difficulties={DIFFICULTIES}
                checkedDifficulty={checkedDifficulty}
                setCheckedDifficulty={setCheckedDifficulty} />
        </div>
    );
}