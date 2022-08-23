import { TailSpin } from "react-loader-spinner";
import style from "./SpinnerButton.module.css";

export interface SpinnerButton {
  text?: string;
  isLoading?: boolean;
}

export default function SpinnerButton({ text, isLoading }: SpinnerButton) {

  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`${style.container} ${isLoading && style.loading}`}>
      {isLoading ? <TailSpin color='white' /> : text || "Valider"}
    </button>
  );
}
