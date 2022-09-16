import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { submitCreatePuzzle, submitEditPuzzle } from "../../../../api/app";
import { addPuzzle, editPuzzle } from "../../../../api/firebase";
import usePuzzleEditor from "../../../../context/hooks/usePuzzleEditor";
import { EditorState } from "../../../../enums";
import { useApi } from "../../../../hooks/useApi";
import { notifyError } from "../../../../lib/notifications";
import { getSrcFromFile, replaceById } from "../../../../lib/utils";
import { Puzzle } from "../../../../types";
import { SpinnerButton } from "../../Button/SpinnerButton";
import { RectangularDropzone } from "../../Dropzone";
import style from "./PuzzleEditor.module.css";

interface PuzzleEditorProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function PuzzleEditor({ isOpen, setIsOpen }: PuzzleEditorProps) {
  const [puzzleEditorState, setPuzzleEditorState] = usePuzzleEditor();
  const { setValue, watch, register } = useFormContext();
  const values = watch();

  const [doCreatePuzzle, createPuzzleIsLoading] = useApi<
    typeof addPuzzle,
    Puzzle
  >(submitCreatePuzzle, (puzzle) => {
    setValue("puzzles", [...values.puzzles, puzzle]);
    onSuccess();
  });
  const [doEditPuzzle, editPuzzleIsLoading] = useApi<typeof editPuzzle, Puzzle>(
    submitEditPuzzle,
    (puzzle) => {
      if (puzzle) {
        let puzzles = values.puzzles;
        puzzles = replaceById<Puzzle>(puzzle?.id, puzzles, puzzle);
        setValue("puzzles", puzzles);
        onSuccess();
      }
    }
  );

  const isLoading = createPuzzleIsLoading || editPuzzleIsLoading;
  const isEditMode = puzzleEditorState === EditorState.EDIT;

  function resetPictures() {
    for (let i = 0; i < 4; i++) {
      setValue(`puzzle-pic-${i + 1}`, "");
    }
  }

  async function extractImageFilesAsSrc() {
    const pictures: Array<string> = [];
    if (isEditMode) {
      for (let i = 0; i < 4; i++) {
        const value = values[`puzzle-pic-${i + 1}`];
        if ((value instanceof FileList && value.length === 0) || !value) {
          throw Error("Missing File(s)");
        }
        if (value instanceof FileList) {
          const file: File = value[0];
          const result = await getSrcFromFile(file);
          pictures.push(result);
        } else {
          pictures.push(value);
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        const value = values[`puzzle-pic-${i + 1}`];
        if (!(value instanceof FileList) || value.length === 0)
          throw Error("Missing File(s)");
        const file: File = value[0];
        const result = await getSrcFromFile(file);
        pictures.push(result);
      }
    }
    return pictures;
  }

  function onSuccess() {
    resetPictures();
    setPuzzleEditorState(EditorState.DEFAULT);
    setIsOpen?.(false);
  }

  return (
    <>
      {isOpen && (
        <div className={style.container}>
          <p>Clue images</p>
          <div className={style.picture_fields}>
            {[1, 2, 3, 4].map((value, key) => (
              <RectangularDropzone
                key={key}
                src={values[`puzzle-pic-${value}`]}
                {...register(`puzzle-pic-${value}`)}
                isSquare
              />
            ))}
          </div>

          <p>Word or name to guess</p>
          <input
            className={style.title_input}
            type="text"
            placeholder="Enter the word or name players have to guess..."
            value={values.puzzleTitle}
            {...register("puzzleTitle")}
          />
          <div style={{ display: "flex", marginTop: "1em", gap: "1em" }}>
            <SpinnerButton
              type="error"
              buttonType="button"
              text="Annuler"
              disabled={isLoading}
              onClick={() => setIsOpen?.(false)}
            />
            <SpinnerButton
              buttonType="button"
              text="Valider"
              isLoading={isLoading}
              onClick={async () => {
                let pictures: Array<string> = [];
                try {
                  pictures = await extractImageFilesAsSrc();
                } catch (error) {
                  if (error instanceof Error) notifyError(error.message);
                  return;
                }

                const p = {
                  packTitle: values.title,
                  puzzle: {
                    id: isEditMode ? values["puzzle-id"] : uuidv4(),
                    packId: values.packId,
                    word: values.puzzleTitle,
                    pictures,
                    online: false,
                  },
                };

                isEditMode ? await doEditPuzzle(p) : await doCreatePuzzle(p);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
