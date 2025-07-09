'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface User {
  id: number
  name: string
}

interface PointUsageFormProps {
  onSuccess?: () => void
}

export function PointUsageForm({ onSuccess }: PointUsageFormProps) {
  const [users, setUsers] = useState<User[]>([])
  const [userId, setUserId] = useState('')
  const [pointsUsed, setPointsUsed] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !pointsUsed || !description.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/point-usages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          pointsUsed: parseInt(pointsUsed),
          description: description.trim()
        }),
      })

      if (response.ok) {
        setUserId('')
        setPointsUsed('')
        setDescription('')
        onSuccess?.()
        alert('ポイント使用を記録しました！')
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error}`)
      }
    } catch (error) {
      alert('ポイント使用の記録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>ポイント使用記録</CardTitle>
        <CardDescription>
          ポイントを使用した際の記録を登録してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">ユーザー</Label>
            <select
              id="user-select"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">ユーザーを選択してください</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="points-used">使用ポイント数</Label>
            <Input
              id="points-used"
              type="number"
              min="1"
              placeholder="例: 50"
              value={pointsUsed}
              onChange={(e) => setPointsUsed(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="usage-description">使用用途</Label>
            <Input
              id="usage-description"
              type="text"
              placeholder="例: お菓子を買った"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? '記録中...' : 'ポイント使用を記録'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 