import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { getSrcFromFile } from "../../../../lib/utils";
import { PuzzlePack } from "../../../../types";
import { Button } from "../../Button/Button";
import { RectangularDropzone } from "../../Dropzone";
import style from "./PuzzleEditor.module.css";

interface PuzzleEditorProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  setPack?: Dispatch<SetStateAction<PuzzlePack | undefined>>;
}

export default function PuzzleEditor({ isOpen, setIsOpen }: PuzzleEditorProps) {
  const { setValue, watch, register } = useFormContext();
  const values = watch();

  return (
    <>
      {isOpen ? (
        <div className={style.container}>
          <p>Images d&apos;indices</p>
          <div className={style.picture_fields}>
            {[1, 2, 3, 4].map((value, key) => (
              <RectangularDropzone
                key={key}
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
            <Button
              type="button"
              onClick={() => {
                setIsOpen?.(false);
                document
                  .getElementById("puzzle-grid-container")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              style={{ backgroundColor: "white", color: "black" }}
              onClick={async () => {
                const pictures: Array<string> = [];

                // Format pictures to base64
                for (let i = 0; i < 4; i++) {
                  const file: File = values[`puzzle-pic-${i + 1}`][0];
                  const result = await getSrcFromFile(file);
                  pictures.push(result);
                }

                const newPuzzle = {
                  word: values.puzzleTitle,
                  pictures,
                };

                setValue("puzzles", [...values.puzzles, newPuzzle]);
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
