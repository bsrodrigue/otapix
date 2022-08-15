import { useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { PuzzlePack } from "../../../types";

import style from './Accordion.module.css';

export interface AccordionProps {
    packs?: Array<PuzzlePack>;
}

export default function Accordion({ packs }: AccordionProps) {
    const [isClosed, setIsClosed] = useState(false);

    return (
        <div className={style.accordion}>
            <div className={style.accordion_menu}>
                <div className={style.accordion_header}>
                    <p className={style.accordion_title}>Mes creations</p>
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
                    {
                        packs?.map((pack, key) => {
                            return (
                                <div key={key} className={style.accordion_item}>
                                    <p>{pack.title}</p>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}