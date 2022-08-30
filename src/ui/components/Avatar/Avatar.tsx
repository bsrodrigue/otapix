import { MouseEventHandler } from "react";
import style from "./Avatar.module.css";


interface AvatarProps {
  src?: string | null;
  onClick?: MouseEventHandler<HTMLImageElement>;
  className?: string;
  height?: number | string;
  width?: number | string;
}

export default function Avatar({ src, height, width, onClick, className }: AvatarProps) {

  return (
    <img
      height={height || 100}
      width={width || 100}
      className={`${style.avatar} ${className}`}
      src={src || "img/default_avatar.png"}
      onClick={onClick}
      alt="avatar"
    />
  )
}
