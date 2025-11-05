// app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const PROMPT_TEMPLATES = {
  WEEKLY_PLAN: `คุณเป็นผู้เชี่ยวชาญด้านการเพิ่ม Productivity จัดสรรแผนรายสัปดาห์สำหรับผู้ใช้: {user_name}
เป้าหมาย: {goals}
งานปัจจุบัน: {current_tasks}
ช่วงเวลาว่าง: {free_slots}

สร้างแผน 7 วันโดย:
- จัดลำดับงานที่มีผลกระทบสูงสุด
- แบ่งงานใหญ่เป็นส่วนย่อย 30-90 นาที
- จัดเวลา review และ buffer
ตอบกลับเป็น JSON ตามโครงสร้างนี้:
{
  "plan": [
    {
      "day": "Monday",
      "date": "2024-01-01",
      "timeSlots": [
        {
          "start": "09:00",
          "end": "10:00", 
          "task": "ชื่องาน",
          "note": "หมายเหตุ",
          "priority": "high"
        }
      ]
    }
  ],
  "summary": "สรุปแผน"
}`,

  SALES_FORECAST: `คุณเป็นนักวิเคราะห์ธุรกิจ วิเคราะห์ข้อมูลยอดขาย: {sales_data}
และสต็อกปัจจุบัน: {stock_data}

สร้าง:
- พยากรณ์ความต้องการ 30 วันรายสินค้า
- ระดับการสั่งซื้อใหม่ (จุดสั่งซื้อ, จำนวนสั่งซื้อ)
- คำอธิบายสั้นๆ สำหรับ 3 อันดับแรก

ตอบกลับเป็น JSON:
{
  "forecast": [
    {
      "product": "ชื่อสินค้า",
      "predicted_demand": 100,
      "reorder_point": 20,
      "reorder_quantity": 50,
      "reason": "คำอธิบาย"
    }
  ],
  "insights": ["insight 1", "insight 2"]
}`
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, type, context } = await req.json()
    
    let finalPrompt = prompt
    
    // Apply template if type is specified
    if (type && PROMPT_TEMPLATES[type as keyof typeof PROMPT_TEMPLATES]) {
      finalPrompt = PROMPT_TEMPLATES[type as keyof typeof PROMPT_TEMPLATES]
      // Replace template variables with context
      Object.keys(context || {}).forEach(key => {
        finalPrompt = finalPrompt.replace(`{${key}}`, context[key])
      })
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: finalPrompt }],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!aiResponse.ok) {
      throw new Error('AI service error')
    }

    const data = await aiResponse.json()
    const reply = data.choices[0]?.message?.content || ''

    // Save to database
    await prisma.aiSession.create({
      data: {
        prompt: finalPrompt,
        response: reply,
        type: type || 'GENERAL',
        userId: session.user.id!,
        metadata: { context, model: 'gpt-4o-mini' }
      }
    })

    return NextResponse.json({ 
      success: true,
      reply,
      type: type || 'GENERAL'
    })

  } catch (error) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}