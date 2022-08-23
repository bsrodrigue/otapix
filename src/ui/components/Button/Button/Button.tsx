import { ReactNode } from "react";
import { Styled } from "../../../../types";
import styleSheet from "./Button.module.css";

interface ButtonProps extends Styled {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  type?: "button" | "reset" | "submit" | undefined;
}

export default function Button({
  children,
  className,
  type,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type || "button"}
      className={`${styleSheet.container} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
