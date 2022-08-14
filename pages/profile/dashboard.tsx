import { useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { PackEditor } from "../../ui/components/Editor/PackEditor";
import { DashboardSidePanel } from "../../ui/components/SidePanel/DashboardSidePanel";

export default function DashboardPage() {
    const [isOpen, setIsOpen] = useState(true);


    return (<div className="dashboard-page">
        <DashboardSidePanel
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        />
        <PackEditor />
        <div
            className={`floating_menu_button material-shadow`}
            onClick={() => setIsOpen(!isOpen)}
        >
            < CgMenuRound />
        </div>
    </div>)
}