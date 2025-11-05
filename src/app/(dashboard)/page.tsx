// app/(dashboard)/page.tsx
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import QuickActions from '@/components/dashboard/QuickActions'
import TodayTasks from '@/components/dashboard/TodayTasks'
import AiInsights from '@/components/dashboard/AiInsights'
import BusinessOverview from '@/components/dashboard/BusinessOverview'

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Get user's organizations
  const organizations = await prisma.organization.findMany({
    where: {
      users: {
        some: {
          userId: session.user.id!
        }
      }
    },
    include: {
      _count: {
        select: {
          tasks: true,
          products: true,
          sales: true
        }
      }
    }
  })

  const currentOrg = organizations[0]

  // Get today's tasks
  const todayTasks = await prisma.task.findMany({
    where: {
      orgId: currentOrg.id,
      dueDate: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    },
    include: {
      assignee: true,
      project: true
    },
    orderBy: [
      { priority: 'desc' },
      { dueDate: 'asc' }
    ]
  })

  // Get business data if organization is BUSINESS type
  let businessData = null
  if (currentOrg.type === 'BUSINESS') {
    const recentSales = await prisma.sale.findMany({
      where: { orgId: currentOrg.id },
      include: { product: true },
      orderBy: { soldAt: 'desc' },
      take: 10
    })

    const lowStockProducts = await prisma.product.findMany({
      where: {
        orgId: currentOrg.id,
        stock: {
          lte: prisma.product.fields.minStock
        }
      }
    })

    businessData = { recentSales, lowStockProducts }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        user={session.user} 
        organizations={organizations}
        currentOrg={currentOrg}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions orgType={currentOrg.type} />
            
            {currentOrg.type === 'BUSINESS' && businessData && (
              <BusinessOverview data={businessData} />
            )}
            
            <TodayTasks tasks={todayTasks} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AiInsights 
              orgType={currentOrg.type}
              recentData={businessData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}