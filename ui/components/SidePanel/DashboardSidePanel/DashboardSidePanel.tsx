import { PuzzlePack, UsePackIndexState } from '../../../../types';
import { Accordion } from '../../Accordion';
import style from './DashboardSidePanel.module.css';

interface DashboardSidePanelProps extends UsePackIndexState {
    isOpen: boolean;
    packs?: Array<PuzzlePack>;
}

export default function DashboardSidePanel({
    isOpen,
    packs,
    currentPackIndex,
    setCurrentPackIndex }: DashboardSidePanelProps) {

    return (
        <div className={`${style.container} ${!isOpen && style.closed}`}>
            <Accordion
                packs={packs}
                currentPackIndex={currentPackIndex}
                setCurrentPackIndex={setCurrentPackIndex}
            />
        </div>
    )
}

