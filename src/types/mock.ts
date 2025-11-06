// src/types/mock.ts

// Mock Types สำหรับ Development & Testing
export interface MockUser {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
  
  export interface MockProject {
    id: string
    name: string
    color?: string | null
  }
  
  export interface MockTask {
    id: string
    title: string
    description?: string | null
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    dueDate?: Date | null
    assignee?: MockUser | null
    project?: MockProject | null
  }
  
  export interface MockOrganization {
    id: string
    name: string
    type: 'PERSONAL' | 'BUSINESS'
  }
  
  export interface MockProduct {
    id: string
    name: string
    sku?: string | null
    price: number
    stock: number
    minStock: number
  }
  
  // Mock Data
  export const mockTasks: MockTask[] = [
    {
      id: '1',
      title: 'ตัวอย่างงานแรก',
      description: 'นี่คืองานตัวอย่างสำหรับการทดสอบระบบ',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: null,
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
      assignee: {
        id: 'user-1',
        email: 'user@example.com',
        name: 'ผู้ใช้ตัวอย่าง'
      },
      project: { 
        id: '1', 
        name: 'โปรเจคหลัก', 
        color: '#3B82F6'
      }
    },
    {
      id: '3',
      title: 'งานที่สาม',
      description: null,
      status: 'DONE',
      priority: 'LOW',
      dueDate: new Date('2024-11-15'),
      assignee: null,
      project: { 
        id: '2', 
        name: 'โปรเจครอง', 
        color: '#10B981'
      }
    }
  ]
  
  export const mockProjects: MockProject[] = [
    { 
      id: '1', 
      name: 'โปรเจคหลัก', 
      color: '#3B82F6'
    },
    { 
      id: '2', 
      name: 'โปรเจครอง', 
      color: '#10B981'
    },
    { 
      id: '3', 
      name: 'โปรเจคส่วนตัว', 
      color: '#8B5CF6'
    }
  ]
  
  export const mockUsers: MockUser[] = [
    {
      id: 'user-1',
      email: 'user@example.com',
      name: 'ผู้ใช้ตัวอย่าง',
      image: null
    }
  ]