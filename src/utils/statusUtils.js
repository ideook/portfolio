export const STATUS_COLORS = {
  launched: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
  development: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
  paused: { bg: 'rgba(156, 163, 175, 0.15)', text: '#9ca3af', border: 'rgba(156, 163, 175, 0.3)' },
  discontinued: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
}

export const STATUS_LABELS = {
  launched: 'Live',
  development: 'In Dev',
  paused: 'Paused',
  discontinued: 'Discontinued',
}

export const MANAGEMENT_LABELS = {
  active: 'Active',
  maintenance: 'Maintenance',
  discontinued: 'Discontinued',
}

export const TREND_ICONS = {
  up: '↑',
  down: '↓',
  stable: '→',
}

export function getProjectStatus(project) {
  if (!project.platforms) return 'development'
  const statuses = Object.values(project.platforms).map((p) => p.status)
  if (statuses.includes('launched')) return 'launched'
  if (statuses.includes('development')) return 'development'
  if (statuses.includes('paused')) return 'paused'
  return 'discontinued'
}

export function getStatusLabel(project) {
  const status = getProjectStatus(project)
  return STATUS_LABELS[status] || status
}

export function getStatusColor(project) {
  const status = getProjectStatus(project)
  return STATUS_COLORS[status] || STATUS_COLORS.development
}

// Generate a unique background color for projects without images
export function getProjectColor(index) {
  const hue = (index * 47) % 360
  return `hsl(${hue}, 30%, 18%)`
}

// Determine font style variant based on project tags
export function getFontVariant(tags) {
  if (!tags || tags.length === 0) return 'default'
  if (tags.includes('saas') || tags.includes('web-app')) return 'saas'
  if (tags.includes('mobile-app') || tags.includes('ios')) return 'mobile'
  return 'default'
}
