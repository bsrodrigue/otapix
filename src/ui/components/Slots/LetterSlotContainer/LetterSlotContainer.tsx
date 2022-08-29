import useGameState from '../../../../context/hooks/useGameState';
import { SlotHelper } from '../../../../lib/utils';
import { LetterSlot } from '../../../../types';

interface Props {
  slot: LetterSlot;
  role: 'picker' | 'target';
}

export default function LetterSlotContainer({ slot, role }: Props) {
  const { gameSlots, setGameSlots } = useGameState();
  const { letter, selected } = slot;

  function isEmpty() {
    if (role === 'picker') {
      if (selected) {
        return 'empty';
      }
      return '';
    }
  }

  function click() {
    switch (role) {
      case 'target':
        break;
      case 'picker':
        if (isEmpty()) return;
        SlotHelper.pushLetter(gameSlots, slot, setGameSlots);
        break;
      default:
        break;
    }
  }

  function output() {
    let output = '';
    switch (role) {
      case 'target':
        output = selected ? letter : '';
        break;
      case 'picker':
        output = selected ? '' : letter;
        break;
      default:
        break;
    }
    return output;
  }

  return (
    <p onClick={click} className={`slot slot-${role} slot-${role}-${isEmpty()}`}>
      {output()}
    </p>
  );
}
