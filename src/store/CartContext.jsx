/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { addCartItem, getCartByOrderId, updateCartItemQuantity } from '@/services/cartService'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const defaultOrderId = import.meta.env.VITE_DEFAULT_ORDER_ID || '1'
  const [orderId] = useState(defaultOrderId)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const syncItems = useCallback((serverItems = []) => {
    setItems(
      serverItems.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        name: item.menuItem?.name,
      })),
    )
  }, [])

  const refreshCart = useCallback(async () => {
    if (!orderId) {
      setError('Chưa xác định được mã đơn hàng')
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const order = await getCartByOrderId(orderId)
      syncItems(order?.items || [])
      setError(null)
    } catch (err) {
      setError(err.message || 'Không thể tải giỏ hàng')
    } finally {
      setLoading(false)
    }
  }, [orderId, syncItems])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const notify = useCallback((variant, title, description) => {
    const message = title || 'Thông báo'
    const options = description ? { description } : undefined
    if (variant === 'error') {
      toast.error(message, options)
      return
    }
    if (variant === 'success') {
      toast.success(message, options)
      return
    }
    toast(message, options)
  }, [])

  const addItemToCart = useCallback(
    async ({ menuItemId, quantity = 1, price, name, meta }) => {
      if (!orderId) {
        notify('error', 'Không thể thêm món', 'Thiếu mã đơn hàng mặc định')
        return
      }

      try {
        const existingItem = items.find((item) => item.menuItemId === menuItemId)
        if (existingItem) {
          await updateCartItemQuantity(orderId, existingItem.id, existingItem.quantity + quantity)
        } else {
          await addCartItem(orderId, {
            menuItemId,
            quantity,
            price,
            meta: {
              name,
              ...meta,
            },
          })
        }
        await refreshCart()
        notify('success', 'Đã thêm vào giỏ', name ? `Đã thêm ${name} vào giỏ hàng của bạn` : 'Món đã được thêm')
      } catch (err) {
        notify('error', 'Không thể thêm món', err.message || 'Vui lòng thử lại sau')
      }
    },
    [items, notify, orderId, refreshCart],
  )

  const contextValue = useMemo(
    () => ({
      orderId,
      items,
      distinctCount: items.length,
      loading,
      error,
      refreshCart,
      syncItems,
      addItemToCart,
      notify,
    }),
    [addItemToCart, error, items, loading, notify, orderId, refreshCart, syncItems],
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCartContext phải được sử dụng trong CartProvider')
  }
  return context
}


