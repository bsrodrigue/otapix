import { MouseEventHandler } from 'react';
import { TailSpin } from 'react-loader-spinner';
import styleSheet from './SpinnerButton.module.css';

export interface SpinnerButton {
  text?: string;
  isLoading?: boolean;
  style?: any;
  type?: 'error';
  disabled?: boolean;
  buttonType?: 'submit' | 'button';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function SpinnerButton({ text, style, type, buttonType, isLoading, disabled, onClick }: SpinnerButton) {
  return (
    <button
      type={buttonType || 'button'}
      disabled={disabled || isLoading}
      className={`${styleSheet.container} ${isLoading && styleSheet.loading} ${type === 'error' && styleSheet.error}`}
      style={style}
      onClick={onClick}
    >
      {isLoading ? <TailSpin color="white" /> : text || 'Valider'}
    </button>
  );
}
