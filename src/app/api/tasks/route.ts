// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Simple mock data for testing
const mockTasks = [
  {
    id: '1',
    title: 'ตัวอย่างงานแรก',
    description: 'นี่คืองานตัวอย่าง',
    status: 'TODO' as const,
    priority: 'MEDIUM' as const,
    dueDate: null,
    assignee: null,
    project: null
  }
]

export async function GET(request: NextRequest) {
  try {
    // สำหรับ testing ให้ return mock data ก่อน
    return NextResponse.json(mockTasks)
    
    /* 
    // Code จริง (comment ไว้ชั่วคราว)
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')

    if (!orgId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const tasks = await prisma.task.findMany({
      where: { orgId },
      include: { assignee: true, project: true },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
    })

    return NextResponse.json(tasks)
    */
  } catch (error) {
    console.error('Tasks API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // สำหรับ testing ให้ return success ก่อน
    const body = await request.json()
    return NextResponse.json({ 
      success: true, 
      message: 'Task created successfully (mock)',
      data: body 
    })
    
    /*
    // Code จริง (comment ไว้ชั่วคราว)
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, priority, dueDate, projectId, orgId } = body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId || null,
        orgId,
        createdById: 'temp-user-id', // ใช้ temporary ID
      },
    })

    return NextResponse.json(task)
    */
  } catch (error) {
    console.error('Create Task Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}