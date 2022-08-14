import { useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import style from './DashboardSidePanel.module.css';

export interface AccordionProps {
    title?: string;
}

export function Accordion({ title }: AccordionProps) {
    const [isClosed, setIsClosed] = useState(false);

    return (
        <div className={style.accordion}>
            <div className={style.accordion_menu}>
                <div className={style.accordion_header}>
                    <p className={style.accordion_title}>{title}</p>
                    <div className={style.accordion_actions}>
                        <div className={`${style.accordion_action}`}>
                            <BsPlusCircleFill />
                        </div>
                        <div
                            className={`${style.accordion_action} ${style.accordion_indicator}`}
                            onClick={() => setIsClosed(!isClosed)}
                        >
                        </div>
                    </div>

                </div>
                <div className={`${style.accordion_content} ${isClosed && style.accordion_closed}`}>
                    <div className={style.accordion_item}>
                        <p>Nouveau pack</p>
                    </div>
                    <div className={style.accordion_item}>
                        <p>Pack Hunter X Hunter</p>
                    </div>
                    <div className={style.accordion_item}>
                        <p>Pack Shinigami</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface DashboardSidePanelProps {
    isOpen: boolean;
    setIsOpen: any;
}

export default function DashboardSidePanel({ isOpen, setIsOpen }: DashboardSidePanelProps) {

    return (
        <div className={`${style.container} ${!isOpen && style.closed}`}>
            <Accordion
                title="Mes creations"
            />
        </div>
    )
}

