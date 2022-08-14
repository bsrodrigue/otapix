import { useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { mockPuzzlePacks } from "../../data/mock";
import { PackEditor } from "../../ui/components/Editor/PackEditor";
import { DashboardSidePanel } from "../../ui/components/SidePanel/DashboardSidePanel";

export default function DashboardPage() {
    const [isOpen, setIsOpen] = useState(true);
    const [currentPackIndex, setCurrentPackIndex] = useState(0);



    return (<div className="dashboard-page">
        <DashboardSidePanel
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            packs={mockPuzzlePacks}
        />
        <PackEditor
            currentPack={mockPuzzlePacks[currentPackIndex]}
        />
        <div
            className={`floating_menu_button material-shadow`}
            onClick={() => setIsOpen(!isOpen)}
        >
            < CgMenuRound />
        </div>
    </div>)
}