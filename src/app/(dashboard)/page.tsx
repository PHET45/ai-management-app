// src/app/(dashboard)/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // ใช้ type assertion ชั่วคราว
  const userId = (session.user as any).id || session.user.email

  // Get or create organization
  let organization = await prisma.organization.findFirst({
    where: {
      users: {
        some: {
          userId: userId
        }
      }
    },
    include: {
      _count: {
        select: {
          tasks: true,
          products: true
        }
      }
    }
  })

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        name: `${session.user.name || session.user.email}'s Workspace`,
        type: 'PERSONAL',
        users: {
          create: {
            userId: userId,
            role: 'OWNER'
          }
        }
      },
      include: {
        _count: {
          select: {
            tasks: true,
            products: true
          }
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user.name || session.user.email}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {organization.type === 'PERSONAL' ? 'โหมดส่วนตัว' : 'โหมดธุรกิจ'}
              </span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(session.user.name || session.user.email)?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">งานทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{organization._count.tasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">สินค้า</p>
                <p className="text-2xl font-bold text-gray-900">{organization._count.products}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">สถานะ</p>
                <p className="text-lg font-bold text-green-600">พร้อมใช้งาน</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="text-lg font-semibold mb-2">สร้างแผนสัปดาห์</h3>
                <p className="text-gray-600 text-sm">AI จัดตารางงานอัตโนมัติตามเป้าหมายของคุณ</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="text-lg font-semibold mb-2">วิเคราะห์ธุรกิจ</h3>
                <p className="text-gray-600 text-sm">ดูรายงานและคำแนะนำจาก AI</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="text-lg font-semibold mb-2">การตั้งค่า</h3>
                <p className="text-gray-600 text-sm">จัดการโปรไฟล์และองค์กรของคุณ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}