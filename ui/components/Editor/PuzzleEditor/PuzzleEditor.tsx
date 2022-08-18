import { Dispatch, SetStateAction } from "react";
import { Button } from "../../Button/Button";
import { RectangularDropzone } from "../../Dropzone";
import style from "./PuzzleEditor.module.css";

interface PuzzleEditorProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function PuzzleEditor({ isOpen, setIsOpen }: PuzzleEditorProps) {
  return (
    <>
      {isOpen ? (
        <div className={style.container}>
          <p>Images d&apos;indices</p>
          <div className={style.picture_fields}>
            {[1, 2, 3, 4].map((value, key) => (
              <RectangularDropzone
                key={key}
                name={`puzzle-pic-${value}`}
                isSquare
              />
            ))}
          </div>

          <p>Nom a deviner</p>
          <input
            className={style.title_input}
            type="text"
            placeholder="Entrez le nom que les joueurs doivent deviner..."
          />
          <div style={{ display: "flex", marginTop: "1em" }}>
            <Button
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
              style={{ backgroundColor: "white", color: "black" }}
              onClick={() => {
                setIsOpen?.(false);
                document
                  .getElementById("puzzle-grid-container")
                  ?.scrollIntoView({ behavior: "smooth" });
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
