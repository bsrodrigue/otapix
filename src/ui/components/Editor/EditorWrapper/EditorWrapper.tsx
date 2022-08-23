import { ReactNode } from 'react';
import style from './EditorWrapper.module.css';

interface EditorWrapperProps {
    children?: ReactNode;
}

export default function EditorWrapper({ children }: EditorWrapperProps) {

    return (
        <div className={`${style.container}`}>
            {children}
        </div>
    )
}