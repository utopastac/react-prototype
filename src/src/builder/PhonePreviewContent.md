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

- `components`, `selectedIdx`, `setSelectedIdx`: The list of components and selection state.
- `showTopBar`, `topBarProps`, `setSelectedSpecial`: Top bar state and selection.
- `showBottomButtons`, `bottomButtonsProps`: Bottom button group state.
- `setComponents`: Callback to update the layout.
- `styles`, `TopBar`, `ButtonGroup`, `IOSStatusBar`, `IOSHomeIndicator`, etc.: UI components and styles.

**Example:**

```tsx
<PhonePreviewContent
  components={components}
  selectedIdx={selectedIdx}
  setSelectedIdx={setSelectedIdx}
  showTopBar={showTopBar}
  topBarProps={topBarProps}
  setSelectedSpecial={setSelectedSpecial}
  showBottomButtons={showBottomButtons}
  bottomButtonsProps={bottomButtonsProps}
  setComponents={setComponents}
  styles={styles}
  TopBar={TopBar}
  ButtonGroup={ButtonGroup}
  IOSStatusBar={IOSStatusBar}
  IOSHomeIndicator={IOSHomeIndicator}
  showComponentNames={showComponentNames}
  selectedSpecial={selectedSpecial}
/>
```

---

## Selection

- Clicking a component selects it for editing (opens the prop editor).
- Special UI elements (top bar, bottom buttons) can also be selected for editing.

---

## Extensibility

- New components added to the layout will automatically be supported as long as they are included in the `components` array.
- The selection logic is generic and works for any component type.
- Visual and interaction styles can be customized via the `styles` prop.

---

## Related Files

- `PhonePreviewContent.tsx`: The main implementation.
- `AdminView.tsx`: Where the preview is rendered and state is managed.
- `hooks/useDragAndDrop.ts`: Drag-and-drop state and handlers.
- `componentHandlers.ts`: Utilities for manipulating the layout.

---

**`PhonePreviewContent` is the heart of the live editing experience in the admin system.** 