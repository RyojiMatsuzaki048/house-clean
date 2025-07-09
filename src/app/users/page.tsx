'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: number
  name: string
  assignments: {
    id: number
    task: {
      id: number
      name: string
      place: {
        name: string
        building: {
          name: string
        }
      }
    }
  }[]
  taskLogs: {
    id: number
  }[]
  pointUsages: {
    id: number
  }[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        console.error('ユーザーデータの取得に失敗しました')
      }
    } catch (error) {
      console.error('ユーザーデータの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`「${name}」を削除しますか？\nこの操作は取り消せません。`)) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id))
        alert('ユーザーを削除しました')
      } else {
        const errorData = await response.json()
        alert(errorData.error || '削除に失敗しました')
      }
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            ダッシュボード
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">ユーザー一覧</h1>
          <p className="text-muted-foreground">登録されているユーザーの管理</p>
        </div>
        <Link href="/admin">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            ユーザーを追加
          </Button>
        </Link>
      </div>

      {/* 検索フィルター */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">検索</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="ユーザー名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? '該当するユーザーが見つかりません' : 'ユーザーが登録されていません'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? '検索条件を変更してください' : '最初のユーザーを登録して掃除管理を始めましょう'}
            </p>
            {!searchTerm && (
              <Link href="/admin">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  ユーザーを追加
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              ユーザー一覧 ({filteredUsers.length}人)
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id, user.name)}
                      disabled={deletingId === user.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">担当タスク</p>
                      {user.assignments.length > 0 ? (
                        <div className="space-y-1">
                          {user.assignments.slice(0, 3).map(assignment => (
                            <Badge key={assignment.id} variant="outline" className="text-xs">
                              {assignment.task.place.building.name} - {assignment.task.place.name} - {assignment.task.name}
                            </Badge>
                          ))}
                          {user.assignments.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              他 {user.assignments.length - 3} 件のタスク
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          担当タスクなし
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>実施履歴: {user.taskLogs.length}件</span>
                      <span>ポイント使用: {user.pointUsages.length}件</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 