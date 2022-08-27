import { FirebaseError } from "firebase/app";
import _ from "lodash";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  addPuzzles,
  createPack,
  deletePack,
  editPack,
  editPackCover,
} from "../../../../api/firebase";
import { Difficulty } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { notifyError, notifySuccess } from "../../../../lib/notifications";
import { getNewPuzzles, getOldPuzzles } from "../../../../lib/utils";
import { Pack, PacksSetter, Puzzles } from "../../../../types";
import { Button } from "../../Button/Button";
import { SpinnerButton } from "../../Button/SpinnerButton";
import { ConfirmationAlert } from "../../ConfirmationAlert";
import { RectangularDropzone } from "../../Dropzone/RectangularDropzone";
import { PuzzleGrid } from "../../Grid/PuzzleGrid";
import { DifficultyRadioGroup } from "../../RadioGroup/DifficultyRadioGroup";
import { EditorWrapper } from "../EditorWrapper";
import { PuzzleEditor } from "../PuzzleEditor";

interface PackEditorProps {
  currentPack: Pack;
  currentPackIndex: number;
  setPacks: PacksSetter;
}

export default function PackEditor({ currentPack, setPacks }: PackEditorProps) {
  const [checkedDifficulty, setCheckedDifficulty] = useState<Difficulty>(
    currentPack.difficulty
  );
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState<boolean>(false);
  const [confirmationIsOpen, setConfirmationIsOpen] = useState<boolean>(false);
  const [backup, setBackup] = useState<Pack>();
  const methods = useForm();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const values = watch();
  const { user } = useAuth();


  function redistributeImagesAmongInputs() {
    const pp1 = values['puzzle-pic-1'];
    console.log(pp1);
    if (pp1 instanceof FileList) {
      if (pp1.length > 1) {

        for (let i = 0; i < pp1.length; i++) {
          console.log("Working?: ", pp1);
          setValue(`puzzle-pic-${i + 1}`, pp1[i]);
        }
      }
    }
  }

  useEffect(() => {
    console.log(values);
  }, [values]);

  useEffect(() => {
    redistributeImagesAmongInputs();
  }, [values[`puzzle-pic-1`]]);

  useEffect(() => {
    reset();
    setConfirmationIsOpen(false);
    register("difficulty");
    register("puzzles");
    setValue("puzzles", currentPack.puzzles);
    setValue("packId", currentPack.id);
    setValue("cover", currentPack.cover);
    setValue("title", currentPack.title);
    setValue("difficulty", currentPack.difficulty);
    setBackup(currentPack);
  }, [currentPack, reset, setValue]);

  useEffect(() => {
    checkedDifficulty && setValue("difficulty", checkedDifficulty);
  }, [checkedDifficulty, setValue]);

  function onSuccess(newPack: Pack) {
    newPack.online = true;
    setBackup(newPack);
    setPacks((packs) => {
      packs = packs.filter((pack) => pack.id !== currentPack.id);
      packs.push(newPack);
      return packs;
    });
  }

  return (
    <EditorWrapper>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              if (user && backup) {

                console.log("Data to be used: ", data);

                setIsLoading(true);
                let cover = data.cover;
                if (cover instanceof FileList) {
                  cover = cover.item(0);
                }

                const newPuzzlePack: Pack = {
                  cover,
                  id: data.packId,
                  authorId: currentPack.authorId,
                  title: data.title,
                  difficulty: data.difficulty,
                  puzzles: data.puzzles,
                  online: currentPack.online,
                };

                if (
                  !newPuzzlePack.puzzles ||
                  newPuzzlePack.puzzles.length === 0
                ) {
                  notifyError("Veuillez creer au moins un puzzle!");
                  return;
                }

                if (_.isEqual(backup, newPuzzlePack)) {
                  toast("Aucune modification", { type: "warning" });
                  return;
                }

                if (!newPuzzlePack.online) {
                  const { id, cover: coverURL, puzzles } = await createPack({
                    pack: {
                      title: newPuzzlePack.title,
                      authorId: newPuzzlePack.authorId,
                      difficulty: newPuzzlePack.difficulty,
                    },
                    cover,
                    puzzles: data.puzzles,
                  });
                  onSuccess({ ...newPuzzlePack, id, cover: coverURL, puzzles });
                  notifySuccess("Pack cree avec succes");
                } else {
                  const tasks: Array<Promise<void>> = [];

                  const newPuzzles = getNewPuzzles(newPuzzlePack.puzzles);
                  const oldPuzzles = getOldPuzzles(newPuzzlePack.puzzles);

                  let destinationPuzzleTasks: Promise<Puzzles>;
                  if (newPuzzles.length !== 0) {
                    destinationPuzzleTasks = addPuzzles({
                      packTitle: newPuzzlePack.title,
                      puzzles: newPuzzles,
                    });
                  }

                  if (!_.isEqual(backup.cover, newPuzzlePack.cover)) {
                    tasks.push(
                      editPackCover({
                        id: newPuzzlePack.id,
                        packTitle: newPuzzlePack.title,
                        cover,
                      })
                    );
                  }

                  tasks.push(
                    editPack({
                      id: newPuzzlePack.id,
                      title: newPuzzlePack.title,
                      difficulty: newPuzzlePack.difficulty,
                    })
                  );

                  // You forgot to add the puzzles to pack
                  const [_result, result] = await Promise.all([
                    Promise.all(tasks),
                    destinationPuzzleTasks!,
                  ]);

                  const remotePuzzles = result || [];

                  onSuccess({
                    ...newPuzzlePack,
                    puzzles: [...oldPuzzles, ...remotePuzzles],
                  });
                  notifySuccess("Pack modifie avec succes");
                }
              }
            } catch (error) {
              console.error(error);
              if (error instanceof Error) notifyError(error.message);
            } finally {
              setIsLoading(false);
            }
          })}
        >
          <p>Couverture</p>
          <RectangularDropzone
            label="Telecharger une image"
            src={values.cover}
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

          {!puzzleEditorIsOpen && !confirmationIsOpen && (
            <>
              <p>Liste des énigmes</p>
              <PuzzleGrid puzzles={values.puzzles} />
              <Button onClick={() => setPuzzleEditorIsOpen(true)}>
                Ajouter un puzzle
              </Button>
            </>
          )}

          {!puzzleEditorIsOpen && !confirmationIsOpen && (
            <div style={{ display: "flex", gap: "1em" }}>
              {/* Delete Pack */}
              <SpinnerButton
                type="error"
                text="Supprimer"
                disabled={deleteIsLoading || isLoading}
                isLoading={deleteIsLoading}
                onClick={() => setConfirmationIsOpen(true)}
              />

              {/* Submit Pack */}
              <SpinnerButton buttonType="submit" isLoading={isLoading} />
            </div>
          )}
        </form>

        {/* Puzzle Editor */}
        {puzzleEditorIsOpen && (
          <PuzzleEditor
            isOpen={puzzleEditorIsOpen}
            setIsOpen={setPuzzleEditorIsOpen}
          />
        )}

        {confirmationIsOpen && (
          <ConfirmationAlert
            isLoading={deleteIsLoading}
            onCancel={() => {
              setConfirmationIsOpen(false);
            }}
            onConfirm={async () => {
              try {
                setDeleteIsLoading(true);
                currentPack.online &&
                  (await deletePack(currentPack.id.toString()));
                setPacks((packs) =>
                  packs.filter((pack) => pack.id !== currentPack.id)
                );
                notifySuccess("Pack supprime avec succes");
              } catch (error) {
                if (error instanceof FirebaseError)
                  notifySuccess(error.message);
                console.error(error);
              } finally {
                setDeleteIsLoading(false);
              }
            }}
          />
        )}
      </FormProvider>
    </EditorWrapper>
  );
}
