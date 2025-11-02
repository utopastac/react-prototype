import React from "react";
import styles from "./index.module.sass";
import * as Icons from "src/data/Icons";
import Icon, {ICON_24, ICON_SUBTLE} from "src/components/Icon";

export interface SearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  return (
    <div className={styles.Main}>
      <div className={styles.icon}>
        <Icon icon={Icons.Search24} size={ICON_24} color={ICON_SUBTLE} />
      </div>
      <input placeholder={placeholder}></input>
    </div>
  );
};

export default SearchBar;

export const SearchBarPropMeta = {
  placeholder: { type: 'string', label: 'Placeholder' },
};
