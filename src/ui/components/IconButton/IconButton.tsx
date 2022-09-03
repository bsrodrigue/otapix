import { MouseEventHandler } from "react";
import { CgCloseO } from "react-icons/cg";

import style from "./IconButton.module.css";

interface IconButtonProps {
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function IconButton({ onClick }: IconButtonProps) {

  return (
    <div onClick={onClick} className={style.container}>
      <CgCloseO />
    </div>
  )
}
