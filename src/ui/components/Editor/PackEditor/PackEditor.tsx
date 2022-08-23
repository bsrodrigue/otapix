import _ from "lodash";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createPack, editPack, editPackCover, uploadPuzzlePicturesFromPuzzle } from "../../../../api/firebase";
import { Difficulty } from "../../../../enums";
import { useAuth } from "../../../../hooks";
import { notifyError, notifySuccess } from "../../../../lib/notifications";
import { GlobalPacks } from "../../../../types";
import { BasePuzzle } from "../../../../types/puzzle";
import {
  GenericPuzzlePack,
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
  const [checkedDifficulty, setCheckedDifficulty] = useState<Difficulty>(Difficulty.F);
  const [puzzleEditorIsOpen, setPuzzleEditorIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backup, setBackup] = useState<GenericPuzzlePack>();
  const methods = useForm();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const values = watch();
  const { pack } = values;
  const { user } = useAuth();

  // console.log(values);

  useEffect(() => {
    register("difficulty");
    register("puzzles", { value: pack?.puzzles || [] });
  }, []);

  useEffect(() => {
    reset();
    setBackup(currentPack);
    setValue("pack", currentPack);
    setValue("puzzles", currentPack.puzzles);
    setValue("cover", currentPack.cover);
    setValue("title", currentPack.title);
    setValue("difficulty", currentPack.difficulty);
  }, [currentPack, reset, setValue]);

  useEffect(() => {
    checkedDifficulty && setValue("difficulty", checkedDifficulty);
  }, [checkedDifficulty, setValue]);

  function onSuccess(newPack: GenericPuzzlePack) {
    if (newPack.local) {
      setPacks((prev) => {
        let local = prev.local;
        let remote = prev.remote;
        local = local.filter((pack) => pack.id !== currentPack?.id);
        remote = remote.filter((pack) => pack.id !== currentPack?.id);
        newPack.local = false;
        remote.push({ ...newPack });
        return {
          local,
          remote,
        };
      });
    } else {
      setPacks((prev) => {
        let local = prev.local;
        let remote = prev.remote;
        remote = remote.filter((pack) => pack.id !== currentPack?.id);
        remote.push({ ...newPack });
        return {
          local,
          remote,
        };
      });
    }
  }

  function checkPackAreEqual(initialPack: GenericPuzzlePack, newPack: GenericPuzzlePack) {
    return _.isEqual(initialPack, newPack);
  }

  return (
    <EditorWrapper>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              if (user && backup) {
                setIsLoading(true);
                const cover = typeof data.cover === "string" ? data.cover : data.cover[0];

                const newPuzzlePack: GenericPuzzlePack = {
                  id: currentPack.id,
                  author: user.uid,
                  cover,
                  title: data.title,
                  difficulty: data.difficulty,
                  puzzles: data.puzzles,
                  local: currentPack.local,
                };

                if (checkPackAreEqual(backup, newPuzzlePack)) {
                  toast("Aucune modification", { type: "warning" });
                  return;
                }

                if (newPuzzlePack.local) {
                  if (newPuzzlePack.puzzles.length === 0) {
                    notifyError("Veuillez ajouter au moins un puzzle!");
                    return;
                  } else if (!cover) {
                    notifyError("Veuillez ajouter une couverture!");
                    return;
                  }
                  await createPack({
                    pack: {
                      title: newPuzzlePack.title,
                      author: newPuzzlePack.author,
                      difficulty: newPuzzlePack.difficulty,
                    },
                    cover: data.cover[0],
                    puzzles: data.puzzles,
                  });
                  onSuccess(newPuzzlePack);
                  notifySuccess("Pack cree avec succes");
                } else {
                  const picturesUploadTasks: Array<Promise<BasePuzzle>> = [];
                  const tasks: Array<Promise<void>> = [];

                  const newPuzzles = newPuzzlePack.puzzles.filter((puzzle) => puzzle.local);

                  if (newPuzzles) {
                    for (let i = 0; i < newPuzzles.length; i++) {
                      picturesUploadTasks.push(uploadPuzzlePicturesFromPuzzle(newPuzzles[i], newPuzzlePack.title));
                    }
                  }

                  if (!_.isEqual(backup.cover, newPuzzlePack.cover)) {
                    tasks.push(editPackCover({ id: newPuzzlePack.id, packTitle: newPuzzlePack.title, cover }));
                  }

                  tasks.push(
                    editPack({
                      id: newPuzzlePack.id,
                      title: newPuzzlePack.title,
                      difficulty: newPuzzlePack.difficulty,
                    })
                  )

                  // You forgot to add the puzzles to pack
                  const [_result, result] = await Promise.all([Promise.all(tasks), Promise.all(picturesUploadTasks)])

                  onSuccess(newPuzzlePack);
                  notifySuccess("Pack modifie avec succes");
                }
              }
            } catch (error) {
              console.error(error);
              notifyError("Erreur lors de la creation du pack");
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
