# AdminView README

## Overview

The `AdminView` is a powerful, interactive admin/editor interface for building and previewing UI layouts in a phone-like environment. It allows users to:

- Drag and drop components to build a layout.
- Edit properties of each component via a prop editor.
- Manage special UI elements like the top bar and bottom button group.
- Save, load, and share layouts.
- Use keyboard shortcuts for power-user workflows.

The system is modular, extensible, and designed for rapid prototyping and testing of UI flows.

---

## Main Components

### 1. `AdminView`

This is the root component for the admin interface. It manages all high-level state, including:

- The list of dropped components (the "layout").
- Which component is selected for editing.
- Visibility and properties of special UI elements (top bar, bottom buttons).
- Modal dialogs for inserting, saving, loading, sharing, and clearing layouts.
- The admin panel (component palette) and settings panel.
- Keyboard shortcuts and drag-and-drop logic.

**Key state variables:**

- `dropped`: Array of components currently in the layout.
- `selectedIdx`: Index of the currently selected component.
- `selectedSpecial`: Which special component (top bar or bottom buttons) is selected.
- `showAdminPanel`: Whether the component palette/settings are visible.
- `openModal`: Which modal dialog (if any) is open.
- `showComponentNames`, `isAltPressed`, etc.: Various UI/UX flags.

**Key hooks:**

- `useKeyboardShortcuts`: Handles all keyboard navigation and actions.
- `useDragAndDrop`: Encapsulates drag-and-drop logic for rearranging components.
- `useLocalStorage`: Handles saving/loading layouts to/from local storage.
- `useUrlSharing`: Handles sharing layouts via URL.

---

### 2. `PhonePreviewContent`

This component is responsible for rendering the "phone" preview area. It receives all the dropped components, the current selection, and drag state as props. It is responsible for:

- Rendering the top bar, bottom buttons, and all dropped components in order.
- Highlighting the selected component.
- Handling click events to select components or special UI elements.
- Providing drop targets for drag-and-drop reordering.
- Exposing callbacks for actions like duplicate, delete, and insert.

**Props include:**

- `dropped`, `selectedIdx`, `setSelectedIdx`
- `draggedIdx`, `setDraggedIdx`, `dragOverIdx`, `setDragOverIdx`
- `isAltPressed`, `setIsAltPressed`
- `showTopBar`, `topBarProps`, `setSelectedSpecial`
- `showBottomButtons`, `bottomButtonsProps`
- `onOpenInsertModal`, `onDuplicate`, `onDelete`, `onDragEnd`
- And more...

---

### 3. Drag-and-Drop System

The drag-and-drop system is implemented via the custom `useDragAndDrop` hook, which manages all the state and handlers needed for:

- Initiating a drag (setting which component is being dragged).
- Tracking which component is being dragged over (for drop targets).
- Handling drop events to reorder components.
- Handling drag enter/leave to provide visual feedback.
- Supporting keyboard-based reordering as well.

**How it works:**

- Each component in the phone preview is rendered with drag event handlers.
- When a drag starts, the dragged component's index is stored.
- As the user drags over other components, the `dragOverIdx` is updated.
- On drop, the dragged component is moved to the new position in the `dropped` array.
- The UI updates to reflect the new order.

**Visual feedback:**

- The phone preview area highlights when a drag is in progress.
- Drop targets are visually indicated.
- The selected component is highlighted.

---

## Panels and Modals

- **ComponentPanel**: The palette of available components to drag into the layout.
- **SettingsPanel**: Controls for toggling special UI elements, applying templates, and clearing the layout.
- **EditorToolbar**: Floating toolbar for quick actions (delete, duplicate, move up/down) on the selected component.
- **GenericPropEditor**: Dynamic form for editing the properties of the selected component or special UI element.
- **Modals**: For inserting new components, saving/loading layouts, sharing, and confirming destructive actions.

---

## State Management

All state is managed via React hooks (`useState`, custom hooks). The state is highly modular:

- Layout state (`dropped`, `selectedIdx`, etc.) is local to `AdminView`.
- Drag-and-drop state is encapsulated in `useDragAndDrop`.
- Persistence (save/load/share) is handled by custom hooks that interact with local storage and the URL.

---

## Keyboard Shortcuts

Power users can use keyboard shortcuts for:

- Navigating between components.
- Duplicating, deleting, and moving components.
- Toggling the admin panel and prop editor.
- Resetting the layout.

Shortcuts are managed by the `useKeyboardShortcuts` hook.

---

## Extending the System

To add a new component to the palette:

1. Add the component to `FormblockerComponents` and `initialComponentProps`.
2. Define its prop metadata in `ComponentPropMeta`.
3. It will automatically appear in the admin panel and be editable in the prop editor.

---

## File Structure

- `AdminView.tsx`: Main admin interface.
- `PhonePreviewContent.tsx`: Renders the phone preview and dropped components.
- `componentHandlers.ts`: Utility functions for manipulating the layout.
- `hooks/`: Custom hooks for drag-and-drop, keyboard shortcuts, local storage, and URL sharing.
- `components/`: UI components for the admin panel, prop editor, toolbars, etc.
- `Modals/`: Modal dialogs for insert, save, load, share, and clear actions.

---

## Example Flow

1. **Add a component**: Drag from the palette or click to add. It appears in the phone preview.
2. **Select a component**: Click on it in the preview. The prop editor opens.
3. **Edit properties**: Use the prop editor to change props. Changes are live.
4. **Reorder**: Drag components up/down in the preview.
5. **Save/Load**: Use the save/load modals to persist or restore layouts.
6. **Share**: Generate a shareable URL for the current layout.

---

## Tips

- Use the admin panel to quickly add, search, or filter components.
- Use keyboard shortcuts for rapid editing.
- The system is designed to be robust against accidental data loss (with confirmation modals and local storage).
- The code is modular—most logic is encapsulated in hooks or utility files for easy maintenance.

---

## For More Details

- See `PhonePreviewContent.tsx` for the rendering and selection logic.
- See `hooks/useDragAndDrop.ts` for the drag-and-drop implementation.
- See `componentHandlers.ts` for layout manipulation utilities.
- See `GenericPropEditor.tsx` for the dynamic prop editing UI.

---

**This README should provide a solid foundation for understanding and extending the AdminView system.** If you have specific questions about any part of the codebase, check the relevant file or ask for a deep dive on a particular feature! 