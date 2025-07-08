'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Place {
  id: number
  name: string
  building: {
    id: number
    name: string
  }
}

interface TaskFormProps {
  onSuccess?: () => void
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const [places, setPlaces] = useState<Place[]>([])
  const [placeId, setPlaceId] = useState('')
  const [name, setName] = useState('')
  const [point, setPoint] = useState('')
  const [cycleDays, setCycleDays] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/places')
      if (response.ok) {
        const data = await response.json()
        setPlaces(data)
      }
    } catch (error) {
      console.error('掃除場所の取得に失敗しました:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!placeId || !name.trim() || !point || !cycleDays) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          placeId: parseInt(placeId), 
          name: name.trim(),
          point: parseInt(point),
          cycleDays: parseInt(cycleDays)
        }),
      })

      if (response.ok) {
        setPlaceId('')
        setName('')
        setPoint('')
        setCycleDays('')
        onSuccess?.()
        alert('タスクが登録されました！')
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error}`)
      }
    } catch (error) {
      alert('タスクの登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>掃除タスクを登録</CardTitle>
        <CardDescription>
          掃除内容、ポイント、実施サイクルを設定してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="place-select">掃除場所</Label>
            <select
              id="place-select"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">掃除場所を選択してください</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.building.name} - {place.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-name">掃除内容</Label>
            <Input
              id="task-name"
              type="text"
              placeholder="例: 便座清掃、床掃除"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-point">ポイント</Label>
            <Input
              id="task-point"
              type="number"
              min="1"
              placeholder="例: 10"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-cycle">実施サイクル（日数）</Label>
            <Input
              id="task-cycle"
              type="number"
              min="1"
              placeholder="例: 7（1週間に1回）"
              value={cycleDays}
              onChange={(e) => setCycleDays(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? '登録中...' : 'タスクを登録'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 