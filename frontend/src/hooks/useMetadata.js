import { useEffect, useState } from 'react'
import { getMetadataOptions } from '../services/api'

export const useMetadata = () => {
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadOptions = async () => {
      setLoading(true)
      setError('')

      try {
        const result = await getMetadataOptions()
        if (!cancelled) {
          setOptions(result)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadOptions()

    return () => {
      cancelled = true
    }
  }, [])

  return { options, loading, error }
}

export default useMetadata