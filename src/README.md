# Interventions Hub React

A modern, interactive React application for our Interventions Hub.

![Interventions Hub React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.1-purple?style=flat-square&logo=vite)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.0.8-black?style=flat-square&logo=framer)

## 🚀 Features

### Core Functionality
- **Complete Interventions Hub Interface**: Interventions Hub is the destination for the interventions platform
- **Interactive Navigation**: Smooth animated transitions between screens with Framer Motion
- **Mobile-First Design**: Responsive design optimized for mobile devices with iOS-style status bars and home indicators
- **Real-time Balance Display**: Dynamic balance and transaction management
- **Crypto Integration**: Crypto balance display and management interface

### Advanced UI/UX
- **Theme Support**: Light and Dark themes with real-time switching
- **Accessibility Features**: Text scaling (0.75x to 1.5x)
- **Device Simulation**: Support for different device sizes (XS, S, M, L)
- **3D Tilt Effects**: Interactive phone tilt animations with gyroscope-like behavior

### Developer Experience
- **Component Library**: Extensive collection of reusable UI components
- **TypeScript**: Full type safety throughout the application
- **SASS Modules**: Modular styling with CSS modules
- **Hot Reload**: Fast development with Vite's hot module replacement

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **Styling**: SASS with CSS Modules
- **Animations**: Framer Motion 11.0.8, GSAP 3.12.5
- **Routing**: React Router DOM 6.26.2
- **Physics**: Matter.js for interactive elements
- **Icons**: Custom SVG icon system with multiple sizes (16px, 24px, 32px)
- **Linting**: ESLint with TypeScript support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interventions-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

## 🎮 Usage

### Navigation
- Use the bottom navigation bar to switch between main app sections
- Navigate through different flows like Reporting

### Keyboard Shortcuts
- `/` - Toggle phone visibility
- `,` - Toggle phone tilt mode
- `wow` - Toggle spinning animation
- `blur` - Toggle blur effects

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Buttons/         # Button components (Standard, Prominent, etc.)
│   ├── Cell/            # Cell components for lists
│   ├── Input/           # Input components
│   ├── NavigationBar/   # Bottom navigation
│   ├── TitleBar/        # Header components
│   ├── Icon/           # Icon system
│   └── ...
├── containers/          # Context providers and state management
│   ├── ThemeContext.tsx    # Theme management
│   ├── UserContext.tsx     # User data management
│   ├── ActivityContext.tsx # Activity/transaction data
│   └── ...
├── views/              # Main application screens
│   ├── ActivityView.tsx    # Transaction history
│   ├── AccountView.tsx     # User profile
│   └── ...
├── data/               # Static data and constants
│   ├── Avatars.tsx     # Avatar images
│   ├── Icons.tsx       # Icon definitions
│   ├── colors.tsx      # Color schemes
│   └── ...
├── hooks/              # Custom React hooks
├── styles/             # Global styles and SASS variables
└── utils/              # Utility functions
```

## 🧩 Admin Layout State Management

The admin/editor interface uses a **reducer-based state management system** for all layout-related state. This is implemented via a React context (`LayoutContext`) and reducer, providing a single source of truth for the editor's layout, selection, and special UI elements.

### How It Works
- **All layout state** (dropped components, selection, top bar, bottom buttons, toast, etc.) is managed in a single reducer.
- The reducer and state are provided via `LayoutProvider` (see `src/builder/LayoutContext.tsx`).
- Any component within the provider tree can access and update the layout state using the `useLayoutContext` hook:
  ```tsx
  import { useLayoutContext } from 'src/builder/LayoutContext';
  const [layoutState, dispatch] = useLayoutContext();
  ```
- **Actions** are dispatched to update state (e.g., `dispatch({ type: 'SET_DROPPED', dropped: [...] })`).
- **Resetting** the layout is a single action: `dispatch({ type: 'RESET' })`.

### Serialization & Restoration
- The `useLayoutData` hook provides methods to **serialize** the current layout (for saving/sharing) and **restore** from saved data:
  ```tsx
  const { getLayoutData, restoreLayout } = useLayoutData();
  // getLayoutData() returns a serializable object
  // restoreLayout(data) restores the layout from serialized data
  ```
- Used by features like **undo/redo**, **localStorage persistence**, and **URL sharing**.

### Benefits
- **Undo/Redo**: The entire layout state can be pushed to a history stack for robust undo/redo.
- **Reset**: All layout state can be reset with a single action.
- **Persistence**: Layouts can be saved/loaded from localStorage.
- **Sharing**: Layouts can be shared via URL or exported/imported.
- **Single Source of Truth**: All layout logic is centralized, making the editor more maintainable and extensible.

### Example Usage
```tsx
import { useLayoutContext } from 'src/builder/LayoutContext';
const [layoutState, dispatch] = useLayoutContext();

// Update dropped components
const addComponent = (component) => {
  dispatch({ type: 'SET_DROPPED', dropped: [...layoutState.dropped, component] });
};

// Reset layout
const reset = () => dispatch({ type: 'RESET' });
```

See `src/builder/LayoutContext.tsx` and `src/builder/AdminView.tsx` for more details and usage patterns.

## 🎨 Component System

### Components
The project uses a comprehensive component system that includes:

- **Button**: Multiple button styles (Standard, Prominent, Destructive, etc.)
- **Cell**: List items with various layouts
- **Input**: Form inputs with validation
- **NavigationBar**: Bottom navigation with animations
- **TitleBar**: Headers with customizable actions

### Icon System
- **Multiple Sizes**: 16px, 24px, 32px variants
- **Color Variants**: White, prominent, and custom colors
- **SVG-based**: Scalable vector graphics for crisp display
- **Organized Categories**: Navigation, actions, status, and more

## 🌈 Theming System

The application supports theme switching:

- **Light Theme**: Default light mode
- **Dark Theme**: Dark mode for low-light environments

Each theme includes:
- Color schemes for all UI elements
- Accessibility considerations
- Consistent visual hierarchy

## 📱 Mobile Features

- **iOS-style Status Bar**: Realistic status bar with time, battery, and signal indicators
- **Home Indicator**: iOS-style home indicator for gesture navigation
- **Touch Interactions**: Optimized touch targets and gestures
- **Responsive Design**: Adapts to different screen sizes
- **Device Simulation**: Test on various device dimensions

## 🎭 Animation System

### Framer Motion Integration
- **Page Transitions**: Smooth animated route changes
- **Component Animations**: Entrance and exit animations
- **Interactive Elements**: Hover and tap animations
- **Gesture Support**: Drag, swipe, and pinch gestures

### GSAP Animations
- **Complex Sequences**: Multi-step animation sequences
- **Timeline Control**: Precise timing and easing
- **Performance Optimized**: Hardware-accelerated animations


## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:check  # Type check and build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **SASS Modules**: Scoped styling
- **Component Structure**: Consistent file organization

### Performance
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Assets**: SVG optimization and compression
- **Bundle Analysis**: Built-in bundle size monitoring

## 🚀 Deployment

The project is configured for deployment with:
- **Base Path**: `/sites/interventions-hub/`
- **Asset Optimization**: Automatic asset hashing and compression
- **Build Output**: Optimized for production environments

### Build Process
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Inspired by Interventions Hub's design and functionality
- Built with modern React patterns and best practices
- Uses cutting-edge animation and interaction libraries
- Designed with accessibility and performance in mind

---
