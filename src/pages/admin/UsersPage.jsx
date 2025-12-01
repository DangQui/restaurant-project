// src/pages/Admin/UsersPage.jsx
import React, { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '@/api/userManagementApi'

const ROLE_OPTIONS = ['ADMIN', 'STAFF', 'USER']

const UsersPage = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER',
    })
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getUsers()
            setUsers(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            setError(err.message || 'Không tải được danh sách người dùng')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const openCreate = () => {
        setEditing(null)
        setForm({
            name: '',
            email: '',
            password: '',
            role: 'USER',
        })
        setShowModal(true)
    }

    const openEdit = (user) => {
        setEditing(user)
        setForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || 'USER',
        })
        setShowModal(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            setError(null)

            const payload = {
                name: form.name,
                email: form.email,
                role: form.role,
            }

            // Nếu tạo mới hoặc có password mới => gửi password
            if (!editing || form.password) {
                payload.password = form.password
            }

            if (editing) {
                await updateUser(editing.id, payload)
            } else {
                await createUser(payload)
            }

            setShowModal(false)
            setEditing(null)
            await fetchData()
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || 'Lưu người dùng thất bại')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return
        try {
            setDeletingId(id)
            await deleteUser(id)
            await fetchData()
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || 'Xóa người dùng thất bại')
        } finally {
            setDeletingId(null)
        }
    }

    const filtered = users.filter((u) => {
        const q = search.toLowerCase()
        return (
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.role?.toLowerCase().includes(q)
        )
    })

    return (
        <div>
            <h1 style={{ marginBottom: 16, color: '#f9fafb' }}>Quản lý người dùng</h1>

            {error && (
                <div
                    style={{
                        marginBottom: 12,
                        padding: 8,
                        borderRadius: 8,
                        border: '1px solid #ef4444',
                        background: 'rgba(239,68,68,0.1)',
                        color: '#fecaca',
                        fontSize: 13,
                    }}
                >
                    {error}
                </div>
            )}

            {/* Toolbar */}
            <div
                style={{
                    marginBottom: 16,
                    padding: 12,
                    borderRadius: 12,
                    background: '#020617',
                    border: '1px solid #1f2937',
                    display: 'flex',
                    gap: 12,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#e5e7eb',
                }}
            >
                <input
                    type="text"
                    placeholder="Tìm theo tên, email, role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: 220,
                        padding: '8px 10px',
                        borderRadius: 9999,
                        border: '1px solid #334155',
                        background: '#020617',
                        color: '#e5e7eb',
                        fontSize: 14,
                    }}
                />
                <button
                    onClick={openCreate}
                    style={{
                        padding: '8px 16px',
                        borderRadius: 9999,
                        border: 'none',
                        background: '#f97316',
                        color: '#020617',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    ➕ Thêm user
                </button>
            </div>

            {/* Table */}
            <div
                style={{
                    background: '#020617',
                    borderRadius: 12,
                    border: '1px solid #1f2937',
                    padding: 16,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    color: '#e5e7eb',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: 14,
                        }}
                    >
                        <thead>
                            <tr style={{ background: '#020617' }}>
                                {['ID', 'Tên', 'Email', 'Role', 'Thao tác'].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: '10px 8px',
                                            borderBottom: '1px solid #1f2937',
                                            textAlign: 'left',
                                            fontWeight: 600,
                                            color: '#9ca3af',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && !loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            padding: 16,
                                            textAlign: 'center',
                                            color: '#6b7280',
                                        }}
                                    >
                                        Không có user nào
                                    </td>
                                </tr>
                            )}

                            {loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            padding: 16,
                                            textAlign: 'center',
                                            color: '#6b7280',
                                        }}
                                    >
                                        Đang tải...
                                    </td>
                                </tr>
                            )}

                            {filtered.map((u, idx) => (
                                <tr
                                    key={u.id}
                                    style={{
                                        background: idx % 2 === 0 ? '#020617' : '#030712',
                                    }}
                                >
                                    <td
                                        style={{
                                            borderBottom: '1px solid #1f2937',
                                            padding: '10px 8px',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        #{u.id}
                                    </td>
                                    <td
                                        style={{
                                            borderBottom: '1px solid #1f2937',
                                            padding: '10px 8px',
                                            maxWidth: 200,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                        title={u.name}
                                    >
                                        {u.name}
                                    </td>
                                    <td
                                        style={{
                                            borderBottom: '1px solid #1f2937',
                                            padding: '10px 8px',
                                            maxWidth: 230,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            color: '#93c5fd',
                                        }}
                                        title={u.email}
                                    >
                                        {u.email}
                                    </td>
                                    <td
                                        style={{
                                            borderBottom: '1px solid #1f2937',
                                            padding: '10px 8px',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                padding: '3px 10px',
                                                borderRadius: 9999,
                                                fontSize: 12,
                                                fontWeight: 600,
                                                background: 'rgba(56,189,248,0.12)',
                                                color: '#38bdf8',
                                            }}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td
                                        style={{
                                            borderBottom: '1px solid #1f2937',
                                            padding: '10px 8px',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        <button
                                            onClick={() => openEdit(u)}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: 9999,
                                                border: '1px solid #3b82f6',
                                                background: 'transparent',
                                                color: '#60a5fa',
                                                fontSize: 13,
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                marginRight: 6,
                                            }}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            disabled={deletingId === u.id}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: 9999,
                                                border: '1px solid #ef4444',
                                                background:
                                                    deletingId === u.id ? 'rgba(248,113,113,0.15)' : 'transparent',
                                                color: '#fca5a5',
                                                fontSize: 13,
                                                fontWeight: 500,
                                                cursor: deletingId === u.id ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {deletingId === u.id ? 'Đang xóa...' : 'Xóa'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal thêm/sửa user */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 900,
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        style={{
                            background: '#ffffff',
                            borderRadius: 16,
                            width: 'min(520px, 95vw)',
                            maxHeight: '90vh',
                            padding: 24,
                            overflowY: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 700 }}>
                            {editing ? 'Sửa người dùng' : 'Thêm người dùng'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                                    Họ tên
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 10px',
                                        borderRadius: 8,
                                        border: '1px solid #d1d5db',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 10px',
                                        borderRadius: 8,
                                        border: '1px solid #d1d5db',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                                    Mật khẩu {editing && <span style={{ fontWeight: 400 }}>(để trống nếu không đổi)</span>}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px 10px',
                                        borderRadius: 8,
                                        border: '1px solid #d1d5db',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px 10px',
                                        borderRadius: 8,
                                        border: '1px solid #d1d5db',
                                    }}
                                >
                                    {ROLE_OPTIONS.map((r) => (
                                        <option key={r} value={r}>
                                            {r}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 8,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '8px 18px',
                                        borderRadius: 8,
                                        border: '1px solid #d1d5db',
                                        background: '#f3f4f6',
                                        fontWeight: 600,
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        padding: '8px 22px',
                                        borderRadius: 8,
                                        border: 'none',
                                        background: '#2563eb',
                                        color: '#ffffff',
                                        fontWeight: 600,
                                        cursor: saving ? 'default' : 'pointer',
                                    }}
                                >
                                    {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UsersPage
