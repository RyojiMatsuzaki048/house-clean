'use client'

import { useState } from 'react'
import { BuildingForm } from '@/components/BuildingForm'
import { UserForm } from '@/components/UserForm'
import { PlaceForm } from '@/components/PlaceForm'
import { TaskForm } from '@/components/TaskForm'
import { AssignmentForm } from '@/components/AssignmentForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

type FormType = 'building' | 'user' | 'place' | 'task' | 'assignment'

export default function AdminPage() {
  const [activeForm, setActiveForm] = useState<FormType>('building')

  const handleFormSuccess = () => {
    // フォーム送信成功時の処理（必要に応じてデータを再取得）
    console.log('フォーム送信成功')
  }

  const renderForm = () => {
    switch (activeForm) {
      case 'building':
        return <BuildingForm onSuccess={handleFormSuccess} />
      case 'user':
        return <UserForm onSuccess={handleFormSuccess} />
      case 'place':
        return <PlaceForm onSuccess={handleFormSuccess} />
      case 'task':
        return <TaskForm onSuccess={handleFormSuccess} />
      case 'assignment':
        return <AssignmentForm onSuccess={handleFormSuccess} />
      default:
        return <BuildingForm onSuccess={handleFormSuccess} />
    }
  }

  const getFormTitle = () => {
    switch (activeForm) {
      case 'building':
        return '建物登録'
      case 'user':
        return 'ユーザー登録'
      case 'place':
        return '掃除場所登録'
      case 'task':
        return 'タスク登録'
      case 'assignment':
        return '担当者割り当て'
      default:
        return '登録画面'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                  <CardTitle className="text-xl lg:text-2xl">家の掃除管理 - 登録画面</CardTitle>
                  <CardDescription>
                    建物、ユーザー、掃除場所、タスクを登録して管理できます
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full sm:w-auto">
                      ← ダッシュボードに戻る
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeForm === 'building' ? 'default' : 'outline'}
                  onClick={() => setActiveForm('building')}
                >
                  建物登録
                </Button>
                <Button
                  variant={activeForm === 'user' ? 'default' : 'outline'}
                  onClick={() => setActiveForm('user')}
                >
                  ユーザー登録
                </Button>
                <Button
                  variant={activeForm === 'place' ? 'default' : 'outline'}
                  onClick={() => setActiveForm('place')}
                >
                  掃除場所登録
                </Button>
                <Button
                  variant={activeForm === 'task' ? 'default' : 'outline'}
                  onClick={() => setActiveForm('task')}
                >
                  タスク登録
                </Button>
                <Button
                  variant={activeForm === 'assignment' ? 'default' : 'outline'}
                  onClick={() => setActiveForm('assignment')}
                >
                  担当者割り当て
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            {renderForm()}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>登録手順</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>建物登録</strong>: 自宅、実家などの建物を登録</li>
                <li><strong>ユーザー登録</strong>: 父、母、自分などの担当者を登録</li>
                <li><strong>掃除場所登録</strong>: 建物内の掃除場所（2階トイレなど）と掃除内容の詳細を登録</li>
                <li><strong>タスク登録</strong>: 掃除内容、ポイント、サイクルを設定</li>
                <li><strong>担当者割り当て</strong>: タスクに担当者を割り当て</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 