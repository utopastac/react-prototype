import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./index.module.sass";

interface MarkdownProps {
  copy: string;
}

export default function Markdown({ copy }: MarkdownProps): JSX.Element {
  return (
    <div className={styles.Main}>
      <ReactMarkdown>{copy}</ReactMarkdown>
    </div>
  );
}

