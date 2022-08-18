import { ReactNode } from "react";
import { Styled } from "../../../../types";
import styleSheet from "./Button.module.css";

interface ButtonProps extends Styled {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export default function Button({
  children,
  onClick,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styleSheet.container} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
