import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { submitCreatePack, submitDeletePack, submitDeletePuzzle, submitEditPack } from "../../../../api/app";
import { createPack, editPackFields } from "../../../../api/firebase";
import usePuzzleEditor from "../../../../context/hooks/usePuzzleEditor";
import { Difficulty, EditorState } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { useApi } from "../../../../hooks/useApi";
import { OtapixError } from "../../../../lib/errors/classes";
import {
  removePackFromState,
  removePuzzleFromPackState
} from "../../../../lib/forms/editor";
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
  packs: Packs;
  setPacks: PacksSetter;
}

export default function PackEditor({ packs, currentPack, setPacks }: PackEditorProps) {
  const [editorState, setEditorState] = usePuzzleEditor();
  const [packIsCreated, setPackIsCreated] = useState(false);
  const [backup, setBackup] = useState<Pack>();
  const [checkedDifficulty, setCheckedDifficulty] = useState<Difficulty>(currentPack.difficulty);
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const [puzzleToDelete, setPuzzleToDelete] = useState<Puzzle>();
  const [puzzleDeleteConfirmIsOpen, setPuzzleDeleteConfirmIsOpen] = useState<boolean>(false);
  const [packDeleteConfirmIsOpen, setPackDeleteConfirmIsOpen] = useState<boolean>(false);

  const [doDeletePack, deletePackIsLoading] = useApi(submitDeletePack, () => removePackFromState(setPacks, currentPack.id));
  const [doDeletePuzzle, deletePuzzleIsLoading] = useApi(submitDeletePuzzle, () => {
    puzzleToDelete &&
      removePuzzleFromPackState(setPacks, currentPack.id, puzzleToDelete.id);
  });

  const [doCreatePack, createPackIsLoading] = useApi<typeof createPack, Pack>(submitCreatePack, (pack) => {
    pack && updatePackEditor(pack);
  });

  const [doEditPack, editPackIsLoading] = useApi<typeof editPackFields, Pack>(submitEditPack, (pack) => {
    pack && updatePackEditor(pack);
  });

  function updatePackEditor(pack: Pack) {
    setBackup(pack);
    updateEditorFields(pack);
    setPacks((packs) => {
      return replacePackById(currentPack.id, packs, pack);
    });
    setPackIsCreated(true);
  }

  const methods = useForm();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const values = watch();
  const { user } = useAuth();
  const isLoading = createPackIsLoading || editPackIsLoading;

  const updateEditorFields = useCallback((pack: Pack) => {
    reset();
    setValue("puzzles", pack.puzzles);
    setValue("packId", pack.id);
    setValue("cover", pack.cover);
    setValue("title", pack.title);
    setValue("difficulty", pack.difficulty);
  }, [setValue, reset]);

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

  function replacePackById(packId: string, packs: Packs, pack: Pack) {
    const index = packs.findIndex((pack) => pack.id === packId);
    if (index === -1) throw new OtapixError("An error occured while replace pack", "pack/replace_error");
    packs[index] = pack;
    return packs;
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
                await doEditPack({ backup, data: { title: data.title, difficulty: data.difficulty }, cover });
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
                  disabled={deletePackIsLoading || deletePuzzleIsLoading || isLoading}
                  isLoading={deletePackIsLoading}
                  onClick={() => setPackDeleteConfirmIsOpen(true)}
                />

                {/* Submit Pack */}
                <SpinnerButton text={packIsCreated ? "Edit" : "Create"} buttonType="submit" isLoading={isLoading} />
              </div>
            )}

          {
            packIsCreated &&
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
            onCancel={() => {
              setPackDeleteConfirmIsOpen(false);
            }}
            onConfirm={() => doDeletePack(currentPack)}
          />
        )}

        {packIsCreated && puzzleDeleteConfirmIsOpen && (
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
