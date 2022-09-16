import { BooleanSetter, NumberSetter, Packs, PacksSetter } from "../../../../types";
import { Accordion } from "../../Accordion";
import style from "./DashboardSidePanel.module.css";

interface DashboardSidePanelProps {
  isOpen: boolean;
  loading: boolean;
  currentPackIndex: number;
  packs: Packs;
  setPacks: PacksSetter;
  setCurrentPackIndex: NumberSetter;
  setSideBarIsOpen: BooleanSetter;
  onCreatePackClick: () => void;
}

export default function DashboardSidePanel({ isOpen, ...rest }: DashboardSidePanelProps) {
  return (
    <div className={`${style.container} ${!isOpen && style.closed}`}>
      <Accordion label="My creations" {...rest} />
    </div>
  );
}
