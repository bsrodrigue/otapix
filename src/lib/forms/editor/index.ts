import { Packs, PacksSetter, Puzzles } from "../../../types";

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