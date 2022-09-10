import _ from "lodash";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { submitCreatePack, submitDeletePack, submitDeletePuzzle } from "../../../../api/app";
import usePuzzleEditor from "../../../../context/hooks/usePuzzleEditor";
import { Difficulty, EditorState } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { useApi } from "../../../../hooks/useApi";
import { RequestNames } from "../../../../lib/errors";
import {
  getPackModificationTasksToPerform,
  removePackFromState,
  removePuzzleFromPackState
} from "../../../../lib/forms/editor";
import { notifyError, notifySuccess } from "../../../../lib/notifications";
import { Pack, PacksSetter, Puzzle } from "../../../../types";
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
  const [editorState, setEditorState] = usePuzzleEditor();
  const [checkedDifficulty, setCheckedDifficulty] = useState<Difficulty>(
    currentPack.difficulty
  );
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [puzzleToDelete, setPuzzleToDelete] = useState<Puzzle>();
  const [puzzleDeleteConfirmIsOpen, setPuzzleDeleteConfirmIsOpen] =
    useState<boolean>(false);
  const [packDeleteConfirmIsOpen, setPackDeleteConfirmIsOpen] =
    useState<boolean>(false);
  const [backup, setBackup] = useState<Pack>();

  const [doDeletePack, deletePackIsLoading] = useApi<
    typeof submitDeletePack,
    void
  >(submitDeletePack, RequestNames.DELETE_PACK, () =>
    removePackFromState(setPacks, currentPack.id)
  );

  const [doDeletePuzzle, deletePuzzleIsLoading] = useApi<
    typeof submitDeletePuzzle,
    void
  >(submitDeletePuzzle, RequestNames.DELETE_PUZZLE, () => {
    puzzleToDelete &&
      removePuzzleFromPackState(setPacks, currentPack.id, puzzleToDelete.id);
  });

  const [doCreatePack, createPackIsLoading] = useApi<
    typeof submitCreatePack,
    void
  >(submitCreatePack, RequestNames.CREATE_PACK, () => {
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

                if (!newPuzzlePack.online) {
                  await doCreatePack({
                    pack: {
                      title: newPuzzlePack.title,
                      authorId: newPuzzlePack.authorId,
                      difficulty: newPuzzlePack.difficulty,
                    },
                    cover,
                    puzzles: data.puzzles,
                  });
                  onSuccess(newPuzzlePack);
                } else {
                  const tasks = getPackModificationTasksToPerform({
                    pack: newPuzzlePack,
                    backup,
                    cover,
                  });
                  await Promise.all([Promise.all(tasks)]);
                  onSuccess({ ...newPuzzlePack });
                  notifySuccess("Pack edited with success");
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
          {[
            "difficulty",
            "puzzle-online-edit",
            "puzzle-editor-mode",
            "puzzle-id",
            "puzzles",
          ].map((hiddenField, key) => (
            <input key={key} type="text" hidden {...register(hiddenField)} />
          ))}
          <p>Pack cover</p>
          <RectangularDropzone
            label="Download a pack cover"
            src={values.cover}
            {...register("cover")}
          />

          <p>Title</p>
          <input
            type="text"
            placeholder="Find a title for your pack"
            value={values.title}
            {...register("title")}
          />

          <p>Difficulty</p>
          <small>Please determine a difficulty level for your pack</small>
          <DifficultyRadioGroup
            checkedDifficulty={checkedDifficulty}
            setCheckedDifficulty={setCheckedDifficulty}
          />

          {!puzzleEditorIsOpen &&
            !packDeleteConfirmIsOpen &&
            !puzzleDeleteConfirmIsOpen && (
              <>
                <p>Puzzles</p>
                <PuzzleGrid
                  onDelete={(puzzle: Puzzle) => {
                    setPuzzleToDelete(puzzle);
                    setPuzzleDeleteConfirmIsOpen(true);
                  }}
                  onEdit={(puzzle: Puzzle) => {
                    if (puzzle.online) {
                      setEditorState(EditorState.EDIT_ONLINE)
                    } else {
                      setEditorState(EditorState.EDIT_OFFLINE)
                    }
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
                    setValue(
                      "puzzle-editor-mode",
                      currentPack.online ? "create-online" : "create-offline"
                    );
                    setPuzzleEditorIsOpen(true);
                  }}
                >
                  Create a puzzle
                </Button>
              </>
            )}

          {!puzzleEditorIsOpen &&
            !packDeleteConfirmIsOpen &&
            !puzzleDeleteConfirmIsOpen && (
              <div style={{ display: "flex", gap: "1em" }}>
                {/* Delete Pack */}
                <SpinnerButton
                  type="error"
                  text="Delete pack"
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
        {puzzleEditorIsOpen && (
          <PuzzleEditor
            isOpen={puzzleEditorIsOpen}
            setIsOpen={setPuzzleEditorIsOpen}
          />
        )}

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
