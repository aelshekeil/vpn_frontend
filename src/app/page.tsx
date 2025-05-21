'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus } from 'lucide-react'
import { useEffect, useOptimistic, useState, useTransition } from 'react'
import { getStats, incrementAndLog } from './counter'

// Add type definitions
type AccessLog = {
  accessed_at: string;
}

type Stats = {
  count: number;
  recentAccess: AccessLog[];
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    count: 0,
    recentAccess: []
  })
  
  const [optimisticStats, setOptimisticStats] = useOptimistic(stats)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getStats().then(setStats).catch((error) => {
      console.error('Failed to load stats:', error)
    })
  }, [])

  const handleClick = async () => {
    startTransition(async () => {
      setOptimisticStats((prev) => ({
        count: prev.count + 1,
        recentAccess: [
          { accessed_at: new Date().toISOString() },
          ...prev.recentAccess.slice(0, 4)
        ]
      }))
      
      try {
        const newStats = await incrementAndLog()
        setStats(newStats)
      } catch (error) {
        console.error('Increment failed:', error)
        // Rollback optimistic update
        setStats((prev) => prev)
      }
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8 sm:p-24">
      <Card className="p-6 sm:p-8 w-full max-w-sm">
        <p className="text-2xl font-medium text-center mb-4">
          Views: {optimisticStats.count}
          {isPending && <span className="ml-2 animate-pulse">...</span>}
        </p>
        <div className="flex justify-center mb-4">
          <Button onClick={handleClick} disabled={isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Increment
          </Button>
        </div>
        <ScrollArea className="h-[100px]">
          {optimisticStats.recentAccess.map((log, i) => (
            <div key={`${log.accessed_at}-${i}`} className="text-sm text-muted-foreground text-center">
              {new Date(log.accessed_at).toLocaleString()}
            </div>
          ))}
        </ScrollArea>
      </Card>
    </main>
  )
}