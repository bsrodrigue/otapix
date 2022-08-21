import { Dispatch, SetStateAction, useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { Difficulty } from "../../../enums";
import { useAuth } from "../../../hooks";
import { v4 as uuidv4 } from "uuid";
import { LocalPuzzlePack, PuzzlePack, UsePackArrayState, UsePackIndexState } from "../../../types";
import style from './Accordion.module.css';

export interface AccordionProps
  extends
  UsePackIndexState,
  UsePackArrayState {
  setSideBarIsOpen: Dispatch<SetStateAction<boolean>>
  loading: boolean;
}

export default function Accordion({
  packs,
  setPacks,
  currentPackIndex,
  setCurrentPackIndex,
  setSideBarIsOpen,
  loading,
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
                const newPuzzlePack: LocalPuzzlePack = {
                  id: uuidv4(),
                  title: "Nouveau pack",
                  difficulty: Difficulty.F,
                  cover: "",
                  puzzles: [],
                  local: true,
                };

                setPacks((prev) => {
                  prev.local.push(newPuzzlePack);
                  return prev;
                })

                setCurrentPackIndex(packs.length);
                setSideBarIsOpen(false);
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
            loading ? (
              <div
                className={`${style.accordion_item} ${style.selected}`}
              >
                <p>Packs en cours de chargement...</p>
              </div>
            ) : (
              <>
                {
                  packs && packs.length !== 0 ? (
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
                  ) : (
                    <div
                      className={`${style.accordion_item} ${style.selected}`}
                      onClick={() => {
                        setSideBarIsOpen(false);
                      }}
                    >
                      <p>Pas de packs...</p>
                      <small>Cliquez ici pour ajouter un pack</small>
                    </div>
                  )
                }
              </>
            )
          }
        </div>
      </div>
    </div >
  );
}
