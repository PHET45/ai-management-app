// lib/hooks/useAi.ts
import { useState } from 'react'

interface UseAiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useAi(options?: UseAiOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async (params: {
    prompt?: string
    type?: string
    context?: Record<string, any>
  }) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()
      
      if (data.success) {
        options?.onSuccess?.(data)
        return data
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error.message)
      options?.onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  return { run, loading, error }
}