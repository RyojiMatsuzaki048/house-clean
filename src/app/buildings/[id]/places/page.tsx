'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, ArrowLeft, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Place {
  id: number
  name: string
  description: string | null
  createdAt: string
  tasks: {
    id: number
    name: string
  }[]
}

interface Building {
  id: number
  name: string
  description: string | null
}

export default function BuildingPlacesPage() {
  const params = useParams()
  const buildingId = parseInt(params.id as string)
  const [building, setBuilding] = useState<Building | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchBuildingAndPlaces()
  }, [buildingId])

  const fetchBuildingAndPlaces = async () => {
    try {
      // 建物情報を取得
      const buildingResponse = await fetch(`/api/buildings/${buildingId}`)
      if (buildingResponse.ok) {
        const buildingData = await buildingResponse.json()
        setBuilding(buildingData)
      }

      // 掃除場所一覧を取得
      const placesResponse = await fetch(`/api/places?buildingId=${buildingId}`)
      if (placesResponse.ok) {
        const placesData = await placesResponse.json()
        setPlaces(placesData)
      }
    } catch (error) {
      console.error('データの取得に失敗しました:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlace = async (id: number, name: string) => {
    if (!confirm(`「${name}」を削除しますか？\nこの場所に関連するタスクも削除されます。`)) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/places/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPlaces(places.filter(place => place.id !== id))
        alert('掃除場所を削除しました')
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

  if (!building) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">建物が見つかりません</h1>
          <Link href="/buildings">
            <Button>建物一覧に戻る</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link href="/buildings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            建物一覧
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{building.name}</h1>
        {building.description && (
          <p className="text-muted-foreground">{building.description}</p>
        )}
        <p className="text-muted-foreground">掃除場所の管理</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">掃除場所一覧</h2>
          <p className="text-muted-foreground">
            {places.length}箇所の掃除場所が登録されています
          </p>
        </div>
        <Link href={`/buildings/${buildingId}/places/new`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            場所を追加
          </Button>
        </Link>
      </div>

      {places.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">掃除場所が登録されていません</h3>
            <p className="text-muted-foreground mb-4">
              最初の掃除場所を登録してタスクを作成しましょう
            </p>
            <Link href={`/buildings/${buildingId}/places/new`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                場所を追加
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <Card key={place.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{place.name}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePlace(place.id, place.name)}
                    disabled={deletingId === place.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {place.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {place.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      タスク: {place.tasks.length}個
                    </p>
                    <p className="text-xs text-muted-foreground">
                      登録日: {new Date(place.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <Link href={`/places/${place.id}/tasks`}>
                    <Button variant="outline" size="sm">
                      タスク管理
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