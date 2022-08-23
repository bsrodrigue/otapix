import { ReactNode } from 'react';
import style from './Grid.module.css';

interface GridProps {
  children?: ReactNode;
  className?: string;
}

export default function Grid({ children, className }: GridProps) {

  return (
    <div className={`${style.container} ${className}`}>
      {children}
    </div>
  )
}
