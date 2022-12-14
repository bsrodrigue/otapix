import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";
import { Pack, Puzzle, Puzzles } from "../../types";

export function hydratePack(
  doc: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
  puzzles: Puzzles,
): Pack {
  const data = doc.data();
  if (!data) throw new Error("Data does not exist");
  return {
    id: doc.id,
    title: data.title,
    cover: data.cover,
    authorId: data.authorId,
    difficulty: data.difficulty,
    online: true,
    puzzles,
  };
}

export function hydratePuzzle(doc: QueryDocumentSnapshot<DocumentData>): Puzzle {
  const data = doc.data();

  return {
    id: doc.id,
    packId: data.packId,
    word: data.word,
    pictures: data.pictures,
    online: true,
  };
}
