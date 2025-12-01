// src/components/Admin/Orders/OrderItemModal.jsx
import React from 'react'

const OrderItemModal = ({
    open,
    mode,
    itemForm,
    menuSearch,
    setMenuSearch,
    filteredMenuItems,
    menuLoading,
    onSelectMenuItem,
    onItemFormChange,
    onSubmitItem,
    onCancel,
    itemSubmitting,
}) => {
    if (!open) return null

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(10px)',
            }}
            onClick={onCancel}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '20px',
                    width: '600px',
                    maxWidth: '95vw',
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 70px rgba(0,0,0,0.3)',
                    padding: '32px',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3
                    style={{
                        margin: '0 0 24px 0',
                        fontSize: '26px',
                        fontWeight: 'bold',
                        color: '#111827',
                        textAlign: 'center',
                    }}
                >
                    {mode === 'create' ? 'Thêm món mới' : 'Sửa món'}
                </h3>

                <input
                    type="text"
                    placeholder="Tìm món ăn..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '14px 18px',
                        marginBottom: '20px',
                        borderRadius: '14px',
                        border: '2px solid #e2e8f0',
                        fontSize: '16px',
                        outline: 'none',
                    }}
                />

                <div
                    style={{
                        maxHeight: '380px',
                        overflowY: 'auto',
                        border: '2px solid #e2e8f0',
                        borderRadius: '14px',
                        marginBottom: '24px',
                    }}
                >
                    {menuLoading ? (
                        <div
                            style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: '#94a3b8',
                            }}
                        >
                            Đang tải menu...
                        </div>
                    ) : filteredMenuItems.length === 0 ? (
                        <div
                            style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: '#94a3b8',
                            }}
                        >
                            Không tìm thấy món nào
                        </div>
                    ) : (
                        filteredMenuItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onSelectMenuItem(item)}
                                style={{
                                    padding: '16px 20px',
                                    borderBottom: '1px solid #f1f5f9',
                                    cursor: 'pointer',
                                    background:
                                        itemForm.menuItemId == item.id
                                            ? '#dbeafe'
                                            : 'white',
                                    transition: '0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    if (itemForm.menuItemId != item.id) {
                                        e.currentTarget.style.background =
                                            '#f8fafc'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (itemForm.menuItemId != item.id) {
                                        e.currentTarget.style.background =
                                            'white'
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '17px',
                                        color: '#1e40af',
                                    }}
                                >
                                    {item.name}
                                </div>
                                <div
                                    style={{
                                        color: '#dc2626',
                                        fontWeight: 'bold',
                                        marginTop: '4px',
                                    }}
                                >
                                    {Number(item.price).toLocaleString('vi-VN')}{' '}
                                    ₫
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div
                    style={{
                        padding: '16px',
                        background: '#f0fdf4',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        fontWeight: 'bold',
                        color: '#166534',
                    }}
                >
                    Đã chọn: {itemForm.name || 'Chưa chọn món'}{' '}
                    {itemForm.price &&
                        `→ ${Number(itemForm.price).toLocaleString('vi-VN')} ₫`}
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '28px',
                    }}
                >
                    <div>
                        <label
                            style={{
                                fontWeight: '600',
                                display: 'block',
                                marginBottom: '8px',
                            }}
                        >
                            Số lượng
                        </label>
                        <input
                            type="number"
                            min="1"
                            name="quantity"
                            value={itemForm.quantity}
                            onChange={onItemFormChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '2px solid #d1d5db',
                                fontSize: '16px',
                            }}
                        />
                    </div>
                    <div>
                        <label
                            style={{
                                fontWeight: '600',
                                display: 'block',
                                marginBottom: '8px',
                            }}
                        >
                            Ghi chú
                        </label>
                        <input
                            type="text"
                            name="note"
                            value={itemForm.note}
                            onChange={onItemFormChange}
                            placeholder="Không cay, thêm rau..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                border: '2px solid #d1d5db',
                                fontSize: '16px',
                            }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '16px',
                    }}
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '12px 28px',
                            borderRadius: '12px',
                            background: '#f3f4f6',
                            border: '2px solid #e5e7eb',
                            fontWeight: '600',
                        }}
                    >
                        Huỷ
                    </button>
                    <button
                        type="button"
                        onClick={onSubmitItem}
                        disabled={!itemForm.menuItemId || itemSubmitting}
                        style={{
                            padding: '12px 32px',
                            borderRadius: '12px',
                            background: itemForm.menuItemId
                                ? '#10b981'
                                : '#9ca3af',
                            color: 'white',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: itemForm.menuItemId
                                ? 'pointer'
                                : 'not-allowed',
                        }}
                    >
                        {itemSubmitting
                            ? 'Đang lưu...'
                            : mode === 'create'
                                ? 'Thêm vào Order'
                                : 'Cập nhật'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderItemModal
