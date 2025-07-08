'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Task {
  id: number
  name: string
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

interface AssignmentFormProps {
  onSuccess?: () => void
}

export function AssignmentForm({ onSuccess }: AssignmentFormProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
    fetchUsers()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTaskId || !selectedUserId) {
      alert('タスクとユーザーを選択してください')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: parseInt(selectedTaskId),
          userId: parseInt(selectedUserId)
        }),
      })

      if (response.ok) {
        setSelectedTaskId('')
        setSelectedUserId('')
        onSuccess?.()
        alert('担当者を割り当てました！')
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error}`)
      }
    } catch (error) {
      alert('担当者割り当てに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedTask = tasks.find(task => task.id === parseInt(selectedTaskId))
  const assignedUserIds = selectedTask 
    ? selectedTask.assignments.map(a => a.user.id)
    : []
  const availableUsers = users.filter(user => !assignedUserIds.includes(user.id))

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>担当者割り当て</CardTitle>
        <CardDescription>
          タスクに担当者を割り当ててください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">タスク</label>
            <select
              value={selectedTaskId}
              onChange={(e) => {
                setSelectedTaskId(e.target.value)
                setSelectedUserId('')
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">タスクを選択してください</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.place.building.name} - {task.place.name}: {task.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTask && (
            <div className="space-y-2">
              <label className="text-sm font-medium">担当者</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">担当者を選択してください</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {selectedTask.assignments.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  現在の担当者: {selectedTask.assignments.map(a => a.user.name).join(', ')}
                </p>
              )}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? '割り当て中...' : '担当者を割り当て'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 