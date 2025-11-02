// Layout-aware component handlers for use in AdminView and similar contexts

export function handleDeleteMulti({
  dispatch,
  phoneIndex,
  componentIndex,
  components,
  setSelected,
}: {
  dispatch: (action: any) => void;
  phoneIndex: number;
  componentIndex: number | null;
  components: any[];
  setSelected: (sel: { phoneIndex: number; componentIndex: number } | null) => void;
}) {
  if (componentIndex === null) return;
  const newComponents = components.filter((_: any, i: number) => i !== componentIndex);
  const newSelectedIdx = componentIndex > 0 ? componentIndex - 1 : null;
  dispatch({ type: 'UPDATE_LAYOUT', index: phoneIndex, payload: { components: newComponents } });
  setSelected(newSelectedIdx === null ? null : { phoneIndex, componentIndex: newSelectedIdx });
}

export function handleMoveUpMulti({
  dispatch,
  phoneIndex,
  componentIndex,
  components,
  setSelected,
}: {
  dispatch: (action: any) => void;
  phoneIndex: number;
  componentIndex: number | null;
  components: any[];
  setSelected: (sel: { phoneIndex: number; componentIndex: number } | null) => void;
}) {
  if (componentIndex === null || componentIndex <= 0) return;
  const newComponents = [...components];
  [newDropped[componentIndex - 1], newDropped[componentIndex]] = [newDropped[componentIndex], newDropped[componentIndex - 1]];
  dispatch({ type: 'UPDATE_LAYOUT', index: phoneIndex, payload: { components: newComponents } });
  setSelected({ phoneIndex, componentIndex: componentIndex - 1 });
}

export function handleMoveDownMulti({
  dispatch,
  phoneIndex,
  componentIndex,
  components,
  setSelected,
}: {
  dispatch: (action: any) => void;
  phoneIndex: number;
  componentIndex: number | null;
  components: any[];
  setSelected: (sel: { phoneIndex: number; componentIndex: number } | null) => void;
}) {
    if (componentIndex === null || componentIndex >= components.length - 1) return;
  const newComponents = [...components];
  [newComponents[componentIndex + 1], newComponents[componentIndex]] = [newComponents[componentIndex], newComponents[componentIndex + 1]];
  dispatch({ type: 'UPDATE_LAYOUT', index: phoneIndex, payload: { components: newComponents } });
  setSelected({ phoneIndex, componentIndex: componentIndex + 1 });
}

export function handleDuplicateMulti({
  dispatch,
  phoneIndex,
  componentIndex,
  components,
  setSelected,
}: {
  dispatch: (action: any) => void;
  phoneIndex: number;
  componentIndex: number | null;
  components: any[];
  setSelected: (sel: { phoneIndex: number; componentIndex: number } | null) => void;
}) {
  if (componentIndex === null) return;
  const newComponents = [...components];
  const component = newDropped[componentIndex];
  newDropped.splice(componentIndex + 1, 0, { ...component });
  dispatch({ type: 'UPDATE_LAYOUT', index: phoneIndex, payload: { components: newComponents } });
  setSelected({ phoneIndex, componentIndex: componentIndex + 1 });
}

export function handleSelectPreviousMulti({
  phoneIndex,
  componentIndex,
  components,
  setSelected,
}: {
  phoneIndex: number;
  componentIndex: number | null;
  components: any[];
  setSelected: (sel: { phoneIndex: number; componentIndex: number } | null) => void;
}) {
  if (componentIndex === null) {
    if (components.length > 0) {
      setSelected({ phoneIndex, componentIndex: components.length - 1 });
    }
  } else if (componentIndex > 0) {
    setSelected({ phoneIndex, componentIndex: componentIndex - 1 });
  }
}

export function handleSelectNextMulti({
  phoneIndex,
  componentIndex,
  components,
  setSelected,
}: {
  phoneIndex: number;
  componentIndex: number | null;
  components: any[];
  setSelected: (sel: { phoneIndex: number; componentIndex: number } | null) => void;
}) {
  if (componentIndex === null) {
    if (components.length > 0) {
      setSelected({ phoneIndex, componentIndex: 0 });
    }
  } else if (componentIndex < components.length - 1) {
    setSelected({ phoneIndex, componentIndex: componentIndex + 1 });
  }
}

// Copy the selected component to clipboardRef
export function handleCopyMultiComponent({
  selected,
  layoutState,
  clipboardRef,
  deepClone = (obj: any) => JSON.parse(JSON.stringify(obj)),
}: {
  selected: { phoneIndex: number, componentIndex: number } | null;
  layoutState: any;
  clipboardRef: React.MutableRefObject<any>;
  deepClone?: (obj: any) => any;
}) {
  if (selected) {
    const { phoneIndex, componentIndex } = selected;
    const layout = layoutState.layouts[phoneIndex];
    if (componentIndex !== null && layout.components[componentIndex]) {
      clipboardRef.current = {
        type: 'component',
        data: deepClone(layout.components[componentIndex])
      };
      console.log('Copied component:', clipboardRef.current.data);
      return true;
    }
  }
  console.log('Copy: nothing selected');
  return false;
}

// Paste the component from clipboardRef into the selected layout
import { FormblockerComponents } from 'src/data/Components';
export function handlePasteMultiComponent({
  selected,
  layoutState,
  dispatch,
  setSelected,
  clipboardRef,
  deepClone = (obj: any) => JSON.parse(JSON.stringify(obj)),
}: {
  selected: { phoneIndex: number, componentIndex: number } | null;
  layoutState: any;
  dispatch: any;
  setSelected: any;
  clipboardRef: React.MutableRefObject<any>;
  deepClone?: (obj: any) => any;
}) {
  const clipboard = clipboardRef.current;
  if (!clipboard || clipboard.type !== 'component') {
    console.log('Paste: clipboard empty or not a component');
    return false;
  }
  if (selected) {
    const { phoneIndex, componentIndex } = selected;
    const layout = layoutState.layouts[phoneIndex];
    if (layout) {
      const newComponent = {
        ...deepClone(clipboard.data),
        Component: (FormblockerComponents as any)[clipboard.data.name]
      };
      // Insert after selected component, or at end if none selected
      const insertIdx = componentIndex !== null ? componentIndex + 1 : layout.components.length;
      const newComponents = [
        ...layout.components.slice(0, insertIdx),
        newComponent,
        ...layout.components.slice(insertIdx)
      ];
      console.log('Pasting component at', insertIdx, newComponent);
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { components: newComponents }
      });
      setSelected({ phoneIndex, componentIndex: insertIdx });
      return true;
    }
  }
  console.log('Paste: no layout selected for component');
  return false;
} 