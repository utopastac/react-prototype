# PhonePreviewContent

## Overview

`PhonePreviewContent` is the core component responsible for rendering the live preview of the UI layout in the admin interface. It simulates a phone screen, displaying all dropped components, the top bar, bottom buttons, and provides interactive features like selection and drag-and-drop reordering.

---

## Purpose

- To visually represent the current layout as it would appear on a phone.
- To allow users to select, reorder, and interact with components in the layout.
- To provide drop targets and visual feedback for drag-and-drop operations.
- To handle special UI elements (top bar, bottom buttons) and their selection.

---

## Usage

`PhonePreviewContent` is rendered by `AdminView` and receives all layout and interaction state as props.

**Key props:**

- `dropped`, `selectedIdx`, `setSelectedIdx`: The list of components and selection state.
- `draggedIdx`, `setDraggedIdx`, `dragOverIdx`, `setDragOverIdx`: Drag-and-drop state.
- `isAltPressed`, `setIsAltPressed`: Modifier key state for advanced interactions.
- `showTopBar`, `topBarProps`, `setSelectedSpecial`: Top bar state and selection.
- `showBottomButtons`, `bottomButtonsProps`: Bottom button group state.
- `setDropped`: Callback to update the layout.
- `onOpenInsertModal`, `onDuplicate`, `onDelete`, `onDragEnd`: Action callbacks.
- `styles`, `TopBar`, `ButtonGroup`, `IOSStatusBar`, `IOSHomeIndicator`, etc.: UI components and styles.

**Example:**

```tsx
<PhonePreviewContent
  dropped={dropped}
  selectedIdx={selectedIdx}
  setSelectedIdx={setSelectedIdx}
  draggedIdx={dragAndDrop.draggedIdx}
  setDraggedIdx={dragAndDrop.setDraggedIdx}
  dragOverIdx={dragAndDrop.dragOverIdx}
  setDragOverIdx={dragAndDrop.setDragOverIdx}
  isAltPressed={isAltPressed}
  setIsAltPressed={setIsAltPressed}
  showTopBar={showTopBar}
  topBarProps={topBarProps}
  setSelectedSpecial={setSelectedSpecial}
  showBottomButtons={showBottomButtons}
  bottomButtonsProps={bottomButtonsProps}
  setDropped={setDropped}
  styles={styles}
  TopBar={TopBar}
  ButtonGroup={ButtonGroup}
  IOSStatusBar={IOSStatusBar}
  IOSHomeIndicator={IOSHomeIndicator}
  showComponentNames={showComponentNames}
  selectedSpecial={selectedSpecial}
  onOpenInsertModal={handleOpenInsertModal}
  onDuplicate={handleDuplicate}
  onDelete={handleDelete}
  onDragEnd={dragAndDrop.handleDragEnd}
/>
```

---

## Drag-and-Drop Logic

- Each component in the preview is rendered with drag event handlers.
- When a drag starts, the index of the dragged component is tracked.
- As the user drags over other components, the `dragOverIdx` is updated to provide drop feedback.
- On drop, the dragged component is moved to the new position in the layout.
- Visual feedback (highlighting, drop targets) is provided throughout the interaction.

---

## Selection and Actions

- Clicking a component selects it for editing (opens the prop editor).
- Special UI elements (top bar, bottom buttons) can also be selected for editing.
- Action callbacks allow for duplicating, deleting, or inserting components at specific positions.

---

## Extensibility

- New components added to the layout will automatically be supported as long as they are included in the `dropped` array.
- The drag-and-drop and selection logic is generic and works for any component type.
- Visual and interaction styles can be customized via the `styles` prop.

---

## Tips

- Use clear visual cues for selection and drag-over states to improve UX.
- Keep the drag-and-drop logic in sync with the state in `AdminView`.
- Use the provided callbacks to implement custom actions (duplicate, delete, etc.).

---

## Related Files

- `PhonePreviewContent.tsx`: The main implementation.
- `AdminView.tsx`: Where the preview is rendered and state is managed.
- `hooks/useDragAndDrop.ts`: Drag-and-drop state and handlers.
- `componentHandlers.ts`: Utilities for manipulating the layout.

---

**`PhonePreviewContent` is the heart of the live editing experience in the admin system.** 