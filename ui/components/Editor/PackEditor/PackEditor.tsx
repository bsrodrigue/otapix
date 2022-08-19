import { useState, useEffect } from "react";
import { Difficulty } from "../../../../enums";
import { PuzzlePack } from "../../../../types";
import { Button } from "../../Button/Button";
import { RectangularDropzone } from "../../Dropzone/RectangularDropzone";
import { PuzzleGrid } from "../../Grid/PuzzleGrid";
import { DifficultyRadioGroup } from "../../RadioGroup/DifficultyRadioGroup";
import { EditorWrapper } from "../EditorWrapper";
import { PuzzleEditor } from "../PuzzleEditor";
import { useForm } from "react-hook-form"
import style from "./PackEditor.module.css";
import { createPuzzlePack } from "../../../../api/firebase";

interface PackEditorProps {
  currentPack: PuzzlePack;
}

export default function PackEditor({ currentPack }: PackEditorProps) {
  const [checkedDifficulty, setCheckedDifficulty] = useState<any>(Difficulty.F);
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const { handleSubmit, register, setValue } = useForm();
  register("difficulty");

  useEffect(() => {
    setCheckedDifficulty(currentPack.difficulty);
  }, [currentPack]);

  useEffect(() => {
    setValue("difficulty", checkedDifficulty);
  }, [checkedDifficulty]);

  useEffect(() => {
    setValue("puzzles", currentPack.puzzles);
  }, [currentPack.puzzles]);

  return (
    <EditorWrapper>
      <form id="pack-editor-form" onSubmit={handleSubmit(async (data) => {
        console.log(data);
        const payLoad = {
          title: data?.title,
          cover: data?.cover,
          difficulty: data?.difficulty,
          puzzles: data?.puzzles,
        };
        payLoad && createPuzzlePack(payLoad);
      })} >
        <p>Couverture</p>
        <RectangularDropzone
          label="Telecharger une image"
          src={currentPack.cover}
          {...register("cover")}
        />
        <p>Titre</p>
        <input
          type="text"
          placeholder="Trouvez un titre pour votre pack..."
          value={currentPack?.title}
          {...register("title")}
        />
        <p>Difficulte</p>
        <small>Veuillez choisir une difficulte pour votre pack</small>
        <DifficultyRadioGroup
          checkedDifficulty={checkedDifficulty}
          setCheckedDifficulty={setCheckedDifficulty}
        />
        {puzzleEditorIsOpen ? (
          <PuzzleEditor
            isOpen={puzzleEditorIsOpen}
            setIsOpen={setPuzzleEditorIsOpen}
          />
        ) : (
          <>
            <p>Liste de puzzle</p>
            <PuzzleGrid puzzles={currentPack.puzzles} />
            <Button
              onClick={() => {
                setPuzzleEditorIsOpen(true);
                window.scrollTo(0, document.body.scrollHeight);
              }}
            >
              Ajouter un puzzle
            </Button>
          </>
        )}
        {!puzzleEditorIsOpen && (
          <input
            type="submit"
            value="Sauvegarder"
            style={{
              marginTop: "0.5em",
              backgroundColor: "white",
              color: "black",
            }}
            className={`${style.action}`}
          />
        )}
      </form >
    </EditorWrapper>
  );
}
