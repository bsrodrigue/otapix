import { Dispatch, SetStateAction, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { addPuzzle, editPuzzle } from '../../../../api/firebase';
import { notifyError, notifySuccess } from '../../../../lib/notifications';
import { getSrcFromFile } from '../../../../lib/utils';
import { Puzzle } from '../../../../types';
import { Button } from '../../Button/Button';
import { SpinnerButton } from '../../Button/SpinnerButton';
import { RectangularDropzone } from '../../Dropzone';
import style from './PuzzleEditor.module.css';

interface PuzzleEditorProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function PuzzleEditor({ isOpen, setIsOpen }: PuzzleEditorProps) {
  const { setValue, watch, register } = useFormContext();
  const [puzzleOperationIsLoading, setPuzzleOperationIsLoading] = useState(false);
  const values = watch();

  function resetPictures() {
    for (let i = 0; i < 4; i++) {
      setValue(`puzzle-pic-${i + 1}`, '');
    }
  }

  async function extractImageFilesAsSrc() {
    const pictures: Array<string> = [];
    for (let i = 0; i < 4; i++) {
      const value = values[`puzzle-pic-${i + 1}`];
      if (!(value instanceof FileList) || value.length === 0) throw Error('Image(s) manquante(s)');
      const file: File = value[0];
      const result = await getSrcFromFile(file);
      pictures.push(result);
    }
    return pictures;
  }

  function onSuccess() {
    setValue('puzzle-editor-mode', 'none');
    resetPictures();
    setIsOpen?.(false);
  }

  async function createPuzzleFromInputs(id?: string): Promise<Puzzle> {
    const pictures = await extractImageFilesAsSrc();
    return {
      id: id || uuidv4(),
      packId: values.packId,
      word: values.puzzleTitle,
      pictures,
      online: false,
    };
  }

  return (
    <>
      {isOpen ? (
        <div className={style.container}>
          <p>Images d&apos;indices</p>
          <div className={style.picture_fields}>
            {[1, 2, 3, 4].map((value, key) => (
              <RectangularDropzone
                key={key}
                src={values[`puzzle-pic-${value}`]}
                multiple
                {...register(`puzzle-pic-${value}`)}
                isSquare
              />
            ))}
          </div>

          <p>Nom a deviner</p>
          <input
            className={style.title_input}
            type="text"
            placeholder="Entrez le nom que les joueurs doivent deviner..."
            value={values.puzzleTitle}
            {...register('puzzleTitle')}
          />
          <div style={{ display: 'flex', marginTop: '1em', gap: '1em' }}>
            <SpinnerButton type="error" buttonType="button" text="Annuler" onClick={() => setIsOpen?.(false)} />
            <SpinnerButton
              buttonType="button"
              text="Valider"
              isLoading={puzzleOperationIsLoading}
              onClick={async () => {
                try {
                  if (!values.puzzleTitle) throw new Error('Veuillez donner un nom a deviner');
                  setPuzzleOperationIsLoading(true);
                  if (values['puzzle-editor-mode'] === 'create-offline') {
                    const puzzle = await createPuzzleFromInputs();
                    setValue('puzzles', [...values.puzzles, puzzle]);
                    onSuccess();
                  } else if (values['puzzle-editor-mode'] === 'create-online') {
                    if (!values.title) throw new Error('Pack has no title');
                    const pictures = await extractImageFilesAsSrc();

                    const puzzle = await addPuzzle({
                      packTitle: values.title,
                      puzzle: {
                        id: uuidv4(),
                        packId: values.packId,
                        word: values.puzzleTitle,
                        pictures,
                        online: false,
                      },
                    });

                    notifySuccess('Puzzle created with success');
                    setValue('puzzles', [...values.puzzles, puzzle]);
                    onSuccess();
                  } else if (values['puzzle-editor-mode'] === 'update-offline') {
                    const puzzle = await createPuzzleFromInputs();
                    const puzzles = values.puzzles.filter((puzzle: Puzzle) => puzzle.id !== values['puzzle-id']);
                    setValue('puzzles', [...puzzles, puzzle]);
                    onSuccess();
                  } else if (values['puzzle-editor-mode'] === 'update-online') {
                    const puzzle = await createPuzzleFromInputs(values['puzzle-id']);
                    await editPuzzle({ packTitle: values.title, puzzle });
                    notifySuccess('Puzzle modified with success');
                    const puzzles = values.puzzles.filter((puzzle: Puzzle) => puzzle.id !== values['puzzle-id']);
                    setValue('puzzles', [...puzzles, puzzle]);
                    onSuccess();
                  }
                } catch (error) {
                  if (error instanceof Error) {
                    notifyError(error.message);
                  }
                } finally {
                  setPuzzleOperationIsLoading(false);
                }
              }}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
