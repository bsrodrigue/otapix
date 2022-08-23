import _ from "lodash";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createPack, editPack } from "../../../../api/firebase";
import { Difficulty } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { GlobalPacks } from "../../../../types";
import {
  LocalPuzzlePack,
  RemotePuzzlePack,
} from "../../../../types/puzzle_pack";
import { Button } from "../../Button/Button";
import { SpinnerButton } from "../../Button/SpinnerButton";
import { RectangularDropzone } from "../../Dropzone/RectangularDropzone";
import { PuzzleGrid } from "../../Grid/PuzzleGrid";
import { DifficultyRadioGroup } from "../../RadioGroup/DifficultyRadioGroup";
import { EditorWrapper } from "../EditorWrapper";
import { PuzzleEditor } from "../PuzzleEditor";

interface PackEditorProps {
  currentPack: LocalPuzzlePack | RemotePuzzlePack;
  setPacks: Dispatch<SetStateAction<GlobalPacks>>;
}

export default function PackEditor({ currentPack, setPacks }: PackEditorProps) {
  const [checkedDifficulty, setCheckedDifficulty] = useState<any>(Difficulty.F);
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backup, setBackup] = useState<RemotePuzzlePack | LocalPuzzlePack>();
  const methods = useForm();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const values = watch();
  const { pack } = values;
  const { user } = useAuth();

  useEffect(() => {
    register("difficulty");
    register("puzzles", { value: pack?.puzzles || [] });
  }, []);

  useEffect(() => {
    if (currentPack) {
      reset();
      setBackup(currentPack);
      setValue("pack", currentPack);
      setValue("puzzles", currentPack?.puzzles);
      setValue("cover", currentPack?.cover);
      setValue("title", currentPack?.title);
      setCheckedDifficulty(currentPack?.difficulty);
    }
  }, [currentPack, reset, setValue]);

  useEffect(() => {
    checkedDifficulty && setValue("difficulty", checkedDifficulty);
  }, [checkedDifficulty, setValue]);

  function onSuccess(result: any) {
    setPacks?.((prev) => {
      let local = prev.local;
      let remote = prev.remote;
      local = local.filter((pack) => pack.id !== currentPack?.id);
      remote = remote.filter((pack) => pack.id !== currentPack?.id);
      remote.push({ ...currentPack, ...result });

      return {
        local,
        remote,
      };
    });
  }

  return (
    <EditorWrapper>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              if (user) {
                setIsLoading(true);
                const cover =
                  typeof data.cover === "string" ? data.cover : data.cover[0];
                const pack = {
                  title: data.title,
                  author: user.uid,
                  difficulty: data.difficulty,
                };

                if (
                  _.isEqual(backup, {
                    id: currentPack.id,
                    puzzles: data.puzzles,
                    cover,
                    ...pack,
                  })
                ) {
                  toast("Aucune modification", { type: "warning" });
                  return;
                }

                // Create or update
                if ("local" in currentPack && currentPack.local) {
                  const result = await createPack({
                    pack,
                    cover: data.cover[0],
                    puzzles: data.puzzles,
                  });
                  // onSuccess(result);
                  toast("Pack cree avec succes", { type: "success" });
                } else {
                  const localPuzzles = data.puzzles.filter(
                    (puzzle: any) => puzzle?.local
                  );

                  if (currentPack && currentPack.id) {
                    await editPack({
                      id: currentPack.id,
                      title: data.title,
                      difficulty: data?.difficulty,
                    });
                    // onSuccess(result);
                    toast("Pack edit avec succes", { type: "success" });
                  }
                }
              }
            } catch (error) {
              console.error(error);
              toast("Erreur lors de la creation du pack", { type: "error" });
            } finally {
              setIsLoading(false);
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

          {!puzzleEditorIsOpen && <SpinnerButton isLoading={isLoading} />}
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
