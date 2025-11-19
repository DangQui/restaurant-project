import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import Button from "@/components/Button/Button";
import Loading from "@/components/Loading/Loading";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/utils/formatCurrency";
import styles from "./Cart.module.scss";

const CartPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fallbackOrderId = import.meta.env.VITE_DEFAULT_ORDER_ID || "1";
  const orderId = searchParams.get("orderId") || fallbackOrderId;

  const {
    items,
    subtotal,
    shippingFee,
    discount,
    total,
    initialLoading,
    error,
    refresh,
    order,
    updatingItemId,
    removingItemId,
    couponStatus,
    updateItemQuantity,
    removeItem,
    applyCoupon,
    saveDeliveryInfo,
    addressSaving,
  } = useCart(orderId);

  const [couponInput, setCouponInput] = useState("");
  const [addressForm, setAddressForm] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    deliveryNote: "",
  });

  useEffect(() => {
    // Dữ liệu giao hàng được đồng bộ từ backend mỗi khi đơn hàng thay đổi
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAddressForm({
      customerName: order?.customerName || "",
      customerPhone: order?.customerPhone || "",
      deliveryAddress: order?.deliveryAddress || "",
      deliveryNote: order?.deliveryNote || "",
    });
  }, [order]);

  const handleQuantityChange = (itemId, nextQuantity) => {
    if (nextQuantity < 1) return;
    updateItemQuantity(itemId, nextQuantity);
  };

  const handleApplyCoupon = (event) => {
    event.preventDefault();
    applyCoupon(couponInput);
  };

  const shippingLabel = useMemo(() => {
    if (!order?.orderType) return "Đơn tiêu chuẩn";
    return order.orderType === "delivery"
      ? "Giao tận nơi"
      : "Dùng tại nhà hàng";
  }, [order?.orderType]);

  const handleAddressChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressSave = () => {
    saveDeliveryInfo(addressForm);
  };

  const handleCheckout = () => {
    navigate(`/checkout?orderId=${orderId}`);
  };

  if (initialLoading) {
    return <Loading fullScreen text="Đang tải giỏ hàng..." />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className="pill">Giỏ hàng</span>
          <h1>Giữ trọn cảm hứng ẩm thực</h1>
          <p>
            Kiểm tra lại những món bạn đã chọn trước khi thanh toán. Bạn có thể
            điều chỉnh số lượng, áp dụng ưu đãi hoặc thay đổi địa chỉ nhận món
            chỉ trong vài giây.
          </p>
          <div className={styles.heroMeta}>
            <span>Mã đơn #{order?.id || "đang cập nhật"}</span>
            <span>Hình thức: {shippingLabel}</span>
          </div>
        </div>
      </div>

      {error ? (
        <div className={styles.errorBox}>
          <p>{error}</p>
          <Button variant="secondary" onClick={refresh}>
            Thử lại
          </Button>
        </div>
      ) : null}

      <div className={styles.layout}>
        <section className={styles.cartPanel}>
          <div className={styles.tableHeader}>
            <span>Món ăn</span>
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span>Tạm tính</span>
          </div>

          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Giỏ hàng của bạn đang trống. Hãy thêm món để tiếp tục nhé.</p>
              <Button as={Link} to="/menu">
                Khám phá thực đơn
              </Button>
            </div>
          ) : (
            <>
              {items.map((item) => {
                const isUpdating = updatingItemId === item.id;
                const isRemoving = removingItemId === item.id;

                return (
                  <article key={item.id} className={styles.row}>
                    <div className={styles.foodCell}>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeItem(item.id)}
                        disabled={isRemoving || isUpdating}
                        aria-label={`Xoá ${item.name}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M9 3h6a1 1 0 0 1 .993.883L16 4v1h4a1 1 0 0 1 .117 1.993L20 7h-1.047l-.845 11.828A2.5 2.5 0 0 1 15.62 21H8.38a2.5 2.5 0 0 1-2.488-2.172L5.047 7H4a1 1 0 0 1-.117-1.993L4 5h4V4a1 1 0 0 1 1-1zm5 6a1 1 0 0 0-1 .883L13 10v7a1 1 0 0 0 1.993.117L15 17v-7a1 1 0 0 0-1-1m-4 0a1 1 0 0 0-.993.883L9 10v7a1 1 0 0 0 1.993.117L11 17v-7a1 1 0 0 0-1-1m2-4h-2v1h2z"
                          />
                        </svg>
                      </button>
                      <div className={styles.thumbnail}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className={styles.foodName}>{item.name}</p>
                        <p className={styles.foodMeta}>{item.description}</p>
                      </div>
                    </div>

                    <div className={styles.priceCell}>
                      {formatCurrency(item.price)}
                    </div>

                    <div className={styles.quantityCell}>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={
                          item.quantity <= 1 || isUpdating || isRemoving
                        }>
                        –
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={isUpdating || isRemoving}>
                        +
                      </button>
                    </div>

                    <div className={styles.subtotalCell}>
                      {formatCurrency(item.subtotal)}
                    </div>
                  </article>
                );
              })}

              <form className={styles.couponRow} onSubmit={handleApplyCoupon}>
                <label htmlFor="coupon" className="sr-only">
                  Nhập mã giảm giá
                </label>
                <input
                  id="coupon"
                  type="text"
                  placeholder="Nhập mã ưu đãi"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                />
                <Button type="submit" disabled={couponStatus === "loading"}>
                  {couponStatus === "loading"
                    ? "Đang áp dụng..."
                    : "Áp dụng mã"}
                </Button>
                <Button type="button" variant="secondary" onClick={refresh}>
                  Cập nhật giỏ
                </Button>
              </form>
            </>
          )}
        </section>

        <aside className={styles.summaryPanel}>
          <h2>Tổng quan đơn hàng</h2>
          <div className={styles.summaryRow}>
            <span>Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Ưu đãi</span>
            <span>-{discount ? formatCurrency(discount) : "0 ₫"}</span>
          </div>
          <div className={styles.summaryRow}>
            <div>
              <p>Phí giao món</p>
              <small>
                {order?.deliveryAddress
                  ? `Giao tới ${order.deliveryAddress}`
                  : "Cập nhật địa chỉ để tính phí chính xác"}
              </small>
            </div>
            <span>{shippingFee ? formatCurrency(shippingFee) : "0 ₫"}</span>
          </div>

          <div className={styles.address}>
            <p className={styles.addressTitle}>Cập nhật địa chỉ giao món</p>
            <div className={styles.addressFields}>
              <label>
                Họ tên
                <input
                  type="text"
                  value={addressForm.customerName}
                  onChange={(event) =>
                    handleAddressChange("customerName", event.target.value)
                  }
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                />
              </label>
              <label>
                Số điện thoại
                <input
                  type="tel"
                  value={addressForm.customerPhone}
                  onChange={(event) =>
                    handleAddressChange("customerPhone", event.target.value)
                  }
                  placeholder="0987 654 321"
                />
              </label>
              <label>
                Địa chỉ giao món
                <textarea
                  rows={3}
                  value={addressForm.deliveryAddress}
                  onChange={(event) =>
                    handleAddressChange("deliveryAddress", event.target.value)
                  }
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                />
              </label>
              <label>
                Ghi chú cho tài xế
                <textarea
                  rows={2}
                  value={addressForm.deliveryNote}
                  onChange={(event) =>
                    handleAddressChange("deliveryNote", event.target.value)
                  }
                  placeholder="Ví dụ: Gọi trước 5 phút, gửi bảo vệ..."
                />
              </label>

              <Button
                type="button"
                variant="secondary"
                className={styles.addressButton}
                onClick={handleAddressSave}
                disabled={addressSaving}>
                {addressSaving ? "Đang lưu..." : "Lưu thông tin giao hàng"}
              </Button>
            </div>
          </div>

          <div className={clsx(styles.summaryRow, styles.totalRow)}>
            <span>Tổng cộng</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <Button className={styles.checkoutButton} onClick={handleCheckout}>
            Tiến hành thanh toán
          </Button>
          <p className={styles.helperText}>
            Chúng tôi sẽ giữ đơn hàng trong vòng 15 phút để bạn hoàn tất thanh
            toán.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
