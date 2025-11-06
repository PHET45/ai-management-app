// src/app/tasks/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { redirect } from 'next/navigation'
import TaskList from '@/components/tasks/TaskList'
import CreateTaskForm from '@/components/tasks/CreateTaskForm'
import { mockTasks, mockProjects } from '@/types'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export default async function TasksPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">จัดการงาน</h1>
          <p className="text-gray-600">สร้างและจัดการงานทั้งหมดของคุณ</p>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>โหมดพัฒนา:</strong> กำลังใช้ข้อมูลตัวอย่างตามโครงสร้าง
              Prisma Schema
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CreateTaskForm orgId="org-1" projects={mockProjects} />
          </div>

          <div className="lg:col-span-3">
            <TaskList tasks={mockTasks} orgId="org-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
