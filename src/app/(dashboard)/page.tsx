// src/app/(dashboard)/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // ใช้ type assertion ชั่วคราว
  const userId = (session.user as any).id || session.user.email

  // Fallback data สำหรับกรณีที่ database connection ล้มเหลว
  const defaultOrganization = {
    id: 'default-org',
    name: `${session.user.name || session.user.email}'s Workspace`,
    type: 'PERSONAL' as 'PERSONAL' | 'BUSINESS',
    createdAt: new Date(),
    _count: {
      tasks: 0,
      products: 0,
    },
  }

  let organization: typeof defaultOrganization = defaultOrganization

  // พยายามเชื่อมต่อ database (พร้อม error handling)
  try {
    const dbOrganization = await prisma.organization.findFirst({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            tasks: true,
            products: true,
          },
        },
      },
    })

    if (dbOrganization) {
      organization = dbOrganization
    } else {
      // ถ้าไม่พบ organization ให้สร้างใหม่
      try {
        const newOrg = await prisma.organization.create({
          data: {
            name: `${session.user.name || session.user.email}'s Workspace`,
            type: 'PERSONAL',
            users: {
              create: {
                userId: userId,
                role: 'OWNER',
              },
            },
          },
          include: {
            _count: {
              select: {
                tasks: true,
                products: true,
              },
            },
          },
        })
        organization = newOrg
      } catch (createError) {
        // ถ้าสร้างไม่ได้ ให้ใช้ default data
        console.warn(
          'Failed to create organization, using default data:',
          createError
        )
      }
    }
  } catch (error) {
    // Database connection failed - ใช้ mock data แทน
    console.warn('Database connection failed, using mock data:', error)
    // organization ใช้ defaultOrganization ที่ตั้งไว้แล้ว
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {session.user.name || session.user.email}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {organization.type === 'PERSONAL'
                  ? 'โหมดส่วนตัว'
                  : 'โหมดธุรกิจ'}
              </span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(session.user.name || session.user.email)
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Database Warning */}
        {organization.id === 'default-org' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>โหมดพัฒนา:</strong> กำลังใช้ข้อมูลตัวอย่าง
              เนื่องจากไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบ DATABASE_URL
              ในไฟล์ .env
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">งานทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">
                  {organization._count.tasks}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {organization._count.products}
                </p>
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
                <p className="text-gray-600 text-sm">
                  AI จัดตารางงานอัตโนมัติตามเป้าหมายของคุณ
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="text-lg font-semibold mb-2">วิเคราะห์ธุรกิจ</h3>
                <p className="text-gray-600 text-sm">
                  ดูรายงานและคำแนะนำจาก AI
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start space-x-4">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="text-lg font-semibold mb-2">การตั้งค่า</h3>
                <p className="text-gray-600 text-sm">
                  จัดการโปรไฟล์และองค์กรของคุณ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
