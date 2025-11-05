// src/types/index.ts

// Enums
export type OrganizationType = 'PERSONAL' | 'BUSINESS'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type AiSessionType = 'TASK_PLANNING' | 'SALES_FORECAST' | 'FEEDBACK_ANALYSIS' | 'STOCK_RECOMMENDATION' | 'GENERAL'

// Main Models
export interface User {
  id: string
  email: string
  name?: string | null
  password?: string | null
  image?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  createdAt: Date
}

export interface OrganizationMember {
  id: string
  userId: string
  orgId: string
  role: MemberRole
  joinedAt: Date
  user?: User
  organization?: Organization
}

export interface Project {
  id: string
  name: string
  orgId: string
  color?: string | null
  createdAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: Priority
  dueDate?: Date | null
  completedAt?: Date | null
  assigneeId?: string | null
  projectId?: string | null
  orgId: string
  createdById: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  assignee?: User | null
  project?: Project | null
  org?: Organization
  createdBy?: User
}

export interface Product {
  id: string
  name: string
  sku?: string | null
  price: number
  cost?: number | null
  stock: number
  minStock: number
  orgId: string
  createdAt: Date
  updatedAt: Date
}

export interface Sale {
  id: string
  productId: string
  quantity: number
  amount: number
  orgId: string
  soldAt: Date
  product?: Product
}

export interface AiSession {
  id: string
  prompt: string
  response: string
  type: AiSessionType
  metadata?: any
  userId: string
  orgId?: string | null
  createdAt: Date
  user?: User
  org?: Organization | null
}