import _ from "lodash";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { submitDeletePack, submitDeletePuzzle } from "../../../../api/app";
import { createPack, editPack, editPackCover } from "../../../../api/firebase";
import { Difficulty } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { useApi } from "../../../../hooks/useApi";
import { RequestNames } from "../../../../lib/errors";
import { getPackModificationTasksToPerform, removePackFromState, removePuzzleFromPackState } from "../../../../lib/forms/editor";
import { notifyError, notifySuccess } from "../../../../lib/notifications";
import { Pack, PacksSetter, Puzzle, Puzzles } from "../../../../types";
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
  const [checkedDifficulty, setCheckedDifficulty] = useState<Difficulty>(currentPack.difficulty);
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [puzzleToDelete, setPuzzleToDelete] = useState<Puzzle>();
  const [puzzleDeleteConfirmIsOpen, setPuzzleDeleteConfirmIsOpen] = useState<boolean>(false);
  const [packDeleteConfirmIsOpen, setPackDeleteConfirmIsOpen] = useState<boolean>(false);
  const [backup, setBackup] = useState<Pack>();

  const [doDeletePack, deletePackIsLoading] =
    useApi<typeof submitDeletePack, void>(submitDeletePack,
      RequestNames.DELETE_PACK, () => removePackFromState(setPacks, currentPack.id));

  const [doDeletePuzzle, deletePuzzleIsLoading] = useApi<typeof submitDeletePuzzle, void>(submitDeletePuzzle, RequestNames.DELETE_PUZZLE, () => {
    puzzleToDelete && removePuzzleFromPackState(setPacks, currentPack.id, puzzleToDelete.id);
  });

  const methods = useForm();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const values = watch();
  const { user } = useAuth();



  useEffect(() => {
    reset();
    setPackDeleteConfirmIsOpen(false);
    setPuzzleDeleteConfirmIsOpen(false);
    setValue("puzzles", currentPack.puzzles);
    setValue("packId", currentPack.id);
    setValue("cover", currentPack.cover);
    setValue("title", currentPack.title);
    setValue("difficulty", currentPack.difficulty);
    setBackup(currentPack);
  }, [currentPack, reset, setValue, register]);


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

  interface SubmitCreatePackParams {
    pack: {
      title: string;
      authorId: string;
      difficulty: Difficulty;
    };
    cover: File;
    puzzles: Puzzles;
  }

  async function submitCreatePack({ pack, cover, puzzles }: SubmitCreatePackParams) {
    const result = await createPack({
      pack,
      cover,
      puzzles,
    });
    onSuccess({ ...pack, ...result });
    notifySuccess("Pack cree avec succes");
  }

  return (
    <EditorWrapper>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              if (user && backup) {
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

                if (_.isEqual(backup, newPuzzlePack)) {
                  throw new Error("No modifications provided");
                }

                if (!newPuzzlePack.puzzles || newPuzzlePack.puzzles.length === 0) {
                  throw new Error("No puzzle created");
                }

                if (!cover) {
                  throw new Error("No cover set");
                }

                if (!newPuzzlePack.online) {
                  await submitCreatePack({
                    pack: {
                      title: newPuzzlePack.title,
                      authorId: newPuzzlePack.authorId,
                      difficulty: newPuzzlePack.difficulty,
                    },
                    cover,
                    puzzles: data.puzzles,
                  });
                } else {
                  const tasks = getPackModificationTasksToPerform({
                    pack: newPuzzlePack,
                    backup,
                    cover,
                  });
                  await Promise.all([Promise.all(tasks)]);
                  onSuccess({ ...newPuzzlePack });
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
          {
            ["difficulty", "puzzle-online-edit", "puzzle-editor-mode", "puzzle-id", "puzzles"].map((hiddenField, key) => (
              <input key={key} type="text" hidden {...(register(hiddenField))} />
            ))
          }
          <p>Couverture</p>
          <RectangularDropzone label="Telecharger une image" src={values.cover} {...register("cover")} />

          <p>Titre</p>
          <input
            type="text"
            placeholder="Trouvez un titre pour votre pack..."
            value={values.title}
            {...register("title")}
          />

          <p>Difficulte</p>
          <small>Veuillez choisir une difficulte pour votre pack</small>
          <DifficultyRadioGroup checkedDifficulty={checkedDifficulty} setCheckedDifficulty={setCheckedDifficulty} />

          {!puzzleEditorIsOpen && !packDeleteConfirmIsOpen && !puzzleDeleteConfirmIsOpen && (
            <>
              <p>Liste des énigmes</p>
              <PuzzleGrid
                onDelete={(puzzle: Puzzle) => {
                  setPuzzleToDelete(puzzle);
                  setPuzzleDeleteConfirmIsOpen(true);
                }}
                onEdit={(puzzle: Puzzle) => {
                  setValue("puzzle-editor-mode", currentPack.online ? "update-online" : "update-offline");
                  setValue("puzzle-id", puzzle.id);
                  setValue("puzzle-pic-1", puzzle.pictures[0]);
                  setValue("puzzle-pic-2", puzzle.pictures[1]);
                  setValue("puzzle-pic-3", puzzle.pictures[2]);
                  setValue("puzzle-pic-4", puzzle.pictures[3]);
                  setPuzzleEditorIsOpen(true);
                }}
                puzzles={values.puzzles}
              />
              <Button
                onClick={() => {
                  setValue("puzzle-editor-mode", currentPack.online ? "create-online" : "create-offline");
                  setPuzzleEditorIsOpen(true);
                }}
              >
                Ajouter un puzzle
              </Button>
            </>
          )}

          {!puzzleEditorIsOpen && !packDeleteConfirmIsOpen && !puzzleDeleteConfirmIsOpen && (
            <div style={{ display: "flex", gap: "1em" }}>
              {/* Delete Pack */}
              <SpinnerButton
                type="error"
                text="Supprimer"
                disabled={deletePackIsLoading || deletePuzzleIsLoading}
                isLoading={deletePackIsLoading}
                onClick={() => setPackDeleteConfirmIsOpen(true)}
              />

              {/* Submit Pack */}
              <SpinnerButton buttonType="submit" isLoading={isLoading} />
            </div>
          )}
        </form>

        {/* Puzzle Editor */}
        {puzzleEditorIsOpen && <PuzzleEditor isOpen={puzzleEditorIsOpen} setIsOpen={setPuzzleEditorIsOpen} />}

        {packDeleteConfirmIsOpen && (
          <ConfirmationAlert
            isLoading={deletePackIsLoading}
            onCancel={() => {
              setPackDeleteConfirmIsOpen(false);
            }}
            onConfirm={() => doDeletePack(currentPack)}
          />
        )}

        {puzzleDeleteConfirmIsOpen && (
          <ConfirmationAlert
            isLoading={deletePuzzleIsLoading}
            onCancel={() => {
              setPuzzleDeleteConfirmIsOpen(false);
            }}
            onConfirm={() => doDeletePuzzle(puzzleToDelete!)}
          />
        )}
      </FormProvider>
    </EditorWrapper>
  );
}
