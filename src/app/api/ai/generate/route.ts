// app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await req.json()

    // Simple AI response for MVP
    const reply = "This is a mock AI response. Connect OpenAI API to enable real AI features."

    return NextResponse.json({ 
      success: true,
      reply,
      type: 'GENERAL'
    })

  } catch (error) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}