import { format, parse } from 'date-fns'
import { heIL } from 'date-fns/locale'

// תאריכים עברים
export function formatHebrewDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return format(d, 'dd.MM.yyyy', { locale: heIL })
  } catch {
    return ''
  }
}

export function formatHebrewDateFull(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return format(d, 'EEEE, d בMMMM yyyy', { locale: heIL })
  } catch {
    return ''
  }
}

export function parseHebrewDate(dateStr: string): Date | null {
  try {
    // Parse format: dd.MM.yyyy
    return parse(dateStr, 'dd.MM.yyyy', new Date())
  } catch {
    return null
  }
}

// טקסט
export function truncate(text: string, length: number = 100): string {
  return text.length > length ? text.substring(0, length) + '...' : text
}

export function preserveNewlines(text: string): string {
  return text.replace(/\n/g, '\n')
}

// סטטוס
export const STATUS_COLORS: Record<string, string> = {
  'חדש': 'blue',
  'ממתין לאישור': 'yellow',
  'מוכן לגרפיקה': 'yellow',
  'בעיצוב': 'orange',
  'מוכן לפרסום': 'green',
  'פורסם': 'purple',
  'נפסל': 'red',
}

export function getStatusBadgeClass(status: string): string {
  const color = STATUS_COLORS[status] || 'gray'
  return `status-${status.replace(/\s+/g, '-').toLowerCase()}`
}

// תמונות
export function getImageUrl(imageAttachment: any): string | null {
  if (!imageAttachment) return null
  if (Array.isArray(imageAttachment) && imageAttachment.length > 0) {
    return imageAttachment[0].url
  }
  return null
}

// ולידציה
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validateText(text: string, minLength: number = 1): boolean {
  return text.trim().length >= minLength
}

// פרמטרים
export function buildQueryString(params: Record<string, any>): string {
  const filtered = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
  return filtered.length > 0 ? '?' + filtered.join('&') : ''
}

// טקסט מודגש
export function applyBoldFormatting(text: string, start: number, end: number): string {
  const before = text.substring(0, start)
  const selected = text.substring(start, end)
  const after = text.substring(end)
  return before + '**' + selected + '**' + after
}

export function hasBoldFormatting(text: string): boolean {
  return /\*\*[^*]+\*\*/g.test(text)
}

// זיהוי כפילויות
export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const editDistance = getEditDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function getEditDistance(s1: string, s2: string): number {
  const costs: number[] = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

export function findDuplicates(items: any[], threshold: number = 0.7): any[] {
  const duplicates: any[] = []
  
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const similarity = calculateSimilarity(items[i].title, items[j].title)
      if (similarity >= threshold) {
        duplicates.push({
          item1: items[i],
          item2: items[j],
          similarity: Math.round(similarity * 100),
        })
      }
    }
  }
  
  return duplicates
}
