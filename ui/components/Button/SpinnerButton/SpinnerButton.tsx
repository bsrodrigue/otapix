import { TailSpin } from "react-loader-spinner";
import style from "./SpinnerButton.module.css";

export interface SpinnerButton {
  isLoading?: boolean;
}

export default function SpinnerButton({ isLoading }: SpinnerButton) {

  return (
    <button type="submit" className={`${style.container} ${isLoading && style.loading}`}>
      {isLoading ? <TailSpin color='white' /> : "Valider"}
    </button>
  );
}
