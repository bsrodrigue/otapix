import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useGameState from '../../context/hooks/useGameState';
import { useFetchProblems } from '../../hooks/useFetchProblems';
import { SlotHelper } from '../../lib/utils';
import { LoadingDialog } from '../../ui/components/Dialogs/LoadingDialog';
import { GameFragment } from '../../ui/components/Fragments/GameFragment';

export default function GamePage() {
  const { currentProblemIndex, gameSlots, result, setCurrentProblemIndex, setGameSlots, setResult } = useGameState();
  const router = useRouter();
  let { packId } = router.query;
  packId = typeof packId === 'string' ? packId : packId?.[0];
  const { problems: puzzles, isLoading } = useFetchProblems(packId!);

  const puzzlesAreEmpty = puzzles.length === 0;

  function isLastPuzzle() {
    return currentProblemIndex === puzzles.length - 1;
  }

  useEffect(() => {
    if (puzzlesAreEmpty) return;
    SlotHelper.setupCurrentPuzzle(puzzles[currentProblemIndex], setGameSlots);
  }, [puzzles, currentProblemIndex, setGameSlots, puzzlesAreEmpty]);

  useEffect(() => {
    if (puzzlesAreEmpty) return;
    if (SlotHelper.slotsAreFull(gameSlots.targetSlots)) {
      SlotHelper.checkIfResultIsCorrect(
        puzzles[currentProblemIndex],
        gameSlots.targetSlots,
        () => {
          setResult('yes');
        },
        () => {
          setResult('no');
        },
      );
    } else {
      setResult('');
    }
  }, [currentProblemIndex, gameSlots.targetSlots, puzzles, puzzlesAreEmpty, setResult]);

  function moveToNextPuzzle() {
    if (isLastPuzzle()) {
      setCurrentProblemIndex(0);
      setResult('');
    } else {
      setCurrentProblemIndex(currentProblemIndex + 1);
      setResult('');
    }
  }

  return (
    <main>
      {isLoading ? (
        <LoadingDialog />
      ) : (
        <>
          {(!puzzlesAreEmpty && (
            <GameFragment
              result={result}
              puzzle={puzzles[currentProblemIndex]}
              slots={gameSlots}
              isLastPuzzle={isLastPuzzle}
              moveToNextPuzzle={moveToNextPuzzle}
            />
          )) || <p className="message">PAS DE CONTENU...</p>}
        </>
      )}
    </main>
  );
}
