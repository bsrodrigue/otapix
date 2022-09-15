import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { submitCreatePack, submitDeletePack, submitDeletePuzzle } from "../../../../api/app";
import { createPack } from "../../../../api/firebase";
import usePuzzleEditor from "../../../../context/hooks/usePuzzleEditor";
import { Difficulty, EditorState } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { useApi } from "../../../../hooks/useApi";
import { OtapixError } from "../../../../lib/errors/classes";
import {
  getPackModificationTasksToPerform,
  removePackFromState,
  removePuzzleFromPackState
} from "../../../../lib/forms/editor";
import { notifyError, notifySuccess } from "../../../../lib/notifications";
import { Pack, Packs, PacksSetter, Puzzle } from "../../../../types";
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
  const [puzzleToDelete, setPuzzleToDelete] = useState<Puzzle>();
  const [puzzleDeleteConfirmIsOpen, setPuzzleDeleteConfirmIsOpen] =
    useState<boolean>(false);
  const [packDeleteConfirmIsOpen, setPackDeleteConfirmIsOpen] =
    useState<boolean>(false);
  const [backup, setBackup] = useState<Pack>();

  const [doDeletePack, deletePackIsLoading] = useApi<
    (pack: Pack) => void,
    void
  >(submitDeletePack, () => removePackFromState(setPacks, currentPack.id));

  const [doDeletePuzzle, deletePuzzleIsLoading] = useApi<
    (puzzle: Puzzle) => void,
    void
  >(submitDeletePuzzle, () => {
    puzzleToDelete &&
      removePuzzleFromPackState(setPacks, currentPack.id, puzzleToDelete.id);
  });

  const [doCreatePack, createPackIsLoading, pack] = useApi<typeof createPack, Pack>(submitCreatePack, () => {
  });

  const methods = useForm();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const values = watch();
  const { user } = useAuth();
  const isLoading = createPackIsLoading;

  const updateEditorFields = useCallback((pack: Pack) => {
    reset();
    setValue("puzzles", pack.puzzles);
    setValue("packId", pack.id);
    setValue("cover", pack.cover);
    setValue("title", pack.title);
    setValue("difficulty", pack.difficulty);
  }, [setValue, reset]);

  useEffect(() => {
    reset();
    setPackDeleteConfirmIsOpen(false);
    setPuzzleDeleteConfirmIsOpen(false);
    updateEditorFields(currentPack);
    setBackup(currentPack);
  }, [currentPack, reset, setValue, register, updateEditorFields]);

  useEffect(() => {
    checkedDifficulty && setValue("difficulty", checkedDifficulty);
  }, [checkedDifficulty, setValue]);

  useEffect(() => {
    if (pack) {
      setBackup(pack);
      updateEditorFields(pack);
      setPacks((packs) => {
        return replacePackById(currentPack.id, packs, pack);
      });
    }
  }, [pack]);

  function replacePackById(packId: string, packs: Packs, pack: Pack) {
    const index = packs.findIndex((pack) => pack.id === packId);
    if (index === -1) throw new OtapixError("An error occured while replace pack", "pack/replace_error");
    packs[index] = pack;
    return packs;
  }

  function onSuccess(newPack: Pack) {
  }

  return (
    <EditorWrapper>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(async (data) => {
            if (user && backup) {
              let cover = data.cover;
              if (cover instanceof FileList) {
                cover = cover.item(0);
              }

              const puzzlePackDraft: Pack = {
                cover,
                id: data.packId,
                authorId: backup.authorId,
                title: data.title,
                difficulty: data.difficulty,
                puzzles: data.puzzles,
                online: backup.online,
              };

              if (_.isEqual(backup, puzzlePackDraft)) {
                notifyError("No modification provided");
                return;
              }

              if (!puzzlePackDraft.online) {
                const success = await doCreatePack({
                  pack: {
                    title: puzzlePackDraft.title,
                    authorId: puzzlePackDraft.authorId,
                    difficulty: puzzlePackDraft.difficulty,
                  },
                  cover,
                  puzzles: data.puzzles,
                });
                success && onSuccess(puzzlePackDraft);
              } else {
                const tasks = getPackModificationTasksToPerform({
                  pack: puzzlePackDraft,
                  backup,
                  cover,
                });
                await Promise.all([Promise.all(tasks)]);
                onSuccess({ ...puzzlePackDraft });
                notifySuccess("Pack edited with success");
              }
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
                    currentPack.online ? setEditorState(EditorState.CREATE_ONLINE) : setEditorState(EditorState.CREATE_OFFLINE)
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
