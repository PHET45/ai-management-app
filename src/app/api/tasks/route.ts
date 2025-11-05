// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const status = searchParams.get('status')

    if (!orgId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 400 }
      )
    }

    const tasks = await prisma.task.findMany({
      where: {
        orgId,
        ...(status && { status: status as any }),
      },
      include: {
        assignee: true,
        project: true,
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
    })

    return NextResponse.json(tasks)
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
    const session = await auth()
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
        createdById: session.user.id!,
      },
      include: {
        assignee: true,
        project: true,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('Create Task Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
