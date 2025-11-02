import React from 'react';
import styles from './EditorToolbar.module.sass';
import Icon, { ICON_24, ICON_STANDARD, ICON_ADMIN } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import ToolbarButton from './ToolbarButton';

interface EditorToolbarProps {
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}

const TOOLBAR_POSITION_BOTTOM = "bottom";

const EditorToolbar = React.forwardRef<HTMLDivElement, EditorToolbarProps>(({ onDelete, onDuplicate, onMoveUp, onMoveDown, disableUp = false, disableDown = false }, ref) => (
  <div className={styles.Main} ref={ref}>
    <ToolbarButton
      onClick={onDuplicate}
      title="Duplicate"
      icon={Icons.Copy16}
      iconColor={ICON_ADMIN}
      position={TOOLBAR_POSITION_BOTTOM}
    />
    <ToolbarButton
      onClick={onMoveUp}
      title="Move Up"
      icon={Icons.TickerUp16}
      iconColor={ICON_ADMIN}
      position={TOOLBAR_POSITION_BOTTOM}
      disabled={disableUp}
    />
    <ToolbarButton
      onClick={onMoveDown}
      title="Move Down"
      icon={Icons.TickerDown16}
      iconColor={ICON_ADMIN}
      position={TOOLBAR_POSITION_BOTTOM}
      disabled={disableDown}
    />
    <ToolbarButton
      onClick={onDelete}
      title="Delete"
      icon={Icons.Clear16}
      iconColor={ICON_ADMIN}
      position={TOOLBAR_POSITION_BOTTOM}
    />
  </div>
));

EditorToolbar.displayName = 'EditorToolbar';

export default EditorToolbar; 