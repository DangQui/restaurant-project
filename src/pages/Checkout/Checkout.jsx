import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loading from "@/components/Loading/Loading";
import { useCart } from "@/hooks/useCart";
import BillingForm from "@/features/checkout/BillingForm/BillingForm";
import OrderSummary from "@/features/checkout/OrderSummary/OrderSummary";
import PaymentMethods from "@/features/checkout/PaymentMethods/PaymentMethods";
import styles from "./Checkout.module.scss";

const CheckoutPage = () => {
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
    order,
  } = useCart(orderId);

  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Australia",
    streetAddress: "",
    apartment: "",
    city: "",
    district: "",
    postcode: "",
    phone: "",
    email: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("bank-transfer");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleBillingChange = (field, value) => {
    setBillingData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!acceptedTerms) {
      alert("Vui lòng đồng ý với điều khoản để tiếp tục");
      return;
    }

    console.log("Placing order with:", {
      billing: billingData,
      payment: paymentMethod,
      orderId,
      items,
      total,
    });

    // TODO: Implement actual order placement
    alert("Đặt hàng thành công! (Demo)");
  };

  if (initialLoading) {
    return <Loading fullScreen text="Đang tải thông tin đơn hàng..." />;
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.leftSection}>
            <BillingForm data={billingData} onChange={handleBillingChange} />
          </div>

          <div className={styles.rightSection}>
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
            />

            <PaymentMethods
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />

            <div className={styles.terms}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span>
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our{" "}
                  <a href="/privacy" target="_blank">
                    privacy policy
                  </a>
                  .
                </span>
              </label>
            </div>

            <button
              type="button"
              className={styles.placeOrderButton}
              onClick={handlePlaceOrder}
              disabled={!acceptedTerms}>
              Place order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
