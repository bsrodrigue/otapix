import _ from "lodash";
import { editPackCover, editPack } from "../../../api/firebase";
import { Difficulty } from "../../../enums";
import { Pack, Packs, PacksSetter, Puzzles } from "../../../types";

export function removePackFromState(setPacks: PacksSetter, packId: string) {
    setPacks((packs) => deletePackById(packs, packId));
}

export function deletePackById(packs: Packs, packId: string) {
    return packs.filter((pack) => pack.id !== packId)
}

export function deletePuzzleById(puzzles: Puzzles, puzzleId: string) {
    return puzzles.filter((puzzle) => puzzle.id !== puzzleId);
}

export function removePuzzleFromPackState(setPacks: PacksSetter, packId: string, puzzleId: string) {
    setPacks((packs) => {
        for (let i = 0; i < packs.length; i++) {
            if (packs[i].id === packId) {
                const pack = packs[i];
                if (pack.puzzles) {
                    pack.puzzles = deletePuzzleById(pack.puzzles, puzzleId);
                }
                packs[i] = pack;
            }
        }
        return packs;
    });
}

export function getPackModificationTasksToPerform({ backup, pack, cover }: { backup: Pack; pack: { id: string, title: string, difficulty: Difficulty }; cover: File }) {
    const tasks: Array<Promise<void>> = [];
    if (!_.isEqual(backup.cover, cover)) {
        tasks.push(
            editPackCover({
                id: pack.id,
                packTitle: pack.title,
                cover,
            }),
        );
    }

    tasks.push(
        editPack({
            id: pack.id,
            title: pack.title,
            difficulty: pack.difficulty,
        }),
    );
    return tasks;
}

