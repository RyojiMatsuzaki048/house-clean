'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { X, UserPlus } from 'lucide-react'

interface Task {
  id: number
  name: string
  point: number
  cycleDays: number
  placeId: number
  place: {
    id: number
    name: string
    building: {
      id: number
      name: string
    }
  }
  assignments: {
    id: number
    user: {
      id: number
      name: string
    }
  }[]
}

interface Building {
  id: number
  name: string
  places: {
    id: number
    name: string
  }[]
}

interface User {
  id: number
  name: string
}

interface TaskEditFormProps {
  taskId: number
  onSuccess: () => void
  onCancel: () => void
}

export function TaskEditForm({ taskId, onSuccess, onCancel }: TaskEditFormProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [buildings, setBuildings] = useState<Building[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    point: '',
    cycleDays: '',
    placeId: ''
  })

  useEffect(() => {
    fetchTask()
    fetchBuildings()
    fetchUsers()
  }, [taskId])

  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`)
      if (response.ok) {
        const taskData = await response.json()
        setTask(taskData)
        setFormData({
          name: taskData.name,
          point: taskData.point.toString(),
          cycleDays: taskData.cycleDays.toString(),
          placeId: taskData.placeId.toString()
        })
      } else {
        console.error('タスクの取得に失敗しました')
      }
    } catch (error) {
      console.error('タスクの取得に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBuildings = async () => {
    try {
      const response = await fetch('/api/buildings')
      if (response.ok) {
        const buildingsData = await response.json()
        setBuildings(buildingsData)
      }
    } catch (error) {
      console.error('建物データの取得に失敗しました:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const usersData = await response.json()
        setUsers(usersData)
      }
    } catch (error) {
      console.error('ユーザーデータの取得に失敗しました:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          point: parseInt(formData.point),
          cycleDays: parseInt(formData.cycleDays),
          placeId: parseInt(formData.placeId)
        })
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        alert(`更新に失敗しました: ${error.error}`)
      }
    } catch (error) {
      console.error('タスク更新エラー:', error)
      alert('タスクの更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        alert(`削除に失敗しました: ${error.error}`)
      }
    } catch (error) {
      console.error('タスク削除エラー:', error)
      alert('タスクの削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddAssignment = async () => {
    if (!selectedUserId) {
      alert('担当者を選択してください')
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(selectedUserId)
        })
      })

      if (response.ok) {
        const newAssignment = await response.json()
        setTask(prev => prev ? {
          ...prev,
          assignments: [...prev.assignments, newAssignment]
        } : null)
        setSelectedUserId('')
        alert('担当者を追加しました')
      } else {
        const error = await response.json()
        alert(`担当者追加に失敗しました: ${error.error}`)
      }
    } catch (error) {
      console.error('担当者追加エラー:', error)
      alert('担当者の追加に失敗しました')
    }
  }

  const handleRemoveAssignment = async (assignmentId: number, userName: string) => {
    if (!confirm(`「${userName}」を担当者から削除しますか？`)) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}/assignments/${assignmentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTask(prev => prev ? {
          ...prev,
          assignments: prev.assignments.filter(assignment => assignment.id !== assignmentId)
        } : null)
        alert('担当者を削除しました')
      } else {
        const error = await response.json()
        alert(`担当者削除に失敗しました: ${error.error}`)
      }
    } catch (error) {
      console.error('担当者削除エラー:', error)
      alert('担当者の削除に失敗しました')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>データを読み込み中...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!task) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-red-500">タスクが見つかりません</p>
          <Button onClick={onCancel} className="mt-4">
            戻る
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>タスク編集</CardTitle>
        <CardDescription>
          タスクの情報を編集または削除できます
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">タスク名</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="point">ポイント</Label>
            <Input
              id="point"
              type="number"
              value={formData.point}
              onChange={(e) => setFormData({ ...formData, point: e.target.value })}
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="cycleDays">サイクル（日数）</Label>
            <Input
              id="cycleDays"
              type="number"
              value={formData.cycleDays}
              onChange={(e) => setFormData({ ...formData, cycleDays: e.target.value })}
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="placeId">掃除場所</Label>
            <Select value={formData.placeId} onValueChange={(value) => setFormData({ ...formData, placeId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="掃除場所を選択" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map(building => (
                  <div key={building.id}>
                    <div className="px-2 py-1 text-sm font-semibold text-gray-500">
                      {building.name}
                    </div>
                    {building.places.map(place => (
                      <SelectItem key={place.id} value={place.id.toString()}>
                        {place.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 担当者管理セクション */}
          <div className="space-y-4">
            <Label>担当者管理</Label>
            
            {/* 現在の担当者一覧 */}
            <div className="space-y-2">
              <div className="text-sm font-medium">現在の担当者</div>
              {task.assignments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {task.assignments.map(assignment => (
                    <Badge key={assignment.id} variant="default" className="flex items-center gap-1">
                      👤 {assignment.user.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveAssignment(assignment.id, assignment.user.name)}
                        className="ml-1 hover:bg-red-600 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">担当者が割り当てられていません</div>
              )}
            </div>

            {/* 担当者追加 */}
            <div className="flex gap-2">
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="担当者を選択" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter(user => !task.assignments.some(assignment => assignment.user.id === user.id))
                    .map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddAssignment}
                disabled={!selectedUserId}
                size="sm"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? '更新中...' : '更新'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={isDeleting}>
                  {isDeleting ? '削除中...' : '削除'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>タスクを削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    この操作は取り消せません。タスク「{task.name}」を削除します。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                    削除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 