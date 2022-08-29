import { Alert } from 'react-bootstrap';
import useGameState from '../../../../context/hooks/useGameState';
import { SlotHelper } from '../../../../lib/utils';
import { LetterSlotsState, Puzzle } from '../../../../types';
import { SuccessDialog } from '../../Dialogs/SuccessDialog';
import { ProblemContainer } from '../../ProblemContainer';

interface IProps {
  result: string;
  puzzle: Puzzle;
  slots: LetterSlotsState;
  isLastPuzzle: any;
  moveToNextPuzzle: any;
}

export default function GameFragment({ result, puzzle, slots, isLastPuzzle, moveToNextPuzzle }: IProps) {
  const { setGameSlots } = useGameState();

  function renderResult(result: string) {
    switch (result) {
      case 'yes':
        return <SuccessDialog isLastPuzzle={isLastPuzzle()} moveToNextPuzzle={moveToNextPuzzle} />;
      case 'no':
        return <Alert variant="danger">Incorrect !</Alert>;
      default:
        return <></>;
    }
  }

  return (
    <>
      {result === 'yes' ? (
        renderResult(result)
      ) : (
        <div className="wrapper">
          <ProblemContainer puzzle={puzzle} slots={slots} />
          <button
            className="remove"
            onClick={() => {
              SlotHelper.popLetter(slots, setGameSlots);
            }}
          >
            Annuler
          </button>
        </div>
      )}
    </>
  );
}
