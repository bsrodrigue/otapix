import { Dispatch, SetStateAction, useContext } from "react";
import { EditorState } from "../../enums";
import { PuzzleEditorContext } from '../contexts/editor/PuzzleEditorContext';

export default function usePuzzleEditor(): [editorState: EditorState, setEditorState: Dispatch<SetStateAction<EditorState>>] {
    const context = useContext(PuzzleEditorContext);

    if (context === undefined) {
        throw new Error("usePuzzleEditor can only be used inside PuzzleEditorProvider");
    }

    return context;
}

