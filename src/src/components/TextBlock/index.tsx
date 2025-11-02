import { React } from "react";
import styles from "./index.module.sass";
//
export const PAGE = "TEXTBLOCK_PAGE_HEADER";
export const SECTION = "TEXTBLOCK_SECTION_HEADER";
export const BLOCK = "TEXTBLOCK_BLOCK_HEADER";
//
type Props = {
  title: String,
  body: String,
  size: String
};

const TextBlock = (({ title, body, size }: Props) => {

  const headerElement = () => {
    switch(size){
      case PAGE:
        return (
          <h1>{title}</h1>
        );
      case SECTION:
        return (
          <h2>{title}</h2>
        );
      case BLOCK:
        return (
          <h3>{title}</h3>
        );
      default:
        return (
          <h3>{title}</h3>
        );
    }
  }

  return (
    <div className={styles.Main}>
      <header>
        {headerElement()}
        <p>{body}</p>
      </header>
    </div>
  );
});

export default TextBlock;
