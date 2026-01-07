# Gemini Context: ui-devehub

## Project Overview
**ui-devehub** is a client-side React application designed as a marketplace/dashboard for AI tools. It uses **Vite** for the build tooling and **TypeScript** for type safety. The application relies entirely on mock data and does not connect to a live backend.

### Key Technologies
*   **Framework:** React 19
*   **Build Tool:** Vite
*   **Language:** TypeScript (ESNext target)
*   **Styling:** Tailwind CSS (implied by utility class usage)
*   **Icons:** `lucide-react`
*   **Internationalization:** `react-i18next`

## Architecture & Conventions

### 1. Routing
*   **Hash-Based:** The app uses a custom hash-based routing mechanism (`window.location.hash`).
*   **Implementation:** Routing logic is centralized in `App.tsx`.
*   **Navigation:** Navigate using the `navigateTo()` function or by modifying the window hash.
*   **Views:** Pages are located in the `pages/` directory (e.g., `Dashboard.tsx`, `Marketplace.tsx`, `Login.tsx`).

### 2. State Management
*   **Local State:** State is primarily managed in `App.tsx` and passed down to child components via props.
*   **Mock Data:** All data is mocked in `services/mockData.ts` (e.g., `MOCK_PROJECTS`, `MOCK_LICENSES`). **Do not** attempt to fetch data from real external APIs unless explicitly instructed to integrate one.

### 3. Component Structure
*   **Atomic Design:** Reusable UI elements are in `components/` (e.g., `Button.tsx`, `ProjectCard.tsx`).
*   **Page Views:** Feature-rich views are in `pages/`.
*   **Styling:** Use Tailwind CSS utility classes directly in JSX `className` attributes.

### 4. Internationalization (i18n)
*   **Config:** Located in `i18n/config.ts`.
*   **Resources:** Translations are stored in JSON files under `i18n/locales/` (`en.json`, `zh.json`).
*   **Usage:** Use the `useTranslation` hook from `react-i18next`.

## Development Workflow

### Build & Run
*   **Install Dependencies:** `npm install`
*   **Start Dev Server:** `npm run dev` (Runs on `http://localhost:3000`)
*   **Build for Production:** `npm run build`
*   **Preview Production Build:** `npm run preview`

### Environment Variables
*   Create a `.env.local` file for local development.
*   Required variable: `GEMINI_API_KEY` (accessed via `process.env.GEMINI_API_KEY` or `import.meta.env` depending on context, though `vite.config.ts` defines a `process.env` polyfill).

## Key Files
*   `App.tsx`: Main entry point, handles routing and global state.
*   `services/mockData.ts`: Source of truth for all application data.
*   `types.ts`: TypeScript definitions for domain entities (Project, User, License).
*   `vite.config.ts`: Configuration for the Vite bundler.

## Coding Style
*   **Functional Components:** Use React Functional Components (`React.FC<Props>`).
*   **Typing:** strictly type all props and state using interfaces defined in `types.ts` or locally.
*   **UI Components:** Prefer creating small, reusable components in `components/` over monolithic page files.
*   **Icons:** Use the `Icons` wrapper component (`components/Icons.tsx`) which maps to `lucide-react` icons.
