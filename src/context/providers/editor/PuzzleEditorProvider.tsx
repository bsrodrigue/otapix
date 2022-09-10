import { ReactNode, useState } from "react";
import { EditorState } from "../../../enums";
import { PuzzleEditorContext } from "../../contexts/editor/PuzzleEditorContext";

interface PuzzleEditorProviderProps {
    children: ReactNode;
}


export default function PuzzleEditorProvider({ children }: PuzzleEditorProviderProps) {
    const [editorState, setEditorState] = useState<EditorState>(EditorState.DEFAULT);


    return <PuzzleEditorContext.Provider value={[editorState, setEditorState]} >{children}</PuzzleEditorContext.Provider>
}

