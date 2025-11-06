// src/types/index.ts

// Enums ตาม Prisma Schema
export type OrganizationType = 'PERSONAL' | 'BUSINESS'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type AiSessionType = 'TASK_PLANNING' | 'SALES_FORECAST' | 'FEEDBACK_ANALYSIS' | 'STOCK_RECOMMENDATION' | 'GENERAL'

// Main Models ตาม Prisma Schema เป๊ะๆ
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
  
  // Relations (optional สำหรับ mock data)
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

// Mock Data ที่ตรงกับ Prisma Schema เป๊ะๆ
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'ตัวอย่างงานแรก',
    description: 'นี่คืองานตัวอย่างสำหรับการทดสอบระบบ',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    completedAt: null,
    assigneeId: null,
    projectId: null,
    orgId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    assignee: null,
    project: null
  },
  {
    id: '2', 
    title: 'งานที่สอง',
    description: 'งานนี้มีความสำคัญสูงและมีกำหนดส่ง',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: new Date('2024-12-31'),
    completedAt: null,
    assigneeId: 'user-1',
    projectId: 'project-1',
    orgId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    assignee: {
      id: 'user-1',
      email: 'user@example.com',
      name: 'ผู้ใช้ตัวอย่าง',
      password: null,
      image: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    project: { 
      id: 'project-1', 
      name: 'โปรเจคหลัก', 
      color: '#3B82F6',
      orgId: 'org-1',
      createdAt: new Date('2024-01-01')
    }
  },
  {
    id: '3',
    title: 'งานที่สาม',
    description: null,
    status: 'DONE',
    priority: 'LOW',
    dueDate: new Date('2024-11-15'),
    completedAt: new Date('2024-11-14'),
    assigneeId: null,
    projectId: 'project-2',
    orgId: 'org-1',
    createdById: 'user-1',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-11-14'),
    assignee: null,
    project: { 
      id: 'project-2', 
      name: 'โปรเจครอง', 
      color: '#10B981',
      orgId: 'org-1',
      createdAt: new Date('2024-01-01')
    }
  }
]

export const mockProjects: Project[] = [
  { 
    id: 'project-1', 
    name: 'โปรเจคหลัก', 
    color: '#3B82F6',
    orgId: 'org-1',
    createdAt: new Date('2024-01-01')
  },
  { 
    id: 'project-2', 
    name: 'โปรเจครอง', 
    color: '#10B981',
    orgId: 'org-1',
    createdAt: new Date('2024-01-01')
  },
  { 
    id: 'project-3', 
    name: 'โปรเจคส่วนตัว', 
    color: '#8B5CF6',
    orgId: 'org-1',
    createdAt: new Date('2024-01-01')
  }
]

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'user@example.com',
    name: 'ผู้ใช้ตัวอย่าง',
    password: null,
    image: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-2', 
    email: 'admin@example.com',
    name: 'ผู้ดูแลระบบ',
    password: null,
    image: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Workspace หลัก',
    type: 'PERSONAL',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'org-2',
    name: 'ธุรกิจของฉัน',
    type: 'BUSINESS', 
    createdAt: new Date('2024-01-01')
  }
]

export const mockOrganizationMembers: OrganizationMember[] = [
  {
    id: 'member-1',
    userId: 'user-1',
    orgId: 'org-1',
    role: 'OWNER',
    joinedAt: new Date('2024-01-01'),
    user: mockUsers[0],
    organization: mockOrganizations[0]
  }
]