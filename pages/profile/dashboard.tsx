import { useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { mockPuzzlePacks } from "../../data/mock";
import { PuzzlePack } from "../../types";
import { Fab } from "../../ui/components/Button/Fab";
import { EditorWrapper } from "../../ui/components/Editor/EditorWrapper";
import { PackEditor } from "../../ui/components/Editor/PackEditor";
import { DashboardSidePanel } from "../../ui/components/SidePanel/DashboardSidePanel";


export default function DashboardPage() {
    const [isOpen, setIsOpen] = useState(true);
    const [currentPackIndex, setCurrentPackIndex] = useState(0);
    const [packs, setPacks] = useState<Array<PuzzlePack>>(mockPuzzlePacks);

    return (<div className="dashboard-page">
        <DashboardSidePanel
            isOpen={isOpen}
            packs={packs}
            setPacks={setPacks}
            currentPackIndex={currentPackIndex}
            setCurrentPackIndex={setCurrentPackIndex}
        />
        <EditorWrapper>
            <PackEditor
                currentPack={packs[currentPackIndex]}
            />
        </EditorWrapper>
        <Fab onClick={(e) => setIsOpen(!isOpen)}>
            <CgMenuRound />
        </Fab>
    </div>)
}