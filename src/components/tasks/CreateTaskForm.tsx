// src/components/tasks/CreateTaskForm.tsx
'use client'

import { useState } from 'react'

interface CreateTaskFormProps {
  orgId: string
  projects: any[]
}

export default function CreateTaskForm({ orgId, projects }: CreateTaskFormProps) {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          orgId,
        }),
      })

      if (response.ok) {
        setTitle('')
        alert('สร้างงานสำเร็จ! (ระบบทดสอบ)')
        // ใน production ใช้ window.location.reload()
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert('เกิดข้อผิดพลาดในการสร้างงาน')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">สร้างงานใหม่</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            ชื่องาน *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="สิ่งที่ต้องทำ..."
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'กำลังสร้าง...' : 'สร้างงาน'}
        </button>
      </form>
    </div>
  )
}