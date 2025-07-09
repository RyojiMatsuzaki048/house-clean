'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Building {
  id: number
  name: string
  description: string | null
  createdAt: string
  places: {
    id: number
    name: string
  }[]
}

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

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
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`「${name}」を削除しますか？\nこの建物に関連する掃除場所も削除されます。`)) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/buildings/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBuildings(buildings.filter(building => building.id !== id))
        alert('建物を削除しました')
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">建物一覧</h1>
          <p className="text-muted-foreground">登録されている建物の管理</p>
        </div>
        <Link href="/buildings/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            建物を追加
          </Button>
        </Link>
      </div>

      {buildings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">建物が登録されていません</h3>
            <p className="text-muted-foreground mb-4">
              最初の建物を登録して掃除管理を始めましょう
            </p>
            <Link href="/buildings/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                建物を追加
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {buildings.map((building) => (
            <Card key={building.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{building.name}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(building.id, building.name)}
                    disabled={deletingId === building.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {building.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {building.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      掃除場所: {building.places.length}箇所
                    </p>
                    <p className="text-xs text-muted-foreground">
                      登録日: {new Date(building.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <Link href={`/buildings/${building.id}/places`}>
                    <Button variant="outline" size="sm">
                      場所を管理
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 