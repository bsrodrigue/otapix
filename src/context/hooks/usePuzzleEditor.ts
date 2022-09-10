import { useContext } from "react";
import { PuzzleEditorContext } from '../contexts/editor/PuzzleEditorContext';

export default function usePuzzleEditor() {
    const context = useContext(PuzzleEditorContext);

    if (context === undefined) {
        throw new Error("usePuzzleEditor can only be used inside PuzzleEditorProvider");
    }

    return context;
}

