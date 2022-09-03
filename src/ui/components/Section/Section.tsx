import { ReactNode } from "react";

import style from "./Section.module.css";

interface SectionProps {
  title: string;
  primary?: boolean;
  children?: ReactNode;
}

export default function Section({ title, primary, children }: SectionProps) {
  return (
    <section className={`${primary ? "primary-back" : ""} ${style.container}`}>
      <div className="wrapper">
        <h1 className={style.title}>{title}</h1>
        <div>{children}</div>
      </div>
    </section>
  );
}
