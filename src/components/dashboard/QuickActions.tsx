// components/dashboard/QuickActions.tsx
'use client'

import { useAi } from '@/lib/hooks/useAi'
import { useState } from 'react'

interface QuickActionsProps {
  orgType: 'PERSONAL' | 'BUSINESS'
}

// กำหนด interface สำหรับ action items
interface ActionItem {
  title: string
  description: string
  icon: string
  onClick: () => void
  loading?: boolean
}

export default function QuickActions({ orgType }: QuickActionsProps) {
  const { run, loading: aiLoading } = useAi()
  const [generating, setGenerating] = useState(false)

  const handleGeneratePlan = async () => {
    setGenerating(true)
    try {
      const result = await run({
        type: 'WEEKLY_PLAN',
        context: {
          user_name: 'ผู้ใช้',
          goals: 'เพิ่มประสิทธิภาพการทำงาน',
          current_tasks: 'งานทั่วไป',
          free_slots: '09:00-17:00'
        }
      })
      // Process the result...
      console.log('AI Result:', result)
    } catch (error) {
      console.error('AI Error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const personalActions: ActionItem[] = [
    {
      title: 'สร้างแผนสัปดาห์',
      description: 'AI จัดตารางงานอัตโนมัติ',
      icon: '📅',
      onClick: handleGeneratePlan,
      loading: generating
    },
    {
      title: 'วิเคราะห์นิสัย',
      description: 'ติดตามและปรับปรุงนิสัย',
      icon: '💪',
      onClick: () => {
        console.log('Analyze habits clicked')
      }
    }
  ]

  const businessActions: ActionItem[] = [
    {
      title: 'พยากรณ์ยอดขาย',
      description: 'คาดการณ์ความต้องการ 30 วัน',
      icon: '📈',
      onClick: () => {
        console.log('Sales forecast clicked')
      }
    },
    {
      title: 'ตรวจสอบสต็อก',
      description: 'แนะนำการสั่งซื้อใหม่',
      icon: '📦',
      onClick: () => {
        console.log('Stock check clicked')
      }
    }
  ]

  const actions = orgType === 'PERSONAL' ? personalActions : businessActions

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        การดำเนินการด่วน
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.loading || aiLoading}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            <span className="text-2xl mr-3">{action.icon}</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">{action.title}</div>
              <div className="text-sm text-gray-500">{action.description}</div>
              {(action.loading || aiLoading) && (
                <div className="text-xs text-blue-600 mt-1">กำลังประมวลผล...</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}