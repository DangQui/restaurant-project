// src/components/Admin/Orders/OrderDetailModal.jsx
import React from 'react'
import OrderItemModal from './OrderItemModal'

const OrderDetailModal = ({
    open,
    order,
    onClose,
    detailLoading,
    orderTotal,
    statuses,
    statusUpdating,
    onChangeStatus,
    onOpenCreateItem,
    onOpenEditItem,
    onDeleteItem,
    menuItems,
    getMenuItemName,
    // item modal props
    itemMode,
    itemForm,
    menuSearch,
    setMenuSearch,
    filteredMenuItems,
    menuLoading,
    onItemFormChange,
    onSelectMenuItem,
    onSubmitItem,
    onCancelItem,
    itemSubmitting,

    onOpenPayment,
}) => {
    if (!open || !order) return null

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 900,
                    backdropFilter: 'blur(4px)',
                }}
                onClick={onClose}
            >
                <div
                    style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        width: 'min(960px, 95vw)',
                        maxHeight: '90vh',
                        padding: '24px',
                        boxShadow: '0 20px 30px -10px rgba(0,0,0,0.3)',
                        overflowY: 'auto',
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                        }}
                    >
                        <h2
                            style={{
                                margin: 0,
                                fontSize: '26px',
                                fontWeight: 'bold',
                                color: '#111827',
                            }}
                        >
                            Order #{order.id}
                        </h2>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#6b7280',
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {detailLoading ? (
                        <p
                            style={{
                                textAlign: 'center',
                                color: '#6b7280',
                            }}
                        >
                            Đang tải chi tiết...
                        </p>
                    ) : (
                        <>
                            {/* Thông tin cơ bản */}
                            <div
                                style={{
                                    background: '#f8fafc',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    marginBottom: '24px',
                                    border: '1px solid #e2e8f0',
                                }}
                            >
                                <div style={{ marginBottom: '12px' }}>
                                    <strong style={{ color: '#475569' }}>
                                        Loại:{' '}
                                    </strong>{' '}
                                    <span
                                        style={{
                                            fontWeight: '600',
                                            textTransform: 'capitalize',
                                            color: 'black',
                                        }}
                                    >
                                        {order.orderType}
                                    </span>
                                </div>
                                {order.tableId && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <strong style={{ color: '#475569' }}>
                                            Bàn:
                                        </strong>{' '}
                                        <strong
                                            style={{ color: '#1d4ed8' }}
                                        >
                                            #{order.tableId}
                                        </strong>
                                    </div>
                                )}
                                {order.customerName && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <strong style={{ color: '#475569' }}>
                                            Khách:{' '}
                                        </strong>{' '}
                                        {order.customerName}
                                    </div>
                                )}
                                {order.customerPhone && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <strong style={{ color: '#475569' }}>
                                            SĐT:
                                        </strong>{' '}
                                        <a
                                            href={`tel:${order.customerPhone}`}
                                            style={{
                                                color: '#0891b2',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {order.customerPhone}
                                        </a>
                                    </div>
                                )}
                                <div style={{ marginBottom: '12px' }}>
                                    <strong style={{ color: '#475569' }}>
                                        Tổng tiền:
                                    </strong>{' '}
                                    <span
                                        style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#dc2626',
                                        }}
                                    >
                                        {Number(
                                            orderTotal
                                        ).toLocaleString('vi-VN')}
                                        đ
                                    </span>
                                </div>

                            </div>

                            {/* Cập nhật trạng thái */}
                            <div style={{ marginBottom: '24px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '10px',
                                        fontWeight: '600',
                                        color: '#374151',
                                    }}
                                >
                                    Trạng thái hiện tại
                                </label>
                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        onChangeStatus(order.id, e.target.value)
                                    }
                                    disabled={statusUpdating}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        backgroundColor: '#fff',
                                        textTransform: 'capitalize',
                                        color: 'black',
                                    }}
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>
                                            {s === 'pending'
                                                ? '⏳ Chờ xác nhận'
                                                : s === 'confirmed'
                                                    ? '✅ Đã xác nhận'
                                                    : s === 'serving'
                                                        ? '🍽 Đang phục vụ'
                                                        : s === 'completed'
                                                            ? '✔️ Hoàn thành'
                                                            : s === 'cancelled'
                                                                ? '❌ Đã huỷ'
                                                                : s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Danh sách món */}
                            <div style={{ marginBottom: '20px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '16px',
                                    }}
                                >
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#1f2937',
                                        }}
                                    >
                                        Món trong order
                                    </h3>
                                    <button
                                        onClick={onOpenCreateItem}
                                        style={{
                                            padding: '8px 16px',
                                            background: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        + Thêm món
                                    </button>
                                </div>
                                <div
                                    style={{
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <table
                                        style={{
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                        }}
                                    >
                                        <thead>
                                            <tr
                                                style={{
                                                    background: '#f3f4f6',
                                                    color: '#4b5563',
                                                    fontSize: '14px',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                    }}
                                                >
                                                    Tên món
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                        width: '100px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    SL
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                        width: '120px',
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    Đơn giá
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                        width: '120px',
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    Thành tiền
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 16px',
                                                        width: '120px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    Hành động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order?.items?.length > 0 ? (
                                                order.items.map((item) => {
                                                    const price = Number(
                                                        item.price || 0
                                                    )
                                                    const qty = Number(
                                                        item.quantity || 0
                                                    )
                                                    const lineTotal =
                                                        price * qty
                                                    return (
                                                        <tr
                                                            key={item.id}
                                                            style={{
                                                                borderBottom:
                                                                    '1px solid #e5e7eb',
                                                                background:
                                                                    'white',
                                                                color: 'black',
                                                            }}
                                                        >
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        '12px 16px',
                                                                    fontWeight:
                                                                        '500',
                                                                }}
                                                            >
                                                                {getMenuItemName(
                                                                    menuItems,
                                                                    item
                                                                )}
                                                                {item.note && (
                                                                    <span
                                                                        style={{
                                                                            display:
                                                                                'block',
                                                                            fontSize:
                                                                                '12px',
                                                                            color: '#9ca3af',
                                                                            marginTop:
                                                                                '4px',
                                                                        }}
                                                                    >
                                                                        (Ghi chú:{' '}
                                                                        {
                                                                            item.note
                                                                        }
                                                                        )
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        '12px 16px',
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                {qty}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        '12px 16px',
                                                                    textAlign:
                                                                        'right',
                                                                }}
                                                            >
                                                                {price.toLocaleString(
                                                                    'vi-VN'
                                                                )}{' '}
                                                                ₫
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        '12px 16px',
                                                                    textAlign:
                                                                        'right',
                                                                    fontWeight:
                                                                        'bold',
                                                                }}
                                                            >
                                                                {lineTotal.toLocaleString(
                                                                    'vi-VN'
                                                                )}{' '}
                                                                ₫
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding:
                                                                        '12px 16px',
                                                                    textAlign:
                                                                        'center',
                                                                }}
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        onOpenEditItem(
                                                                            item
                                                                        )
                                                                    }
                                                                    style={{
                                                                        background:
                                                                            'none',
                                                                        border: 'none',
                                                                        color: '#2563eb',
                                                                        cursor: 'pointer',
                                                                        marginRight:
                                                                            '8px',
                                                                    }}
                                                                >
                                                                    Sửa
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        onDeleteItem(
                                                                            item.id
                                                                        )
                                                                    }
                                                                    style={{
                                                                        background:
                                                                            'none',
                                                                        border: 'none',
                                                                        color: '#dc2626',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        style={{
                                                            padding: '20px',
                                                            textAlign: 'center',
                                                            color: '#6b7280',
                                                        }}
                                                    >
                                                        Order này chưa có món
                                                        nào.
                                                    </td>
                                                </tr>
                                            )}
                                            <tr
                                                style={{
                                                    background: '#f9fafb',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                <td
                                                    colSpan="3"
                                                    style={{
                                                        padding: '12px 16px',
                                                        textAlign: 'right',
                                                        fontSize: '16px',
                                                        color: 'black',
                                                    }}
                                                >
                                                    Tổng tiền Order:
                                                </td>
                                                <td
                                                    style={{
                                                        padding: '12px 16px',
                                                        textAlign: 'right',
                                                        fontSize: '16px',
                                                        color: '#dc2626',
                                                    }}
                                                >
                                                    {Number(
                                                        orderTotal
                                                    ).toLocaleString('vi-VN')}{' '}
                                                    ₫
                                                </td>
                                                <td>
                                                    {onOpenPayment && (
                                                        <div style={{ marginTop: '8px' }}>
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    order?.status === 'completed' ||
                                                                    order?.status === 'cancelled'
                                                                }
                                                                onClick={onOpenPayment}
                                                                style={{
                                                                    padding: '8px 16px',
                                                                    borderRadius: 9999,
                                                                    border: 'none',
                                                                    background:
                                                                        order?.status === 'completed' ||
                                                                            order?.status === 'cancelled'
                                                                            ? '#9ca3af'
                                                                            : '#16a34a',
                                                                    color: '#ffffff',
                                                                    fontSize: 14,
                                                                    fontWeight: 600,
                                                                    cursor:
                                                                        order?.status === 'completed' ||
                                                                            order?.status === 'cancelled'
                                                                            ? 'not-allowed'
                                                                            : 'pointer',
                                                                }}
                                                            >
                                                                {order?.status === 'completed'
                                                                    ? 'Đã thanh toán'
                                                                    : 'Thanh toán'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>

                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal món con */}
            <OrderItemModal
                open={itemMode === 'create' || itemMode === 'edit'}
                mode={itemMode}
                itemForm={itemForm}
                menuSearch={menuSearch}
                setMenuSearch={setMenuSearch}
                filteredMenuItems={filteredMenuItems}
                menuLoading={menuLoading}
                onSelectMenuItem={onSelectMenuItem}
                onItemFormChange={onItemFormChange}
                onSubmitItem={onSubmitItem}
                onCancel={onCancelItem}
                itemSubmitting={itemSubmitting}
            />
        </>
    )
}

export default OrderDetailModal
