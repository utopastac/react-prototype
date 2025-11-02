# Multi-Layout System

This document describes the multi-layout system that extends the existing single-phone admin interface to support multiple phone previews with independent state management, drag-and-drop, and prop editing.

## Overview

The multi-layout system allows users to create, edit, and manage multiple phone layouts simultaneously. Each layout has its own independent state, including:

- Dropped components with their props
- Top bar configuration
- Bottom buttons configuration
- Toast configuration
- Visibility toggles

## Grid Layout System (2024)

**New in 2024:** The multi-layout system now supports a flexible grid layout for phone previews. Each layout is placed at a specific row and column in a 2D grid, and the grid grows dynamically as layouts are added or duplicated.

- **layoutPositions**: A mapping from layout index to `{ row, col }` specifying each layout's position in the grid.
- **gridRows, gridCols**: The current size of the grid (number of rows and columns).
- **Adding/Duplicating**: When you add or duplicate a layout, it is placed in the next available grid cell, and the grid expands as needed.
- **Persistence**: The grid state (positions and size) is saved, loaded, and shared along with all other layout data. This ensures that when you restore or share a layout set, the grid appears exactly as intended.
- **UI**: Click an empty grid cell to add a new layout at that position. Duplicate a phone to place a copy in the next cell to the right.

## Architecture

### Core Components

#### 1. MultiLayoutContext (`src/admin/MultiLayoutContext.tsx`)
- **Purpose**: Central state management for multiple layouts
- **Key Features**:
  - Array of layout states (one per phone)
  - Active layout selection
  - Layout names for identification
  - **Grid state**: `layoutPositions`, `gridRows`, `gridCols`
  - Reducer-based state updates
  - Actions for adding, removing, duplicating, and reordering layouts

#### 2. MultiPhonePreview (`src/admin/MultiPhonePreview.tsx`)
- **Purpose**: Renders multiple phone previews in a grid layout
- **Key Features**:
  - Dynamic grid layout (grows as needed)
  - Individual phone selection and editing
  - Cross-phone drag-and-drop
  - Visual feedback for active/selected phones
  - Action buttons for each phone
  - **Grid-aware add/duplicate**: UI actions use grid-aware handlers

#### 3. LayoutTabs (`src/admin/LayoutTabs.tsx`)
- **Purpose**: Tabbed interface for switching between layouts
- **Key Features**:
  - Tab navigation between layouts
  - Add new layout button
  - Rename layout functionality
  - Delete layout with confirmation
  - Drag-and-drop reordering

### Hooks

#### 1. useMultiLayoutData (`src/admin/hooks/useMultiLayoutData.ts`)
- **Purpose**: Serialization and restoration of multi-layout state
- **Key Features**:
  - Export/import multi-layout as JSON
  - Save/load from localStorage
  - URL sharing support
  - Individual layout data access

#### 2. useMultiLayoutHistory (`src/admin/hooks/useMultiLayoutHistory.ts`)
- **Purpose**: History management for multi-layout operations
- **Key Features**:
  - Undo/redo for all layout changes
  - Automatic history capture
  - History statistics
  - Export/import history data

#### 3. useMultiLayoutDragDrop (`src/admin/hooks/useMultiLayoutDragDrop.ts`)
- **Purpose**: Cross-layout drag-and-drop functionality
- **Key Features**:
  - Move components between layouts
  - Copy components with Alt+drag
  - Visual feedback for drag operations
  - Validation of drop targets

## Usage

### Basic Setup

```tsx
import { MultiLayoutProvider } from './MultiLayoutContext';
import MultiLayoutAdminView from './MultiLayoutAdminView';

function App() {
  return (
    <MultiLayoutProvider>
      <MultiLayoutAdminView 
        theme="light"
        scale="1"
        device="M"
        font="standard"
        tabBackground="white"
      />
    </MultiLayoutProvider>
  );
}
```

### Using the Multi-Layout Context

