// סוגי הנתונים העיקריים

export type ContentStatus = 'חדש' | 'ממתין לאישור' | 'מוכן לגרפיקה' | 'בעיצוב' | 'מוכן לפרסום' | 'פורסם' | 'נפסל'

export type ContentType = 'פתגמים' | 'אגרות קודש' | 'חינוך יומי' | 'עידוד וחיזוק' | 'נשים' | 'פנינה יומית'

export type UserRole = 'editor' | 'admin' | 'designer'

export interface ContentItem {
  id: string
  // שדות בסיסיים
  title: string
  text: string
  contentType: ContentType
  
  // מקורות
  sourceBook: string
  sourcePart?: string
  sourcePage?: string
  topics: string[]
  
  // תאריכים
  publishDate: string
  
  // משתמשים
  editorName: string
  
  // תמונות
  sourceImage?: {
    id: string
    url: string
    filename: string
  }
  finalImage?: {
    id: string
    url: string
    filename: string
  }
  
  // סטטוס
  status: ContentStatus
  
  // מטא
  notes?: string
  category?: string
  createdTime: string
  updatedTime?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface Book {
  id: string
  name: string
}

export interface Category {
  name: string
  count: {
    pending: number
    readyGraphic: number
    readyPublish: number
    published: number
  }
}

export interface SearchFilters {
  text?: string
  contentType?: ContentType
  category?: string
  sourceBook?: string
  status?: ContentStatus
  publishDateFrom?: string
  publishDateTo?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
