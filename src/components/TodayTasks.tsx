'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Task {
  id: number
  name: string
  point: number
  cycleDays: number
  place: {
    name: string
    description?: string
    building: {
      name: string
    }
  }
  assignments: {
    user: {
      id: number
      name: string
    }
  }[]
  taskLogs: any[]
}

interface TodayTasksProps {
  tasks: Task[]
  onTaskComplete?: () => void
}

export function TodayTasks({ tasks, onTaskComplete }: TodayTasksProps) {
  const [completingTask, setCompletingTask] = useState<number | null>(null)

  const handleCompleteTask = async (taskId: number, userId: number) => {
    setCompletingTask(taskId)
    try {
      const response = await fetch('/api/task-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          userId,
          dateDone: new Date().toISOString()
        }),
      })

      if (response.ok) {
        onTaskComplete?.()
        alert('タスクが完了しました！')
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error}`)
      }
    } catch (error) {
      alert('タスクの完了に失敗しました')
    } finally {
      setCompletingTask(null)
    }
  }

  // 今日完了したタスク（今日の日付でフィルタリング）
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const completedTasks = tasks.filter(task => {
    const todayLogs = task.taskLogs.filter(log => {
      const logDate = new Date(log.dateDone)
      logDate.setHours(0, 0, 0, 0)
      return logDate.getTime() === today.getTime()
    })
    return todayLogs.length > 0
  })
  
  const pendingTasks = tasks.filter(task => {
    const todayLogs = task.taskLogs.filter(log => {
      const logDate = new Date(log.dateDone)
      logDate.setHours(0, 0, 0, 0)
      return logDate.getTime() === today.getTime()
    })
    return todayLogs.length === 0
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>今日やるべきタスク</CardTitle>
        <CardDescription>
          完了: {completedTasks.length} / 未完了: {pendingTasks.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingTasks.length === 0 && completedTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              今日のタスクはありません
            </p>
          ) : (
            <>
              {pendingTasks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">未完了タスク</h3>
                  <div className="space-y-2">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-3 bg-red-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{task.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {task.place.building.name} - {task.place.name}
                            </p>
                            {task.place.description && (
                              <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                                📝 {task.place.description}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              担当: {task.assignments.map(a => a.user.name).join(', ')}
                            </p>
                            <p className="text-sm text-blue-600">
                              💰 {task.point}ポイント • 🔄 {task.cycleDays}日周期
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            {task.assignments.map((assignment) => (
                              <Button
                                key={assignment.user.id}
                                size="sm"
                                onClick={() => handleCompleteTask(task.id, assignment.user.id)}
                                disabled={completingTask === task.id}
                              >
                                {completingTask === task.id ? '完了中...' : `${assignment.user.name}が完了`}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedTasks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">完了済みタスク</h3>
                  <div className="space-y-2">
                    {completedTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-3 bg-green-50">
                        <div>
                          <h4 className="font-medium">{task.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {task.place.building.name} - {task.place.name}
                          </p>
                          {task.place.description && (
                            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                              📝 {task.place.description}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            担当: {task.assignments.map(a => a.user.name).join(', ')}
                          </p>
                          <p className="text-sm text-green-600">
                            ✅ 完了済み (💰 {task.point}ポイント獲得) • 🔄 {task.cycleDays}日周期
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 