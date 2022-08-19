import { Dispatch, SetStateAction } from 'react';
import { UsePackArrayState, UsePackIndexState } from '../../../../types';
import { Accordion } from '../../Accordion';
import style from './DashboardSidePanel.module.css';

interface DashboardSidePanelProps
  extends
  UsePackIndexState,
  UsePackArrayState {
  isOpen: boolean;
  loading: boolean;
  setSideBarIsOpen: Dispatch<SetStateAction<boolean>>;
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

