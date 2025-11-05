// app/tasks/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import TaskList from './TaskList'
import CreateTaskForm from './CreateTaskForm'
import type { Task, Project } from '@/types'

export default async function TasksPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Get user's first organization for demo
  const organization = await prisma.organization.findFirst({
    where: {
      users: {
        some: {
          userId: session.user.id!
        }
      }
    }
  })

  if (!organization) {
    redirect('/login')
  }

  const tasks = await prisma.task.findMany({
    where: {
      orgId: organization.id
    },
    include: {
      assignee: true,
      project: true
    },
    orderBy: [
      { priority: 'desc' },
      { dueDate: 'asc' }
    ]
  }) as Task[]

  const projects = await prisma.project.findMany({
    where: {
      orgId: organization.id
    }
  }) as Project[]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">จัดการงาน</h1>
          <p className="text-gray-600">สร้างและจัดการงานทั้งหมดของคุณ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Create Task Form */}
          <div className="lg:col-span-1">
            <CreateTaskForm 
              orgId={organization.id} 
              projects={projects}
            />
          </div>

          {/* Task List */}
          <div className="lg:col-span-3">
            <TaskList 
              tasks={tasks} 
              orgId={organization.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}