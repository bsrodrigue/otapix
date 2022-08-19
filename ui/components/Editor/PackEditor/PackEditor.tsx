import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { createPack } from "../../../../api/firebase";
import { Difficulty } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { PuzzlePack } from "../../../../types";
import { Button } from "../../Button/Button";
import { RectangularDropzone } from "../../Dropzone/RectangularDropzone";
import { PuzzleGrid } from "../../Grid/PuzzleGrid";
import { DifficultyRadioGroup } from "../../RadioGroup/DifficultyRadioGroup";
import { EditorWrapper } from "../EditorWrapper";
import { PuzzleEditor } from "../PuzzleEditor";
import style from "./PackEditor.module.css";

interface PackEditorProps {
  currentPack: PuzzlePack;
}

export default function PackEditor({ currentPack }: PackEditorProps) {
  const [checkedDifficulty, setCheckedDifficulty] = useState<any>(Difficulty.F);
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const [pack, setPack] = useState<PuzzlePack>();
  const methods = useForm();
  const { register, handleSubmit, setValue, watch } = methods;
  const values = watch();
  const { user } = useAuth();

  useEffect(() => {
    register("difficulty");
    register("puzzles", { value: [] });
  });

  useEffect(() => {
    setCheckedDifficulty(currentPack.difficulty);
    setPack(currentPack);
  }, [currentPack]);

  useEffect(() => {
    setValue("difficulty", checkedDifficulty);
  }, [checkedDifficulty, setValue]);

  return (
    <EditorWrapper>
      <FormProvider {...methods}>
        <form
          id="pack-editor-form"
          onSubmit={handleSubmit(async (data) => {
            console.log(data);
            // if (user) {
            //   const document = {
            //     title: data.title,
            //     author: user.uid,
            //     difficulty: data.difficulty,
            //   };
            //   createPack({
            //     pack: document,
            //     cover: data.cover[0],
            //   });
            // }
            // const payLoad = {
            //   title: data?.title,
            //   cover: data?.cover,
            //   difficulty: data?.difficulty,
            //   puzzles: data?.puzzles,
            // };
            // payLoad && createPuzzlePack(payLoad);
          })}
        >
          <p>Couverture</p>
          <RectangularDropzone
            label="Telecharger une image"
            src={pack?.cover}
            {...register("cover")}
          />

          <p>Titre</p>
          <input
            type="text"
            placeholder="Trouvez un titre pour votre pack..."
            value={pack?.title}
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
              setPack={setPack}
              // {...register}
            />
          ) : (
            <>
              <p>Liste des énigmes</p>
              <PuzzleGrid puzzles={values.puzzles} />
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
        </form>
      </FormProvider>
    </EditorWrapper>
  );
}
