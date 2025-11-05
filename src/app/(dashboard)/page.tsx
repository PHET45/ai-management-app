// src/app/(dashboard)/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      redirect('/login')
    }

    // เนื้อหาที่เหลือ...
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {session.user.name || session.user.email}!
            </p>
          </div>
          {/* เนื้อหาอื่นๆ */}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Auth error:', error)
    redirect('/login')
  }
}