# Admin Layout Grid System

This document describes the current multi-phone admin system powered by `AdminLayoutContext`, the grid-based `PhonePreview`, and the admin view coordination in `AdminView.tsx`.

## Overview

You can create, edit, duplicate, save, load, and share multiple phone layouts in a grid. Each layout has its own state:

- Dropped components and their props
- Top bar, bottom buttons, status bar, and toast (with visibility toggles)
- Grid position and label

The grid grows dynamically as layouts are added or duplicated, and its state is persisted in saves/loads and shared URLs.

## Core Pieces (Current)

- `src/src/admin/AdminLayoutContext.tsx`
  - Holds all layout state and reducer actions
  - Tracks `layouts`, `layoutNames`, `layoutPositions`, `gridRows`, `gridCols`, and `activeLayout`

- `src/src/admin/PhonePreview.tsx`
  - Renders the phones in a grid
  - Handles selection, duplication, and grid-aware add operations via callbacks from the parent

- `src/src/admin/AdminView.tsx`
  - Orchestrates UI, keyboard shortcuts, autosave/restore, and modal routing
  - Provides handlers: `handleAddLayoutAt`, `handleAddLayoutWithTemplate`, `handleDuplicateLayoutAt`
  - Passes grid and selection props to `PhonePreview`

- `src/src/admin/components/TemplatePicker/TemplatePicker.tsx`
  - Floating picker used when adding a layout at a specific grid cell with a template
  - Uses a CSS module; outside-click closes the picker

- `src/src/admin/components/ModalsManager/ModalsManager.tsx`
  - Centralizes rendering of Save, Load, Share, Clear All, Shortcuts, and Templates modals

- `src/src/admin/components/AdminPanelToggle/AdminPanelToggle.tsx`
  - Small reusable component for showing the admin panel toggle

- `src/src/admin/utils/updateNestedState.ts`
  - Deep state update utility used by property editing

## Grid Model

- `layoutPositions: Record<number, { row: number; col: number }>`: Grid placement for each layout
- `gridRows`, `gridCols`: Current grid size
- `handleAddLayoutAt(row, col)`: Adds a new (or templated) layout and updates grid size
- `handleDuplicateLayoutAt(index)`: Duplicates a layout into the next available grid cell

All of the above are persisted in saves/loads and in shared links.

## Persistence & Sharing

- Autosave/restore of the current state is handled in `AdminView.tsx` using localStorage
- Sharing creates a URL with embedded layout data; the receiver restores the exact grid and layouts

## Example Integration

```tsx
import AdminView from './AdminView';

function App() {
  return (
    <AdminView theme="light" scale="1" device="M" font="standard" tabBackground="white" />
  );
}
```

## Relevant Actions (AdminLayoutContext)

- `SET_ALL_LAYOUTS`: Grid-aware bulk update (layouts, names, positions, rows/cols)
- `SET_ACTIVE_LAYOUT(index)`: Change active layout
- `UPDATE_LAYOUT({ index, payload })`: Update a specific layout
- `RESET_LAYOUT(index)`: Reset a specific layout
- `RESET_ALL()`: Reset all layouts

## Keyboard Shortcuts (current)

- Undo/Redo, Save/Load, Share, Toggle admin panel, Templates library, and Clear All are wired in `AdminView.tsx` via `useKeyboardShortcuts`

## File Map (Current)

```
src/src/admin/
├── AdminLayoutContext.tsx
├── AdminThemeContext.tsx
├── AdminView.tsx
├── PhonePreview.tsx
├── components/
│   ├── AdminPanelToggle/
│   ├── ModalsManager/
│   └── TemplatePicker/
├── hooks/
│   ├── useHistoryManager.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useLayoutData.ts
│   └── useUrlSharing.ts
└── utils/
    └── updateNestedState.ts
```

## Notes

- Older references (e.g., `MultiLayoutContext`, `MultiPhonePreview`, `LayoutTabs`) have been consolidated into the current `AdminLayoutContext` + grid-based `PhonePreview` model.
- If you add new UI pieces, prefer a CSS module per component and CSS variables for theme-driven colors.