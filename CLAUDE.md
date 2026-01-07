# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start the development server on port 3000 (host: 0.0.0.0)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Environment

The app requires a `GEMINI_API_KEY` environment variable. Set it in `.env.local`:
```
GEMINI_API_KEY=your_key_here
```

The Vite config makes this available as `process.env.GEMINI_API_KEY` at build time.

## Project Architecture

This is a **client-side only React application** using a custom hash-based router. There is no backend server or API routes - all data is mocked.

### Routing

The app uses browser hash routing implemented in `App.tsx`:
- Routes are handled via `window.location.hash`
- Available views: `marketplace`, `dashboard` (developer), `admin-dashboard`, `user-dashboard`, `login`, `build-service`, `product-detail`, `checkout-success`
- Navigation uses the `navigateTo()` function which updates both hash and state

### State Management

All state is managed in `App.tsx` and passed down via props:
- `currentView` - Current route/view
- `selectedProject` - Currently selected product
- `userRole` - Logged-in user role: `buyer | developer | admin`
- `licenses` - Shared state between UserDashboard (refunds) and DeveloperDashboard (sales)

### Directory Structure

```
/
├── App.tsx              # Main app with routing and state
├── index.tsx            # React entry point
├── types.ts             # TypeScript type definitions
├── components/          # Reusable UI components (Button, Icons, ProjectCard, PricingBadge)
├── pages/               # Page components for each view
└── services/
    └── mockData.ts      # All mock data (projects, licenses, users)
```

### Key Types (`types.ts`)

- `Project` - Products listed on marketplace with pricing tier, status, features
- `License` - Purchase licenses with 60-day payout logic
- `User` - Users with role and status
- `PricingTier` - Free, Standard ($9.90), Premium ($19.90)
- `ViewState` - Union type of all available views

### Mock Data

All mock data lives in `services/mockData.ts`:
- `MOCK_PROJECTS` - Sample projects for marketplace
- `MOCK_LICENSES` - Generated licenses with date-based payout status logic
- `REVENUE_DATA` - Mock revenue chart data
- `MOCK_USERS` - Sample users for admin

License payout status is calculated based on dates:
- `pending` - Less than 60 days since payment
- `ready` - 60+ days since payment (awaiting payout)
- `paid` - Payout completed
- `cancelled` - License was refunded

### Role-Based Access

- **Buyer** - Can browse marketplace, purchase products, view "My Library", request refunds
- **Developer** - Has a dashboard showing sales/revenue, can manage products
- **Admin** - Has access to admin console with impersonation abilities, full user/license management

### Components

- `Icons.tsx` - Lucide-react icon wrapper component
- `Button.tsx` - Reusable button with variants (primary, secondary, ghost)
- `ProjectCard.tsx` - Card component for marketplace items
- `PricingBadge.tsx` - Badge showing pricing tier (Free/Standard/Premium)

## TypeScript Configuration

- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Path alias: `@/*` maps to root directory
