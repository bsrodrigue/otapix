import { Dispatch, SetStateAction } from "react";
import { GlobalPacks } from "../../../../types";
import {
  LocalPuzzlePack,
  RemotePuzzlePack,
} from "../../../../types/puzzle_pack";
import { Accordion } from "../../Accordion";
import style from "./DashboardSidePanel.module.css";

interface DashboardSidePanelProps {
  isOpen: boolean;
  loading: boolean;
  currentPackIndex: number;
  setCurrentPackIndex: Dispatch<SetStateAction<number>>;
  packs: Array<RemotePuzzlePack | LocalPuzzlePack>;
  setPacks: Dispatch<SetStateAction<GlobalPacks>>;
  setSideBarIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardSidePanel({
  isOpen,
  ...rest
}: DashboardSidePanelProps) {
  return (
    <div className={`${style.container} ${!isOpen && style.closed}`}>
      <Accordion {...rest} />
    </div>
  );
}
