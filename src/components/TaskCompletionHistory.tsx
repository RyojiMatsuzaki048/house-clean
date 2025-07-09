'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TaskLog {
  id: number
  dateDone: string
  task: {
    id: number
    name: string
    point: number
    place: {
      name: string
      building: {
        name: string
      }
    }
  }
  user: {
    id: number
    name: string
  }
}

interface TaskCompletionHistoryProps {
  taskLogs: TaskLog[]
}

export function TaskCompletionHistory({ taskLogs }: TaskCompletionHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>タスク完了履歴</CardTitle>
        <CardDescription>
          今週のタスク完了履歴
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {taskLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              今週のタスク完了履歴がありません
            </p>
          ) : (
            taskLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{log.task.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {log.task.place.building.name} - {log.task.place.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    実施者: {log.user.name} • {formatDate(log.dateDone)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    +{log.task.point}ポイント
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 