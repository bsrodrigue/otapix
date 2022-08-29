interface IProps {
  isLastPuzzle: boolean;
  moveToNextPuzzle: () => void;
}

export default function SuccessDialog({ isLastPuzzle, moveToNextPuzzle }: IProps) {
  return (
    <div className="success-dialog">
      <h1>Correct!</h1>
      <img height={200} src="/img/dancing_2.gif" alt="success" />
      <button onClick={moveToNextPuzzle}>{isLastPuzzle ? 'Rejouer' : 'Continuer'}</button>
    </div>
  );
}
