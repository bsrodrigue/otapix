import { Puzzle, LetterSlotsState } from "../../../types";
import ProblemPictures from "../ProblemPictures/ProblemPictures";
import { LetterSlotContainers } from "../Slots";

interface Props {
  puzzle: Puzzle;
  slots: LetterSlotsState;
}

export default function ProblemContainer(props: Props) {
  const {
    puzzle: { pictures },
    slots: { targetSlots, pickerSlots },
  } = props;
  return (
    <>
      <ProblemPictures pictures={pictures} />
      <LetterSlotContainers role="target" slots={targetSlots} />
      <hr />
      <LetterSlotContainers role="picker" slots={pickerSlots} />
    </>
  );
}
