// src/components/tasks/TaskList.tsx
'use client'

import type { Task } from '@/types'

interface TaskListProps {
  tasks: Task[]
  orgId: string
}

export default function TaskList({ tasks, orgId }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'ด่วน'
      case 'HIGH': return 'สูง'
      case 'MEDIUM': return 'กลาง'
      case 'LOW': return 'ต่ำ'
      default: return priority
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'TODO': return 'ยังไม่เริ่ม'
      case 'IN_PROGRESS': return 'กำลังทำ'
      case 'DONE': return 'เสร็จแล้ว'
      case 'CANCELLED': return 'ยกเลิก'
      default: return status
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">งานทั้งหมด ({tasks.length})</h2>
      </div>
      
      <div className="divide-y">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-lg font-medium mb-1">ยังไม่มีงาน</p>
            <p className="text-sm">สร้างงานแรกของคุณโดยใช้ฟอร์มด้านข้าง</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.status === 'DONE'}
                    readOnly
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${task.status === 'DONE' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2">
                      {task.project && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full border"
                          style={{ 
                            borderColor: task.project.color || '#3B82F6',
                            color: task.project.color || '#3B82F6'
                          }}
                        >
                          {task.project.name}
                        </span>
                      )}
                      
                      {task.dueDate && (
                        <span className="text-xs text-gray-500">
                          กำหนดส่ง: {new Date(task.dueDate).toLocaleDateString('th-TH')}
                        </span>
                      )}

                      {task.assignee && (
                        <span className="text-xs text-gray-500">
                          ผู้รับผิดชอบ: {task.assignee.name || task.assignee.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                    {getPriorityText(task.priority)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}