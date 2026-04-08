# Next.js Template

A modern Next.js 15 template with TypeScript, Tailwind CSS v4, and best practices setup.

## Features

- Next.js 15 with App Router
- Tailwind CSS v4
- TypeScript
- ESLint + Prettier
- Responsive navigation (Desktop & Mobile)
- Path aliases configured (`@/*`)
- Error handling (error.tsx, not-found.tsx)
- Loading states (loading.tsx)

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   ├── error.tsx     # Error boundary
│   ├── not-found.tsx # 404 page
│   └── loading.tsx   # Loading state
├── components/       # React components
│   ├── layout/      # Layout components (Header, Footer)
│   └── ui/          # UI components (Buttons, Links, etc.)
└── assets/          # Static assets
    └── styles/      # Global styles
```

## Component Guidelines

### Layout Components
Layout components (Header, Footer, containers) should be placed in `src/components/layout/`

### UI Components
Reusable UI components (buttons, links, cards) should be placed in `src/components/ui/`

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Deployment

### Vercel (Recommended)

When you create a new project from this template, you can easily deploy it to Vercel:

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

2. **Automatic Preview Deployments:**
   - Every Pull Request automatically gets a preview deployment
   - Preview URL is added as a comment on the PR
   - Production deployments happen on push to `main` branch

3. **Environment Variables:**
   - Add your environment variables in Vercel dashboard
   - Settings → Environment Variables
   - They'll be available in both preview and production

4. **That's it!** No additional configuration needed. Vercel handles everything automatically.

### Alternative: GitHub Actions Workflow

This template includes a preview deployment workflow (`.github/workflows/preview.yml`). If you prefer to use it instead of Vercel's native integration:
- Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` to GitHub Secrets
- Get these from Vercel dashboard or CLI

## Troubleshooting

### Tailwind autocomplete not working
Make sure you have updated Tailwind IntelliSense. If it continues, add this line to your `settings.json`:
- Open settings with `Ctrl + ,` (Windows) or `Cmd + ,` (Mac)
- Search for `tailwind css > experimental: config file`
- Add:
  ```json
  "tailwindCSS.experimental.configFile": "src/assets/styles/globals.css"
  ```

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## License

Private - Design by Californya
