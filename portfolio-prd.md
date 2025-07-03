# Evanyi Portfolio Site PRD - Detailed Technical Specification

## 1. Project Overview

### Purpose
- Showcase and track performance metrics of developed web services and mobile applications
- Present project information through a minimal, typography-focused design
- Enable easy content management through JSON file updates and Git-based deployment workflow

### Target Users
- **Primary**: Potential customers and clients
- **Secondary**: Investors, business partners, developer community
- **Tertiary**: Recruiters and collaborators

### Success Criteria
- Page load time < 2 seconds
- Mobile-friendly design (responsive)
- Content update workflow < 5 minutes
- Zero maintenance overhead
- Clean, professional presentation

## 2. Technical Architecture

### 2.1 Technology Stack
- **Frontend Framework**: Vite + React
- **Styling**: CSS Modules or styled-components
- **Data Source**: Static JSON file
- **Deployment**: Vercel with automatic Git integration
- **Version Control**: GitHub
- **Domain**: Custom domain (optional)

### 2.2 Project Structure
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
│   ├── favicon.ico
│   └── robots.txt
├── package.json
├── vite.config.js
└── vercel.json
```

### 2.3 Data Schema
```json
{
  "meta": {
    "lastUpdated": "2025-07-03T10:30:00Z",
    "version": "1.0.0"
  },
  "navigation": {
    "primaryProjects": [
      {
        "name": "TaskFlow",
        "url": "https://taskflow.app"
      },
      {
        "name": "WeatherApp", 
        "url": "https://weather.app"
      }
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
      "users": {
        "count": 1200,
        "trend": "up",
        "unit": "users"
      },
      "revenue": {
        "monthly": "$300",
        "trend": "up",
        "currency": "USD"
      },
      "launchDate": "2024-03-15",
      "featured": true,
      "tags": ["productivity", "web-app"]
    }
  ]
}
```

## 3. User Interface Specification

### 3.1 Layout Design
- **Container**: Max-width 800px, centered
- **Typography Scale**: 
  - H1 (Brand): 24-32px, font-weight: 700
  - H2 (Project): 18-20px, font-weight: 500
  - Body: 14-16px, font-weight: 400
  - Caption: 12-14px, font-weight: 400
- **Spacing**: 
  - Section margins: 3rem (48px)
  - Element margins: 1.5rem (24px)
  - Line height: 1.6

### 3.2 Header Component
```jsx
<header className="header">
  <h1 className="brand">evanyi</h1>
  <nav className="nav">
    <a href="https://taskflow.app">TaskFlow</a>
    <a href="https://weather.app">WeatherApp</a>
  </nav>
</header>
```

### 3.3 Project Item Component
```jsx
<article className="project-item">
  <h2 className="project-name">
    <a href={project.url}>🔗 {project.name}</a>
  </h2>
  <p className="project-description">{project.description}</p>
  <div className="project-status">
    {statusIcon} {managementIcon}
  </div>
  <div className="project-metrics">
    <div className="metric">
      {project.users.count.toLocaleString()} users {trendIcon}
    </div>
    <div className="metric">
      {project.revenue.monthly}/month {trendIcon}
    </div>
  </div>
</article>
```

### 3.4 Footer Component
```jsx
<footer className="footer">
  <a href="https://twitter.com/evanyi">@evanyi</a>
  <a href="mailto:hello@evanyi.com">hello@evanyi.com</a>
</footer>
```

## 4. Visual Design System

### 4.1 Color Palette
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

### 4.2 Typography
```css
.brand {
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 700;
  color: var(--color-primary);
}

