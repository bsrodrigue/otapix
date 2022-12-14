import { useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { BooleanSetter, NumberSetter, Packs, PacksSetter } from "../../../types";
import style from "./Accordion.module.css";

export interface AccordionProps {
  label: string;
  packs: Packs;
  currentPackIndex: number;
  loading: boolean;
  setPacks: PacksSetter;
  setSideBarIsOpen: BooleanSetter;
  setCurrentPackIndex: NumberSetter;
  onCreatePackClick: () => void;
}

export default function Accordion({
  label,
  packs,
  loading,
  currentPackIndex,
  setCurrentPackIndex,
  onCreatePackClick,
}: AccordionProps) {
  const [isClosed, setIsClosed] = useState(false);

  return (
    <div className={style.accordion}>
      <div className={style.accordion_menu}>
        <div className={style.accordion_header}>
          <p className={style.accordion_title}>{label}</p>
          <div className={style.accordion_actions}>
            <div className={`${style.accordion_action}`} onClick={onCreatePackClick}>
              <BsPlusCircleFill />
            </div>
            <div
              className={`${style.accordion_action} ${style.accordion_indicator}`}
              onClick={() => setIsClosed(!isClosed)}
            ></div>
          </div>
        </div>
        <div className={`${style.accordion_content} ${isClosed && style.accordion_closed}`}>
          {loading ? (
            <div className={`${style.accordion_item} ${style.selected}`}>
              <p>Packs loading...</p>
            </div>
          ) : (
            <>
              {packs && packs.length !== 0 ? (
                packs.map((pack, key) => {
                  return (
                    <div
                      key={key}
                      className={`${style.accordion_item} ${currentPackIndex === key && style.selected}`}
                      onClick={() => {
                        setCurrentPackIndex?.(key);
                      }}
                    >
                      <p>{pack.title}</p>
                    </div>
                  );
                })
              ) : (
                <div className={`${style.accordion_item} ${style.selected}`} onClick={onCreatePackClick}>
                  <p>No packs...</p>
                  <small>Touch here to create a pack</small>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
