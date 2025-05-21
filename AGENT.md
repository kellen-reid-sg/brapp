# Boot Room Agent Guidelines

## Commands
- Dev server: `npm run dev` (runs on port 2222)
- Build: `npm run build`
- Start production: `npm run start`
- Lint: `npm run lint`

## Code Style Guidelines
- **Imports**: Group imports by: React/Next.js core, external libraries, internal components, styles
- **Components**: Use functional components with named exports
- **Formatting**: Use double quotes for JSX attributes, single quotes for JavaScript strings
- **Naming**: 
  - PascalCase for components and files containing components (e.g., `SessionBuilder.jsx`)
  - camelCase for utility functions and non-component files
- **File structure**: JSX components use `.jsx` extension, utilities use `.js`
- **Client components**: Add `"use client"` directive at the top of client components
- **Styling**: Use Tailwind CSS classes for styling
- **Paths**: Use `@/` alias for imports from project root
- **Code organization**: Keep related functionality in the same directory