# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Evanyi's portfolio website for showcasing and tracking performance metrics of web services and mobile applications. Built with Vite + React, featuring minimal typography-focused design with zero maintenance overhead.

## Technology Stack

- **Frontend**: Vite + React
- **Styling**: CSS Modules or styled-components  
- **Data Source**: Static JSON file (`src/data/projects.json`)
- **Deployment**: Vercel with automatic Git integration
- **Domain**: Custom domain (optional)

## Development Commands

When the project is implemented, these will be the standard commands:

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter (if configured)

# Deployment
git push origin main # Auto-deploy via Vercel
```

## Project Structure

```
evanyi-portfolio/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ProjectList.jsx
│   │   ├── ProjectItem.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   └── projects.json
│   ├── styles/
│   │   ├── global.css
│   │   └── components/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── vercel.json
```

## Data Schema

The `src/data/projects.json` file follows this structure:

```json
{
  "meta": {
    "lastUpdated": "2025-07-03T10:30:00Z",
    "version": "1.0.0"
  },
  "navigation": {
    "primaryProjects": [
      {"name": "TaskFlow", "url": "https://taskflow.app"},
      {"name": "WeatherApp", "url": "https://weather.app"}
    ]
  },
  "social": {
    "twitter": "@evanyi",
    "email": "hello@evanyi.com", 
    "github": "github.com/evanyi"
  },
  "projects": [
    {
      "id": "taskflow-2025",
      "name": "TaskFlow",
      "url": "https://taskflow.app",
      "description": "Simple task management for busy people",
      "status": "launched",
      "management": "active",
      "users": {"count": 1200, "trend": "up", "unit": "users"},
      "revenue": {"monthly": "$300", "trend": "up", "currency": "USD"},
      "launchDate": "2024-03-15",
      "featured": true,
      "tags": ["productivity", "web-app"]
    }
  ]
}
```

## Design System

### Color Palette
```css
:root {
  --color-primary: #000000;      /* Main text */
  --color-secondary: #333333;    /* Secondary text */
  --color-tertiary: #666666;     /* Captions */
  --color-accent: #0066CC;       /* Links */
  --color-background: #FFFFFF;   /* Background */
  --color-border: #EEEEEE;       /* Subtle borders */
}
```

### Typography Scale
- H1 (Brand): 24-32px, font-weight: 700
- H2 (Project): 18-20px, font-weight: 500  
- Body: 14-16px, font-weight: 400
- Caption: 12-14px, font-weight: 400

### Responsive Layout
- Container: Max-width 800px, centered
- Mobile-first approach with breakpoints at 768px and 1024px
- Section margins: 3rem (48px)
- Element margins: 1.5rem (24px)

## Icon System

```javascript
const STATUS_ICONS = {
  'launched': '🚀',
  'development': '🛠️', 
  'paused': '⏸️',
  'discontinued': '🔚'
};

const MANAGEMENT_ICONS = {
  'active': '✅',
  'maintenance': '⚠️',
  'discontinued': '❌'
};

const TREND_ICONS = {
  'up': '📈',
  'down': '📉', 
  'stable': '➡️'
};
```

## Component Architecture

### Header Component
```jsx
<header className="header">
  <h1 className="brand">evanyi</h1>
  <nav className="nav">
    <a href="https://taskflow.app">TaskFlow</a>
    <a href="https://weather.app">WeatherApp</a>
  </nav>
</header>
```

### Project Item Component
```jsx
<article className="project-item">
  <h2 className="project-name">
    <a href={project.url}>🔗 {project.name}</a>
  </h2>
  <p className="project-description">{project.description}</p>
  <div className="project-status">{statusIcon} {managementIcon}</div>
  <div className="project-metrics">
    <div className="metric">{project.users.count.toLocaleString()} users {trendIcon}</div>
    <div className="metric">{project.revenue.monthly}/month {trendIcon}</div>
  </div>
</article>
```

## Content Management Workflow

### Manual Update Process
```bash
# 1. Edit project data
vim src/data/projects.json

# 2. Commit and push changes  
git add src/data/projects.json
git commit -m "Update project metrics - July 2025"
git push origin main

# 3. Automatic deployment via Vercel (30-60 seconds)
```

## Performance Requirements

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 1.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Contentful Paint (FCP)**: < 1.0s

### Optimization Strategies
- Minimal JavaScript bundle (< 50KB gzipped)
- No external dependencies beyond React
- Static generation (no runtime data fetching)
- Optimized font loading with font-display: swap

## Configuration Files

### Vite Config
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  base: '/'
})
```

### Vercel Config
```json
// vercel.json
{
  "github": {"silent": true},
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Implementation Status

Based on the PRD checklist:
- Phase 1 (Core Implementation): ✅ Complete
- Phase 2 (Polish & Optimization): ✅ Complete  
- Phase 3 (Enhancement): 🔄 Optional features pending