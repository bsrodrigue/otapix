import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createPack } from "../../../../api/firebase";
import { Difficulty } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { AppPacks, LocalPuzzlePack, PuzzlePack } from "../../../../types";
import { Button } from "../../Button/Button";
import { RectangularDropzone } from "../../Dropzone/RectangularDropzone";
import { PuzzleGrid } from "../../Grid/PuzzleGrid";
import { DifficultyRadioGroup } from "../../RadioGroup/DifficultyRadioGroup";
import { EditorWrapper } from "../EditorWrapper";
import { PuzzleEditor } from "../PuzzleEditor";
import style from "./PackEditor.module.css";

interface PackEditorProps {
  currentPack?: PuzzlePack | LocalPuzzlePack;
  setPacks?: Dispatch<SetStateAction<AppPacks>>
}

export default function PackEditor({ currentPack, setPacks }: PackEditorProps) {
  const [checkedDifficulty, setCheckedDifficulty] = useState<any>(Difficulty.F);
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const methods = useForm();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const values = watch();
  const { pack } = values;
  const { user } = useAuth();

  useEffect(() => {
    register("difficulty");
    register("puzzles", { value: pack?.puzzles || [] });
  });

  useEffect(() => {
    console.log("Current pack in editor: ", currentPack);
    if (currentPack) {
      reset();
      setValue("pack", currentPack);
      setValue("puzzles", currentPack?.puzzles);
      setCheckedDifficulty(currentPack?.difficulty);
    }
  }, [currentPack?.id, currentPack?.puzzles, currentPack?.difficulty]);

  useEffect(() => {
    checkedDifficulty && setValue("difficulty", checkedDifficulty);
  }, [checkedDifficulty, setValue]);

  return (
    <EditorWrapper>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              if (user) {
                const pack = {
                  title: data.title,
                  author: user.uid,
                  difficulty: data.difficulty,
                };
                const result = await createPack({
                  pack,
                  cover: data.cover[0],
                  puzzles: data.puzzles,
                });

                setPacks?.((prev) => {
                  let local = prev.local;
                  let remote = prev.remote;
                  local = local.filter((pack) => pack.id !== currentPack?.id);
                  remote.push(result);

                  return {
                    local, remote
                  }
                });

                toast("Pack cree avec succes");
              }
            } catch (error) {
              console.error(error);
              toast("Erreur lors de la creation du pack");
            }
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
            value={values.title}
            {...register("title")}
          />

          <p>Difficulte</p>
          <small>Veuillez choisir une difficulte pour votre pack</small>
          <DifficultyRadioGroup
            checkedDifficulty={checkedDifficulty}
            setCheckedDifficulty={setCheckedDifficulty}
          />

          {!puzzleEditorIsOpen && (
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
        {puzzleEditorIsOpen && (
          <PuzzleEditor
            isOpen={puzzleEditorIsOpen}
            setIsOpen={setPuzzleEditorIsOpen}
          />
        )}
      </FormProvider>
    </EditorWrapper>
  );
}
