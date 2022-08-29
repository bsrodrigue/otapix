import { ReactNode } from "react";
import styleSheet from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  style?: any;
  type?: "button" | "reset" | "submit" | undefined;
}

export default function Button({ children, className, type, ...rest }: ButtonProps) {
  return (
    <button type={type || "button"} className={`${styleSheet.container} ${className}`} {...rest}>
      {children}
    </button>
  );
}
