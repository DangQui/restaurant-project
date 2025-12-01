import { useEffect, useState } from "react";
import {
    getReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
    getAvailableTables,
} from '@/api/reservationApi'

const STATUS_LABELS = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    cancelled: "Đã huỷ",
};

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedReservation, setSelectedReservation] = useState(null);

    const loadReservations = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};
            if (statusFilter) params.status = statusFilter;

            const data = await getReservations(params);
            setReservations(data);

        } catch (err) {
            console.error(err);
            setError(err.message || "Không tải được danh sách đặt bàn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const handleChangeStatus = async (id, newStatus) => {
        try {
            await updateReservation(id, { status: newStatus });
            await loadReservations();
        } catch (err) {
            alert("Cập nhật trạng thái thất bại: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn chắc chắn muốn xoá reservation này?")) return;
        try {
            await deleteReservation(id);
            await loadReservations();
        } catch (err) {
            alert("Xoá reservation thất bại: " + err.message);
        }
    };

    return (
        <div className="admin-page reservations-page" style={{ padding: "24px" }}>
            <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
                Quản lý Đặt bàn (Reservations)
            </h1>

            {/* Bộ lọc */}
            <div
                className="filters"
                style={{ display: "flex", gap: "12px", marginBottom: "16px" }}
            >
                <div>
                    <label>Trạng thái: </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="cancelled">Đã huỷ</option>
                    </select>
                </div>

                <button onClick={loadReservations}>Làm mới</button>
            </div>

            {loading && <p>Đang tải...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "flex", gap: "16px" }}>
                {/* Bảng reservations */}
                <div style={{ flex: 2 }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            background: "#111827",
                            color: "#e5e7eb",
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Khách</th>
                                <th style={thStyle}>Bàn</th>
                                <th style={thStyle}>Số người</th>
                                <th style={thStyle}>Thời gian</th>
                                <th style={thStyle}>Trạng thái</th>
                                <th style={thStyle}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: "12px", textAlign: "center" }}>
                                        Không có đặt bàn nào
                                    </td>
                                </tr>
                            ) : (
                                reservations.map((r) => (
                                    <tr
                                        key={r.id}
                                        style={{
                                            borderTop: "1px solid #374151",
                                            cursor: "pointer",
                                            background:
                                                selectedReservation && selectedReservation.id === r.id
                                                    ? "#1f2937"
                                                    : "transparent",
                                        }}
                                        onClick={() => setSelectedReservation(r)}
                                    >
                                        <td style={tdStyle}>{r.id}</td>
                                        <td style={tdStyle}>
                                            {r.customerName}
                                            <br />
                                            <small>{r.customerPhone}</small>
                                        </td>
                                        <td style={tdStyle}>
                                            {r.table?.tableNumber ?? r.tableId ?? "-"}
                                            <br />
                                            <small>
                                                {r.table?.capacity
                                                    ? `Sức chứa: ${r.table.capacity}`
                                                    : ""}
                                            </small>
                                        </td>
                                        <td style={tdStyle}>{r.partySize}</td>
                                        <td style={tdStyle}>
                                            {r.startTime
                                                ? new Date(r.startTime).toLocaleString()
                                                : "-"}
                                            <br />
                                            {r.endTime
                                                ? "→ " + new Date(r.endTime).toLocaleTimeString()
                                                : ""}
                                        </td>
                                        <td style={tdStyle}>
                                            {STATUS_LABELS[r.status] || r.status}
                                        </td>
                                        <td style={tdStyle}>
                                            <select
                                                value={r.status}
                                                onChange={(e) =>
                                                    handleChangeStatus(r.id, e.target.value)
                                                }
                                            >
                                                <option value="pending">pending</option>
                                                <option value="confirmed">confirmed</option>
                                                <option value="cancelled">cancelled</option>
                                            </select>
                                            <button
                                                style={{ marginLeft: "8px", color: "red" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(r.id);
                                                }}
                                            >
                                                Xoá
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Panel chi tiết */}
                <div
                    style={{
                        flex: 1,
                        background: "#111827",
                        padding: "16px",
                        borderRadius: "8px",
                    }}
                >
                    <h2 style={{ marginBottom: "8px" }}>Chi tiết Reservation</h2>
                    {!selectedReservation ? (
                        <p>Chọn 1 reservation ở bảng bên trái</p>
                    ) : (
                        <div style={{ fontSize: "14px", lineHeight: 1.6 }}>
                            <p>
                                <strong>ID:</strong> {selectedReservation.id}
                            </p>
                            <p>
                                <strong>Khách:</strong> {selectedReservation.customerName} (
                                {selectedReservation.customerPhone})
                            </p>
                            <p>
                                <strong>Bàn:</strong>{" "}
                                {selectedReservation.table?.tableNumber ??
                                    selectedReservation.tableId ??
                                    "-"}
                            </p>
                            <p>
                                <strong>Khu vực:</strong>{" "}
                                {selectedReservation.table?.zone || "-"}
                            </p>
                            <p>
                                <strong>Số người:</strong> {selectedReservation.partySize}
                            </p>
                            <p>
                                <strong>Thời gian:</strong>{" "}
                                {selectedReservation.startTime
                                    ? new Date(
                                        selectedReservation.startTime
                                    ).toLocaleString()
                                    : "-"}{" "}
                                {selectedReservation.endTime
                                    ? "→ " +
                                    new Date(
                                        selectedReservation.endTime
                                    ).toLocaleTimeString()
                                    : ""}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                {STATUS_LABELS[selectedReservation.status] ||
                                    selectedReservation.status}
                            </p>
                            <p>
                                <strong>Ghi chú:</strong>{" "}
                                {selectedReservation.notes || "-"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const thStyle = {
    padding: "8px",
    borderBottom: "1px solid #4b5563",
    textAlign: "left",
};

const tdStyle = {
    padding: "8px",
    verticalAlign: "top",
};
