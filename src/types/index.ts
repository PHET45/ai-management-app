// src/types/index.ts
export interface User {
  id: string
  email: string
  name?: string
  image?: string
}

export interface Organization {
  id: string
  name: string
  type: 'PERSONAL' | 'BUSINESS'
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date
}