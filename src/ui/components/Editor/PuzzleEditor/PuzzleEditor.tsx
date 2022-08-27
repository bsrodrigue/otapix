import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { notifyError } from "../../../../lib/notifications";
import { getSrcFromFile } from "../../../../lib/utils";
import { Puzzle } from "../../../../types";
import { Button } from "../../Button/Button";
import { RectangularDropzone } from "../../Dropzone";
import style from "./PuzzleEditor.module.css";

interface PuzzleEditorProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function PuzzleEditor({ isOpen, setIsOpen }: PuzzleEditorProps) {
  const { setValue, watch, register } = useFormContext();
  const values = watch();

  function resetPictures() {
    for (let i = 0; i < 4; i++) {
      setValue(`puzzle-pic-${i + 1}`, "");
    }
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
            {...register(`puzzleTitle`)}
          />
          <div style={{ display: "flex", marginTop: "1em" }}>
            <Button type="button" onClick={() => setIsOpen?.(false)}>
              Annuler
            </Button>
            <Button
              type="button"
              style={{ backgroundColor: "white", color: "black" }}
              onClick={async () => {
                const pictures: Array<string> = [];
                try {
                  if (!values.puzzleTitle)
                    throw new Error("Veuillez donner un nom a deviner");
                  for (let i = 0; i < 4; i++) {
                    const value = values[`puzzle-pic-${i + 1}`];
                    if (!(value instanceof FileList) || value.length === 0)
                      throw Error("Image(s) manquante(s)");
                    const file: File = value[0];
                    const result = await getSrcFromFile(file);
                    pictures.push(result);
                  }
                } catch (error) {
                  if (error instanceof Error) {
                    notifyError(error.message);
                  }
                  return;
                }

                const newPuzzle: Puzzle = {
                  id: uuidv4(),
                  packId: values.packId,
                  word: values.puzzleTitle,
                  pictures,
                  online: false,
                };

                setValue("puzzles", [...values.puzzles, newPuzzle]);
                resetPictures();
                setIsOpen?.(false);
              }}
            >
              Confirmer
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