```tsx
import { useMultiLayoutContext, useActiveLayout } from './MultiLayoutContext';

function MyComponent() {
  const [multiLayoutState, dispatch] = useMultiLayoutContext();
  const { layout: activeLayout, index: activeIndex } = useActiveLayout();

  // Add a new layout
  const addLayout = () => {
    dispatch({ type: 'ADD_LAYOUT', name: 'New Layout' });
  };

  // Update the active layout
  const updateActiveLayout = () => {
    dispatch({
      type: 'UPDATE_LAYOUT',
      index: activeIndex,
      payload: { showTopBar: false }
    });
  };

  return (
    <div>
      <button onClick={addLayout}>Add Layout</button>
      <button onClick={updateActiveLayout}>Hide Top Bar</button>
    </div>
  );
}
```

### Using Multi-Layout Data

```tsx
import { useMultiLayoutData } from './hooks/useMultiLayoutData';

function DataManager() {
  const { exportMultiLayout, importMultiLayout } = useMultiLayoutData();

  const saveLayouts = () => {
    const json = exportMultiLayout();
    localStorage.setItem('my-layouts', json);
  };

  const loadLayouts = () => {
    const json = localStorage.getItem('my-layouts');
    if (json) {
      importMultiLayout(json);
    }
  };

  return (
    <div>
      <button onClick={saveLayouts}>Save</button>
      <button onClick={loadLayouts}>Load</button>
    </div>
  );
}
```

### Using Multi-Layout History

```tsx
import { useMultiLayoutHistory } from './hooks/useMultiLayoutHistory';

function HistoryControls() {
  const { handleUndo, handleRedo, canUndo, canRedo } = useMultiLayoutHistory();

  return (
    <div>
      <button onClick={handleUndo} disabled={!canUndo}>Undo</button>
      <button onClick={handleRedo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
```

## State Structure

### MultiLayoutState
```typescript
interface MultiLayoutState {
  layouts: LayoutState[];           // Array of layout states
  activeLayoutIndex: number;        // Currently active layout
  layoutNames: string[];            // Names for each layout
  layoutPositions: Record<number, { row: number, col: number }>; // Grid positions
  gridRows: number;                 // Number of rows in the grid
  gridCols: number;                 // Number of columns in the grid
}
```

### LayoutState
```typescript
interface LayoutState {
  dropped: Component[];            // Dropped components
  showTopBar: boolean;            // Top bar visibility
  topBarProps: TopBarProps;       // Top bar configuration
  showBottomButtons: boolean;     // Bottom buttons visibility
  bottomButtonsProps: ButtonGroupProps; // Bottom buttons configuration
  showToast: boolean;             // Toast visibility
  toastProps: ToastProps;         // Toast configuration
}
```

### MultiLayoutData (for serialization)
```typescript
interface MultiLayoutData {
  layouts: LayoutData[];
  layoutNames: string[];
  activeLayoutIndex: number;
  layoutPositions: Record<number, { row: number, col: number }>;
  gridRows: number;
  gridCols: number;
}
```

## Actions

### Layout Management
- `ADD_LAYOUT`: (legacy, not grid-aware)
- `REMOVE_LAYOUT`: Remove a layout
- `DUPLICATE_LAYOUT`: (legacy, not grid-aware)
- `RENAME_LAYOUT`: Rename a layout
- `REORDER_LAYOUTS`: Reorder layouts
- `SET_ALL_LAYOUTS`: **Grid-aware bulk update** (used for add, duplicate, move, etc.)

### Layout State
- `SET_ACTIVE_LAYOUT`: Set the active layout
- `UPDATE_LAYOUT`: Update a specific layout
- `RESET_LAYOUT`: Reset a layout to initial state
- `RESET_ALL`: Reset all layouts

## Usage

- **Adding a layout**: Click an empty grid cell. The parent handler (`handleAddLayoutAt`) will add a new layout at the specified grid position and update the grid size.
- **Duplicating a layout**: Click the duplicate button on a phone. The parent handler (`handleDuplicateLayoutAt`) will add a copy to the right and update the grid.
- **Saving/Loading/Sharing**: The full grid state is included, so layouts always appear in the correct positions when restored.

## Migration/Changelog (2024)

