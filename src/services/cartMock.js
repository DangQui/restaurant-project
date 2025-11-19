const STORAGE_KEY = 'wowwraps_mock_orders'
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=600&q=80'

const isBrowser = typeof window !== 'undefined'
let memoryStore = null

const baseData = {
  '1': {
    id: 1,
    orderType: 'delivery',
    customerName: 'Khách thử nghiệm',
    customerPhone: '0987654321',
    deliveryAddress: 'Số 12 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    deliveryNote: 'Vui lòng gọi trước khi giao',
    status: 'pending',
    total: 209000,
    items: [
      {
        id: 1,
        orderId: 1,
        menuItemId: 101,
        quantity: 1,
        price: 89000,
        menuItem: {
          id: 101,
          name: 'Bánh mì truffle kẹp gà',
          description: 'Gà nướng than hoa, sốt truffle và rau củ muối chua.',
          category: 'lunch',
          imageUrl: FALLBACK_IMAGE,
        },
      },
      {
        id: 2,
        orderId: 1,
        menuItemId: 205,
        quantity: 1,
        price: 120000,
        menuItem: {
          id: 205,
          name: 'Spaghetti Napoletana',
          description: 'Xốt cà chua Ý, phô mai bào và dầu olive đặc biệt.',
          category: 'dinner',
          imageUrl:
            'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=600&q=80',
        },
      },
    ],
  },
}

const getStorage = () => {
  if (isBrowser) {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch (error) {
        console.warn('Không thể đọc dữ liệu mock, sử dụng mặc định.', error)
      }
    }
  }
  return memoryStore
}

const persist = (data) => {
  if (isBrowser) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } else {
    memoryStore = data
  }
}

const ensureData = () => {
  const current = getStorage()
  if (current) {
    return current
  }
  persist(baseData)
  return { ...baseData }
}

const serializeOrder = (order) => ({
  ...order,
  items: order.items.map((item) => ({
    ...item,
    menuItem: { ...item.menuItem },
  })),
})

const recalcTotal = (order) => {
  order.total = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
}

const upsertOrder = (orderId) => {
  const data = ensureData()
  if (!data[orderId]) {
    data[orderId] = {
      id: Number(orderId),
      orderType: 'delivery',
      status: 'pending',
      total: 0,
      customerName: '',
      customerPhone: '',
      deliveryAddress: '',
      deliveryNote: '',
      items: [],
    }
  }
  return { data, order: data[orderId] }
}

export const mockCartApi = {
  async getOrder(orderId) {
    const { order } = upsertOrder(orderId)
    recalcTotal(order)
    persist(ensureData())
    return serializeOrder(order)
  },

  async addItem(orderId, payload) {
    const { data, order } = upsertOrder(orderId)
    const { menuItemId, quantity = 1, price = 0, meta } = payload
    const existing = order.items.find((item) => item.menuItemId === menuItemId)
    if (existing) {
      existing.quantity += quantity
    } else {
      const nextId = order.items.reduce((max, item) => Math.max(max, item.id), 0) + 1
      order.items.push({
        id: nextId,
        orderId: Number(orderId),
        menuItemId,
        quantity,
        price,
        menuItem: {
          id: menuItemId,
          name: meta?.name || `Món #${menuItemId}`,
          description: meta?.description || 'Món thử nghiệm trong giỏ hàng.',
          category: meta?.category || 'menu',
          imageUrl: meta?.imageUrl || FALLBACK_IMAGE,
        },
      })
    }
    recalcTotal(order)
    persist(data)
    return serializeOrder(order)
  },

  async updateItem(orderId, itemId, quantity) {
    const { data, order } = upsertOrder(orderId)
    const target = order.items.find((item) => item.id === Number(itemId))
    if (!target) {
      throw new Error('Không tìm thấy món trong giỏ mock')
    }
    target.quantity = quantity
    recalcTotal(order)
    persist(data)
    return serializeOrder(order)
  },

  async removeItem(orderId, itemId) {
    const { data, order } = upsertOrder(orderId)
    order.items = order.items.filter((item) => item.id !== Number(itemId))
    recalcTotal(order)
    persist(data)
    return serializeOrder(order)
  },

  async updateOrder(orderId, payload) {
    const { data, order } = upsertOrder(orderId)
    Object.assign(order, payload)
    persist(data)
    return serializeOrder(order)
  },
}


