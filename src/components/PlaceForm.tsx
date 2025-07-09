'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Building {
  id: number
  name: string
}

interface PlaceFormProps {
  onSuccess?: () => void
}

export function PlaceForm({ onSuccess }: PlaceFormProps) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [buildingId, setBuildingId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const response = await fetch('/api/buildings')
      if (response.ok) {
        const data = await response.json()
        setBuildings(data)
      }
    } catch (error) {
      console.error('建物の取得に失敗しました:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!buildingId || !name.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          buildingId: parseInt(buildingId), 
          name: name.trim(),
          description: description.trim() || null
        }),
      })

      if (response.ok) {
        setBuildingId('')
        setName('')
        setDescription('')
        onSuccess?.()
        alert('掃除場所が登録されました！')
      } else {
        const error = await response.json()
        alert(`エラー: ${error.error}`)
      }
    } catch (error) {
      alert('掃除場所の登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>掃除場所を登録</CardTitle>
        <CardDescription>
          建物内の掃除場所（2階トイレ、1階キッチンなど）を登録してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="building-select">建物</Label>
            <select
              id="building-select"
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">建物を選択してください</option>
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="place-name">掃除場所名</Label>
            <Input
              id="place-name"
              type="text"
              placeholder="例: 2階トイレ、1階キッチン"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="place-description">掃除内容の詳細（任意）</Label>
            <textarea
              id="place-description"
              placeholder="例: 便座、床、手洗い台の清掃。トイレットペーパーの補充も含む。"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] resize-y"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? '登録中...' : '掃除場所を登録'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 