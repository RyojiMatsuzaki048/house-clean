'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TaskEditForm } from '@/components/TaskEditForm'
import Link from 'next/link'

interface Task {
  id: number
  name: string
  description: string
  points: number
  cycle: string
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [buildingFilter, setBuildingFilter] = useState('all')
  const [placeFilter, setPlaceFilter] = useState('all')
  const [assignmentFilter, setAssignmentFilter] = useState('all')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, buildingFilter, placeFilter, assignmentFilter])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks/all')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      } else {
        console.error('タスクデータの取得に失敗しました')
      }
    } catch (error) {
      console.error('タスクデータの取得に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = tasks

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.place.building.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 建物フィルター
    if (buildingFilter && buildingFilter !== 'all') {
      filtered = filtered.filter(task =>
        task.place.building.name === buildingFilter
      )
    }

    // 場所フィルター
    if (placeFilter && placeFilter !== 'all') {
      filtered = filtered.filter(task =>
        task.place.name === placeFilter
      )
    }

    // 担当者割り当てフィルター
    if (assignmentFilter === 'assigned') {
      filtered = filtered.filter(task => task.assignments.length > 0)
    } else if (assignmentFilter === 'unassigned') {
      filtered = filtered.filter(task => task.assignments.length === 0)
    }
    // assignmentFilter === 'all' の場合はフィルターを適用しない

    setFilteredTasks(filtered)
  }

  const getUniqueBuildings = () => {
    const buildings = tasks.map(task => task.place.building.name)
    return [...new Set(buildings)]
  }

  const getUniquePlaces = () => {
    const places = tasks.map(task => task.place.name)
    return [...new Set(places)]
  }

  const getCycleLabel = (cycle: string) => {
    switch (cycle) {
      case 'daily':
        return '毎日'
      case 'weekly':
        return '毎週'
      case 'monthly':
        return '毎月'
      default:
        return cycle
    }
  }

  const handleEditSuccess = () => {
    fetchTasks()
    setEditingTaskId(null)
  }

  const handleEditCancel = () => {
    setEditingTaskId(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p>データを読み込み中...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                  <CardTitle className="text-xl lg:text-2xl">📋 タスク一覧</CardTitle>
                  <CardDescription>
                    登録されているタスクと担当者の一覧
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full sm:w-auto">
                      ← ダッシュボードに戻る
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="outline" className="w-full sm:w-auto">
                      登録画面
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* フィルター */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">フィルター</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">検索</label>
                  <Input
                    placeholder="タスク名、説明、場所で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">建物</label>
                  <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべての建物" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべての建物</SelectItem>
                      {getUniqueBuildings().map(building => (
                        <SelectItem key={building} value={building}>
                          {building}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">場所</label>
                  <Select value={placeFilter} onValueChange={setPlaceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべての場所" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべての場所</SelectItem>
                      {getUniquePlaces().map(place => (
                        <SelectItem key={place} value={place}>
                          {place}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">担当者割り当て</label>
                  <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="assigned">担当者あり</SelectItem>
                      <SelectItem value="unassigned">担当者なし</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* タスク編集フォーム */}
          {editingTaskId && (
            <div className="mb-8">
              <TaskEditForm
                taskId={editingTaskId}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            </div>
          )}

          {/* タスク一覧 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                タスク一覧 ({filteredTasks.length}件)
              </h2>
            </div>

            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500">該当するタスクが見つかりません</p>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map(task => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{task.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {task.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-sm">
                              {task.points}ポイント
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                              {getCycleLabel(task.cycle)}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingTaskId(task.id)}
                            >
                              編集
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          📍 {task.place.building.name} - {task.place.name}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">担当者:</span>
                        {task.assignments.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {task.assignments.map(assignment => (
                              <Badge key={assignment.id} variant="default" className="text-xs">
                                👤 {assignment.user.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            担当者未割り当て
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 