import { useEffect, useMemo, useState } from 'react'
import { getMenuItems } from '@/services/menuService'

export const useMenuItems = (params = {}) => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const serializedParams = useMemo(() => JSON.stringify(params), [params])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    getMenuItems(params)
      .then((response) => {
        if (!isMounted) return
        setData(response?.data || [])
        setPagination(response?.pagination || null)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Fetch menu items error:', err)
        setError(err.message || 'Không thể tải dữ liệu menu')
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [serializedParams])

  return { data, pagination, loading, error }
}