- The multi-layout system now uses a grid model for layout positions.
- All add/duplicate/move actions are grid-aware and update `layoutPositions`, `gridRows`, and `gridCols`.
- The grid state is persisted in all save/load/share operations.
- UI actions for adding/duplicating layouts must use the new parent handlers (`handleAddLayoutAt`, `handleDuplicateLayoutAt`).
- Legacy actions (`ADD_LAYOUT`, `DUPLICATE_LAYOUT`) are still present for backward compatibility but do not update the grid.

## Drag-and-Drop

### Cross-Layout Operations
- **Move**: Drag a component from one layout to another
- **Copy**: Alt+drag to copy a component between layouts
- **Reorder**: Drag components within the same layout

### Visual Feedback
- Dragged components show a visual indicator
- Drop targets highlight when dragging over
- Invalid drop targets show different styling

## Keyboard Shortcuts

The system supports the following keyboard shortcuts:

- `Ctrl+Tab`: Switch between layouts
- `Ctrl+Shift+N`: Add new layout
- `Ctrl+Shift+D`: Duplicate current layout
- `Ctrl+Shift+Delete`: Delete current layout
- `Ctrl+Z`: Undo
- `Ctrl+Shift+Z`: Redo

## Performance Considerations

### Optimization Strategies
1. **Virtualization**: Only render visible phone previews
2. **Memoization**: Prevent unnecessary re-renders
3. **Lazy Loading**: Load layout data on demand
4. **State Isolation**: Ensure changes to one layout don't affect others

### Memory Management
- History stacks are limited to prevent memory bloat
- Unused layouts can be garbage collected
- Component references are properly cleaned up

## Integration with Existing System

### Migration Path
1. **Gradual Migration**: Start with single layout, add multi-layout as option
2. **Backward Compatibility**: Ensure existing single-layout functionality works
3. **Shared Components**: Reuse existing components where possible
4. **State Migration**: Provide tools to convert single to multi-layout

### Component Reuse
- `PhonePreviewContent`: Reused for individual phone rendering
- `ComponentPanel`: Reused for component palette
- `SettingsPanel`: Reused for layout settings
- `ToolbarButton`: Reused for action buttons

## File Structure

```
src/admin/
├── MultiLayoutContext.tsx          # Multi-layout state management
├── MultiPhonePreview.tsx           # Multi-phone preview component
├── LayoutTabs.tsx                  # Layout switching UI
├── MultiLayoutAdminView.tsx        # Sample integration
├── hooks/
│   ├── useMultiLayoutData.ts       # Multi-layout serialization
│   ├── useMultiLayoutHistory.ts    # Multi-layout history management
│   └── useMultiLayoutDragDrop.ts   # Multi-layout drag-and-drop
└── MULTI_LAYOUT_README.md          # This documentation
```

## Future Enhancements

### Planned Features
1. **Layout Templates**: Pre-built layout templates
2. **Bulk Operations**: Apply changes to multiple layouts
3. **Layout Comparison**: Side-by-side layout comparison
4. **Version Control**: Git-like versioning for layouts
5. **Collaboration**: Real-time collaborative editing

### Performance Improvements
1. **Web Workers**: Move heavy operations to background threads
2. **Canvas Rendering**: Use canvas for better performance
3. **Incremental Updates**: Only update changed components
4. **Compression**: Compress layout data for storage

## Troubleshooting

### Common Issues

1. **Layout Not Updating**
   - Check if you're updating the correct layout index
   - Ensure the dispatch action is correct
   - Verify the component is wrapped in MultiLayoutProvider

2. **Drag-and-Drop Not Working**
   - Check if drag events are properly handled
   - Verify drop target validation
   - Ensure drag data is properly formatted

3. **History Not Working**
   - Check if history manager is properly initialized
   - Verify state changes are being captured
   - Ensure no infinite loops in state updates

### Debug Tools
- Use browser dev tools to inspect state
- Check console for error messages
- Use React DevTools to inspect component state
- Export/import layout data for debugging

## Contributing

When contributing to the multi-layout system:

1. **Follow Patterns**: Use existing patterns for consistency
2. **Add Tests**: Include tests for new functionality
3. **Update Documentation**: Keep this README up to date
4. **Performance**: Consider performance implications
5. **Accessibility**: Ensure accessibility features work

## License

This multi-layout system is part of the Interventions Hub React project and follows the same licensing terms. 