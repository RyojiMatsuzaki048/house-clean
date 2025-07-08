'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Task {
  id: number
  name: string
  point: number
  place: {
    name: string
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
}

interface User {
  id: number
  name: string
}

interface TaskCompletionFormProps {
  onSuccess?: () => void
}

export function TaskCompletionForm({ onSuccess }: TaskCompletionFormProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchTasks()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('ユーザーの取得に失敗しました:', error)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/all')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('タスクの取得に失敗しました:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTaskId || !selectedUserId) {
      alert('タスクとユーザーを選択してください')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/task-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: parseInt(selectedTaskId),
          userId: parseInt(selectedUserId),
          dateDone: new Date().toISOString()
        }),
      })

      if (response.ok) {
        setSelectedTaskId('')
        setSelectedUserId('')
        onSuccess?.()
        alert('タスク完了を記録しました！')
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error}`)
      }
    } catch (error) {
      alert('タスク完了の記録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedTask = tasks.find(task => task.id === parseInt(selectedTaskId))
  const availableUsers = selectedTask 
    ? selectedTask.assignments.map(a => a.user)
    : []

  // 担当者が割り当てられていない場合のメッセージ
  if (selectedTask && availableUsers.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>タスク完了記録</CardTitle>
          <CardDescription>
            このタスクには担当者が割り当てられていません
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            先に登録画面で担当者を割り当ててください
          </p>
          <div className="text-center">
            <a href="/admin" className="text-blue-600 hover:underline">
              登録画面へ移動
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>タスク完了記録</CardTitle>
        <CardDescription>
          完了したタスクと実施者を選択して記録してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">完了したタスク</label>
            <select
              value={selectedTaskId}
              onChange={(e) => {
                setSelectedTaskId(e.target.value)
                setSelectedUserId('') // タスクが変わったらユーザー選択をリセット
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">タスクを選択してください</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.place.building.name} - {task.place.name}: {task.name} ({task.point}ポイント)
                </option>
              ))}
            </select>
          </div>

          {selectedTask && (
            <div className="space-y-2">
              <label className="text-sm font-medium">実施者</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">実施者を選択してください</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                このタスクの担当者: {availableUsers.map(u => u.name).join(', ')}
              </p>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? '記録中...' : 'タスク完了を記録'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 