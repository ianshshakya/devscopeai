export const getScoreColor = (score) => {
  if (score >= 80) return '#10b981'  // green
  if (score >= 60) return '#f59e0b'  // yellow
  if (score >= 40) return '#f97316'  // orange
  return '#ef4444'                   // red
}

export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Good'
  if (score >= 50) return 'Moderate'
  if (score >= 35) return 'Needs Work'
  return 'Critical'
}

export const getScoreBadgeClass = (score) => {
  if (score >= 80) return 'badge-green'
  if (score >= 60) return 'badge-yellow'
  return 'badge-red'
}

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num?.toString() || '0'
}

export const formatCurrency = (amount, currency = 'INR') => {
  if (currency === 'INR') {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    return `₹${formatNumber(amount)}`
  }
  return `$${formatNumber(amount)}`
}

export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(date).toLocaleDateString()
}

export const getDaysSince = (date) => {
  return Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24))
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')
