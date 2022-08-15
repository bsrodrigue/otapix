import { PuzzlePack } from '../../../../types';
import { Accordion } from '../../Accordion';
import style from './DashboardSidePanel.module.css';

interface DashboardSidePanelProps {
    isOpen: boolean;
    setIsOpen: any;
    packs?: Array<PuzzlePack>;
}

export default function DashboardSidePanel({ isOpen, packs, setIsOpen }: DashboardSidePanelProps) {

    return (
        <div className={`${style.container} ${!isOpen && style.closed}`}>
            <Accordion
                packs={packs}
            />
        </div>
    )
}

