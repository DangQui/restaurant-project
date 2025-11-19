import styles from "./PaymentMethods.module.scss";

const paymentOptions = [
  {
    id: "bank-transfer",
    label: "Direct bank transfer",
    description:
      "Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.",
  },
  {
    id: "check-payments",
    label: "Check payments",
    description:
      "Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.",
  },
  {
    id: "cash-on-delivery",
    label: "Cash on delivery",
    description: "Pay with cash upon delivery.",
  },
  {
    id: "paypal",
    label: "PayPal",
    description:
      "Pay via PayPal; you can pay with your credit card if you dont have a PayPal account.",
  },
];

const PaymentMethods = ({ selected, onSelect }) => {
  return (
    <div className={styles.methods}>
      {paymentOptions.map((option) => (
        <div key={option.id} className={styles.methodOption}>
          <label className={styles.methodLabel}>
            <input
              type="radio"
              name="payment-method"
              value={option.id}
              checked={selected === option.id}
              onChange={(e) => onSelect(e.target.value)}
            />
            <span className={styles.radioCustom} />
            <span className={styles.methodName}>{option.label}</span>
          </label>

          {selected === option.id && (
            <div className={styles.methodDescription}>{option.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;
