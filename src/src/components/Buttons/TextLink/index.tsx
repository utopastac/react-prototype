import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.sass";

export interface TextLinkProps {
  title: string;
  path: string;
}

export default function TextLink({ title, path }: TextLinkProps) {
  return (
    <Link to={path}>
      <div className={styles.Main}>
        <span>{title}</span>
      </div>
    </Link>
  );
}