.project-name {
  font-size: clamp(18px, 4vw, 20px);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.project-description {
  font-size: 14px;
  color: var(--color-tertiary);
  margin-bottom: 0.5rem;
}

.metric {
  font-size: 14px;
  color: var(--color-secondary);
  margin-bottom: 0.25rem;
}
```

### 4.3 Responsive Breakpoints
```css
/* Mobile First */
.container {
  padding: 1rem;
  max-width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .header {
    justify-content: space-between;
  }
}
```

## 5. Icon System

### 5.1 Status Icons
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

### 5.2 Icon Usage Guidelines
- Icons should be 14px font-size
- Always paired with descriptive context
- No custom SVG icons (emoji only for simplicity)
- Consistent spacing between icons and text

## 6. Content Management Workflow

### 6.1 Manual Update Process
```bash
# 1. Clone repository
git clone https://github.com/evanyi/portfolio.git
cd portfolio

# 2. Edit JSON data
vim src/data/projects.json

# 3. Commit and push changes
git add src/data/projects.json
git commit -m "Update project metrics - July 2025"
git push origin main

# 4. Automatic deployment via Vercel
# Site updates within 30-60 seconds
```

### 6.2 Automated Update Script (Optional)
```javascript
// scripts/update-metrics.js
const fs = require('fs');
const path = require('path');

async function updateProjectMetrics() {
  // Fetch data from analytics APIs
  const analyticsData = await fetchAnalytics();
  const revenueData = await fetchRevenue();
  
  // Read current projects.json
  const projectsPath = path.join(__dirname, '../src/data/projects.json');
  const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
  
  // Update metrics
  projects.projects.forEach(project => {
    if (analyticsData[project.id]) {
      project.users.count = analyticsData[project.id].users;
      project.users.trend = calculateTrend(project.users.count);
    }
    
    if (revenueData[project.id]) {
      project.revenue.monthly = `$${revenueData[project.id].monthly}`;
      project.revenue.trend = calculateTrend(revenueData[project.id].monthly);
    }
  });
  
  // Update timestamp
  projects.meta.lastUpdated = new Date().toISOString();
  
  // Write back to file
  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
  
  console.log('✅ Projects data updated successfully');
}
```

### 6.3 Deployment Configuration
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

```json
// vercel.json
{
  "github": {
    "silent": true
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## 7. Performance Requirements

### 7.1 Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 1.5s
- **First Input Delay (FID)**: < 100ms  
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Contentful Paint (FCP)**: < 1.0s

### 7.2 Optimization Strategies
- Minimal JavaScript bundle (< 50KB gzipped)
- No external dependencies beyond React
- Optimized font loading (font-display: swap)
- Compressed images and assets
- Static generation (no runtime data fetching)

## 8. SEO & Meta Information

### 8.1 HTML Meta Tags
```html
<head>
  <title>Evanyi - Developer Portfolio</title>
  <meta name="description" content="Portfolio of web applications and digital products by Evanyi" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta property="og:title" content="Evanyi - Developer Portfolio" />
  <meta property="og:description" content="Portfolio of web applications and digital products" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:creator" content="@evanyi" />
</head>
```

### 8.2 Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Evanyi",
  "url": "https://evanyi.com",
  "sameAs": [
    "https://twitter.com/evanyi",
    "https://github.com/evanyi"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "Independent Developer"
  }
}
```

## 9. Quality Assurance

### 9.1 Testing Checklist
- [ ] Mobile responsiveness (iOS Safari, Android Chrome)
- [ ] Desktop compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Performance (Lighthouse score > 95)
- [ ] SEO optimization (meta tags, structured data)

### 9.2 Content Validation
- [ ] All project links are functional
- [ ] Data accuracy (user counts, revenue figures)
- [ ] Consistent formatting across projects
- [ ] Proper trend icon representation
- [ ] Updated timestamp accuracy

## 10. Maintenance & Support

### 10.1 Regular Updates
- **Weekly**: Review and update project metrics
- **Monthly**: Performance audit and optimization
- **Quarterly**: Design and content review
- **Annually**: Technology stack evaluation

### 10.2 Monitoring
- Vercel deployment status
- Google Analytics (optional)
- Core Web Vitals monitoring
- Uptime monitoring

## 11. Security Considerations

### 11.1 Static Site Security
- No server-side vulnerabilities (static generation)
- HTTPS enforcement via Vercel
- No sensitive data in public repository
- Proper CORS configuration

### 11.2 Content Security
- No external script dependencies
- Local asset hosting only
- Minimal attack surface area