import { UsePackArrayState, UsePackIndexState } from '../../../../types';
import { Accordion } from '../../Accordion';
import style from './DashboardSidePanel.module.css';

interface DashboardSidePanelProps
    extends
    UsePackIndexState,
    UsePackArrayState {
    isOpen: boolean;
}

export default function DashboardSidePanel({
    isOpen,
    ...rest
}: DashboardSidePanelProps) {

    return (
        <div className={`${style.container} ${!isOpen && style.closed}`}>
            <Accordion
                {...rest}
            />
        </div>
    )
}

