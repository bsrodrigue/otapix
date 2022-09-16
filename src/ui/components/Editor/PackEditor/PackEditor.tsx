import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  submitCreatePack,
  submitDeletePack,
  submitDeletePuzzle,
  submitEditPack,
} from "../../../../api/app";
import { createPack, editPackFields } from "../../../../api/firebase";
import usePuzzleEditor from "../../../../context/hooks/usePuzzleEditor";
import { Difficulty, EditorState } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { useApi } from "../../../../hooks/useApi";
import { removePackFromState } from "../../../../lib/forms/editor";
import { replaceById } from "../../../../lib/utils";
import { Pack, Packs, PacksSetter, Puzzle, Puzzles } from "../../../../types";
import { Button } from "../../Button/Button";
import { SpinnerButton } from "../../Button/SpinnerButton";
import { ConfirmationAlert } from "../../ConfirmationAlert";
import { RectangularDropzone } from "../../Dropzone/RectangularDropzone";
import { PuzzleGrid } from "../../Grid/PuzzleGrid";
import { DifficultyRadioGroup } from "../../RadioGroup/DifficultyRadioGroup";
import { EditorWrapper } from "../EditorWrapper";
import { PuzzleEditor } from "../PuzzleEditor";

interface PackEditorProps {
  currentPackIndex: number;
  packs: Packs;
  setPacks: PacksSetter;
}

export default function PackEditor({
  currentPackIndex,
  packs,
  setPacks,
}: PackEditorProps) {
  const currentPack = packs[currentPackIndex];
  const [packIsCreated, setPackIsCreated] = useState(false);
  const [_, setPuzzleEditorState] = usePuzzleEditor();
  const [backup, setBackup] = useState<Pack>();
  const [checkedDifficulty, setCheckedDifficulty] = useState<Difficulty>(
    currentPack.difficulty
  );
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const [puzzleToDelete, setPuzzleToDelete] = useState<Puzzle>();
  const [puzzleDeleteConfirmIsOpen, setPuzzleDeleteConfirmIsOpen] =
    useState<boolean>(false);
  const [packDeleteConfirmIsOpen, setPackDeleteConfirmIsOpen] =
    useState<boolean>(false);

  const [doDeletePack, deletePackIsLoading] = useApi(submitDeletePack, () => {
    removePackFromState(setPacks, currentPack.id);
    setPackDeleteConfirmIsOpen(false);
  });

  const [doDeletePuzzle, deletePuzzleIsLoading] = useApi(
    submitDeletePuzzle,
    () => {
      let puzzles: Puzzles = values.puzzles;
      puzzles = puzzles.filter((puzzle) => puzzle.id !== puzzleToDelete?.id);
      setValue("puzzles", puzzles);
      setPuzzleDeleteConfirmIsOpen(false);
    }
  );

  const [doCreatePack, createPackIsLoading] = useApi<typeof createPack, Pack>(
    submitCreatePack,
    (pack) => {
      pack && updatePackEditor(pack);
    }
  );

  const [doEditPack, editPackIsLoading] = useApi<typeof editPackFields, Pack>(
    submitEditPack,
    (pack) => {
      pack && updatePackEditor(pack);
    }
  );

  function updatePackEditor(pack: Pack) {
    setBackup(pack);
    updateEditorFields(pack);
    setPacks((packs) => {
      return replaceById<Pack>(currentPack.id, packs, pack);
    });
    setPackIsCreated(true);
  }

  const methods = useForm();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const values = watch();
  const { user } = useAuth();
  const isLoading = createPackIsLoading || editPackIsLoading;

  const updateEditorFields = useCallback(
    (pack: Pack) => {
      reset();
      setValue("puzzles", pack.puzzles);
      setValue("packId", pack.id);
      setValue("cover", pack.cover);
      setValue("title", pack.title);
      setValue("difficulty", pack.difficulty);
    },
    [setValue, reset]
  );

  useEffect(() => {
    setPackDeleteConfirmIsOpen(false);
    setPuzzleDeleteConfirmIsOpen(false);
    updateEditorFields(currentPack);
    setBackup(currentPack);
    setPackIsCreated(Boolean(currentPack.online));
  }, [packs, currentPack, reset, setValue, register, updateEditorFields]);

  useEffect(() => {
    checkedDifficulty && setValue("difficulty", checkedDifficulty);
  }, [checkedDifficulty, setValue]);

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

              if (!packIsCreated) {
                await doCreatePack({
                  pack: {
                    title: data.title,
                    authorId: backup.authorId,
                    difficulty: data.difficulty,
                  },
                  cover,
                });
              } else {
                await doEditPack({
                  backup,
                  data: { title: data.title, difficulty: data.difficulty },
                  cover,
                });
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
              <div style={{ display: "flex", gap: "1em" }}>
                {/* Delete Pack */}
                <SpinnerButton
                  type="error"
                  text="Delete pack"
                  disabled={
                    deletePackIsLoading || deletePuzzleIsLoading || isLoading
                  }
                  isLoading={deletePackIsLoading}
                  onClick={() => setPackDeleteConfirmIsOpen(true)}
                />

                {/* Submit Pack */}
                <SpinnerButton
                  text={packIsCreated ? "Edit" : "Create"}
                  buttonType="submit"
                  isLoading={isLoading}
                />
              </div>
            )}

          {packIsCreated &&
            !puzzleEditorIsOpen &&
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
                    setPuzzleEditorState(EditorState.EDIT);
                    setValue("puzzle-id", puzzle.id);
                    setValue("puzzle-pic-1", puzzle.pictures[0]);
                    setValue("puzzle-pic-2", puzzle.pictures[1]);
                    setValue("puzzle-pic-3", puzzle.pictures[2]);
                    setValue("puzzle-pic-4", puzzle.pictures[3]);
                    setPuzzleEditorIsOpen(true);
                  }}
                  puzzles={values.puzzles}
                />
                <Button onClick={() => setPuzzleEditorIsOpen(true)}>
                  Create a puzzle
                </Button>
              </>
            )}
        </form>

        {/* Puzzle Editor */}
        {packIsCreated && puzzleEditorIsOpen && (
          <PuzzleEditor
            isOpen={puzzleEditorIsOpen}
            setIsOpen={setPuzzleEditorIsOpen}
          />
        )}

        {packDeleteConfirmIsOpen && (
          <ConfirmationAlert
            isLoading={deletePackIsLoading}
            onCancel={() => setPackDeleteConfirmIsOpen(false)}
            onConfirm={() => doDeletePack(currentPack)}
          />
        )}

        {packIsCreated && puzzleDeleteConfirmIsOpen && (
          <ConfirmationAlert
            isLoading={deletePuzzleIsLoading}
            onCancel={() => setPuzzleDeleteConfirmIsOpen(false)}
            onConfirm={() => doDeletePuzzle(puzzleToDelete!)}
          />
        )}
      </FormProvider>
    </EditorWrapper>
  );
}
