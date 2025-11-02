# GenericPropEditor

## Overview

`GenericPropEditor` is a dynamic, reusable React component for editing the properties (props) of any UI component in the admin interface. It is designed to work with a metadata-driven approach, allowing it to render appropriate input fields for a wide variety of prop types without custom code for each component.

It is used throughout the admin system to provide a consistent, extensible property editing experience for both regular components and special UI elements (like the top bar and bottom buttons).

---

## Purpose

- To provide a flexible, schema-driven UI for editing component props.
- To support a wide range of prop types (strings, numbers, booleans, arrays, objects, enums, etc.).
- To allow for easy extension as new component types and prop types are added.
- To be used as the main prop editor in the admin panel and for special components.

---

## Usage

`GenericPropEditor` is typically rendered with the following props:

- `title`: The title to display at the top of the editor (e.g., "Component Settings").
- `meta`: The prop metadata object describing the shape, types, and labels for each prop.
- `values`: The current values for the props being edited.
- `onChange`: Callback for when a prop value changes. Receives `(fullKey, value)`.
- `onDismiss`: Callback for when the editor should be closed/dismissed.

**Example:**

```tsx
<GenericPropEditor
  title="Component Settings"
  meta={ComponentPropMeta[componentName]}
  values={componentProps}
  onChange={handleMetaPropChange}
  onDismiss={() => setSelectedIdx(null)}
/>
```

---

## How It Works

- The `meta` prop describes each editable property, including its type, label, and any constraints (e.g., enum values).
- The editor renders a form with the appropriate input for each property (text input, select, checkbox, etc.).
- When a value changes, `onChange` is called with the full property path (supports nested/array props) and the new value.
- The parent component is responsible for updating state accordingly.

---

## Extensibility

- To support a new prop type, extend the logic in `GenericPropEditor` to render the appropriate input.
- To add a new component to the admin system, simply define its prop metadata in `ComponentPropMeta`.
- The editor will automatically support new components and prop types as long as the metadata is provided.

---

## Tips

- Use clear, descriptive labels in your prop metadata for a better editing experience.
- For deeply nested or array props, ensure your `onChange` handler can update nested state (see `updateNestedState` in `AdminView.tsx`).
- You can use `GenericPropEditor` for both regular components and special UI elements (like the top bar or button group).

---

## Related Files

- `GenericPropEditor.tsx`: The main implementation.
- `ComponentPropMeta`: Metadata describing props for each component.
- `AdminView.tsx`: Where the editor is used and state is managed.

---

**`GenericPropEditor` is a key part of the admin system's flexibility and extensibility.** 