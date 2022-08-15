import { useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { Difficulty } from "../../../enums";
import { useAuth } from "../../../hooks";
import { PuzzlePack, UsePackArrayState, UsePackIndexState } from "../../../types";
import style from './Accordion.module.css';

export interface AccordionProps
    extends
    UsePackIndexState,
    UsePackArrayState { }

export default function Accordion({
    packs,
    setPacks,
    currentPackIndex,
    setCurrentPackIndex
}: AccordionProps) {
    const [isClosed, setIsClosed] = useState(false);
    const { user } = useAuth();

    return (
        <div className={style.accordion}>
            <div className={style.accordion_menu}>
                <div className={style.accordion_header}>
                    <p className={style.accordion_title}>Mes creations</p>
                    <div className={style.accordion_actions}>
                        <div
                            className={`${style.accordion_action}`}
                            onClick={() => {
                                if (!user) return;

                                const biggestId = Math.max(...packs.map(pack => parseInt(pack.id.toString())));

                                const newPuzzlePack: PuzzlePack = {
                                    id: biggestId + 1,
                                    title: "Nouveau pack",
                                    author: user.uid,
                                    difficulty: Difficulty.F,
                                    cover: "",
                                    puzzles: [],
                                };

                                setPacks((oldPacks) => {
                                    const data = [...oldPacks, newPuzzlePack];
                                    return data;
                                })

                                setCurrentPackIndex(packs.length);
                            }}
                        >
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
                                <div
                                    key={key}
                                    className={`${style.accordion_item} ${(currentPackIndex === key) && style.selected}`}
                                    onClick={() => {
                                        setCurrentPackIndex?.(key);
                                    }}
                                >
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