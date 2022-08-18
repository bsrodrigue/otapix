import { MouseEventHandler, ReactNode } from "react"
import styleSheet from './Fab.module.css';

interface FabProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children?: ReactNode;
    className?: string;
    style?: any;
}

export default function Fab({
    onClick,
    className,
    style,
    children
}: FabProps) {
    return (
        <button
            className={`${styleSheet.fab} ${className}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </button>
    )
}