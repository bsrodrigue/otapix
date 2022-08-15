import { useState, useEffect, useRef } from 'react';
import { Difficulty } from '../../../../enums';
import { PuzzlePack } from '../../../../types';
import { RectangularDropzone } from '../../Dropzone/RectangularDropzone';
import { DifficultyRadioGroup } from '../../RadioGroup/DifficultyRadioGroup';
import style from './PackEditor.module.css';

interface PackEditorProps {
    currentPack: PuzzlePack;
}
const difficulties = Object.values(Difficulty) as string[];

export default function PackEditor({ currentPack }: PackEditorProps) {
    const [checkedDifficulty, setCheckedDifficulty] = useState<any>(Difficulty.F);
    const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);

    useEffect(() => {
        setCheckedDifficulty(currentPack.difficulty);
    }, [currentPack]);

    return (
        <div className={style.container}>
            <p>Couverture</p>
            <RectangularDropzone
                label='Telecharger une image'
                name='pack-cover'
                src={currentPack.cover}
            />
            <p>Titre</p>
            <input
                className={style.title_input}
                type="text"
                placeholder='Trouvez un titre pour votre pack...'
                value={currentPack?.title}
            />
            <p>Difficulte</p>
            <small>Veuillez choisir une difficulte pour votre pack</small>
            <DifficultyRadioGroup
                difficulties={difficulties}
                checkedDifficulty={checkedDifficulty}
                setCheckedDifficulty={setCheckedDifficulty} />


            {
                puzzleEditorIsOpen && (
                    <div className={style.puzzle_editor_container}>
                        <div className={style.puzzle_editor}>
                            <p>Images</p>
                            <small>Placez les images d'indices</small>
                            <div className={style.puzzle_editor_picture_fields}>
                                {
                                    [1, 2, 3, 4].map((value, key) => (
                                        <RectangularDropzone
                                            key={key}
                                            name={`puzzle-pic-${value}`}
                                            isSquare
                                        />
                                    ))
                                }
                            </div>

                            <p>Nom a deviner</p>
                            <input
                                className={style.title_input}
                                type="text"
                                placeholder='Entrez le nom que les joueurs doivent deviner...'
                            />
                            <button className={`${style.action} success`}>Ajouter</button>
                            <button onClick={() => {
                                setPuzzleEditorIsOpen(false)
                                document.getElementById("puzzle-grid-container")?.scrollIntoView({ behavior: 'smooth' });
                            }} className={`${style.action} danger`}>Annuler</button>
                        </div>
                    </div>
                )
            }


            <p>Liste de puzzle</p>
            <div id='puzzle-grid-container' className={style.puzzle_grid_container}>
                <div className={style.puzzle_grid}>
                    {
                        currentPack.puzzles.map((puzzle, key) => {

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
                <div className={style.puzzle_grid_actions}>
                    <button onClick={() => { setPuzzleEditorIsOpen(true) }} className={`${style.action} success`}>Ajouter un puzzle</button>
                </div>
            </div>
        </div>
    );
}