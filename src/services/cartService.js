import { apiClient } from './apiClient'
import { mockCartApi } from './cartMock'

const CAN_FALLBACK_TO_MOCK = import.meta.env.VITE_USE_CART_MOCK === 'true'

const pickBody = (payload = {}) => {
  const { meta: _meta, ...rest } = payload
  return rest
}

const withFallback = async (apiCall, mockCall) => {
  try {
    return await apiCall()
  } catch (error) {
    if (!CAN_FALLBACK_TO_MOCK) {
      throw error
    }
    console.warn('[cartService] Backend không sẵn sàng, chuyển sang dữ liệu mock.', error.message || error)
    return mockCall()
  }
}

export const getCartByOrderId = (orderId) => {
  if (!orderId) {
    throw new Error('Thiếu mã đơn hàng')
  }
  return withFallback(
    () => apiClient.get(`/orders/${orderId}`),
    () => mockCartApi.getOrder(orderId),
  )
}

export const updateCartItemQuantity = (orderId, itemId, quantity) => {
  if (!orderId || !itemId) {
    throw new Error('Thiếu mã đơn hàng hoặc món ăn')
  }
  return withFallback(
    () =>
      apiClient.put(`/orders-items/${orderId}/items/${itemId}`, {
        body: { quantity },
      }),
    () => mockCartApi.updateItem(orderId, itemId, quantity),
  )
}

export const removeCartItem = (orderId, itemId) => {
  if (!orderId || !itemId) {
    throw new Error('Thiếu mã đơn hàng hoặc món ăn')
  }
  return withFallback(
    () => apiClient.delete(`/orders-items/${orderId}/items/${itemId}`),
    () => mockCartApi.removeItem(orderId, itemId),
  )
}

export const addCartItem = (orderId, payload) => {
  if (!orderId || !payload?.menuItemId) {
    throw new Error('Thiếu mã đơn hàng hoặc món ăn')
  }

  return withFallback(
    () =>
      apiClient.post(`/orders-items/${orderId}/items`, {
        body: pickBody(payload),
      }),
    () => mockCartApi.addItem(orderId, payload),
  )
}

export const updateOrderDelivery = (orderId, body) => {
  if (!orderId) {
    throw new Error('Thiếu mã đơn hàng')
  }
  return withFallback(
    () =>
      apiClient.put(`/orders/${orderId}`, {
        body,
      }),
    () => mockCartApi.updateOrder(orderId, body),
  )
}



