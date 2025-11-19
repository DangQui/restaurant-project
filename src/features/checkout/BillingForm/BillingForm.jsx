import styles from "./BillingForm.module.scss";

const BillingForm = ({ data, onChange }) => {
  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Billing details</h1>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>
            First name <span className={styles.required}>*</span>
          </span>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            required
          />
        </label>

        <label className={styles.field}>
          <span>
            Last name <span className={styles.required}>*</span>
          </span>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            required
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Company name (optional)</span>
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>
          Country / Region <span className={styles.required}>*</span>
        </span>
        <div className={styles.selectWrapper}>
          <select
            value={data.country}
            onChange={(e) => onChange("country", e.target.value)}
            required>
            <option value="Australia">Australia</option>
            <option value="Vietnam">Vietnam</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
          </select>
          <svg
            className={styles.selectIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor">
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </label>

      <label className={styles.field}>
        <span>
          Street address <span className={styles.required}>*</span>
        </span>
        <input
          type="text"
          placeholder="House number and street name"
          value={data.streetAddress}
          onChange={(e) => onChange("streetAddress", e.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        <input
          type="text"
          placeholder="House number and street name"
          value={data.apartment}
          onChange={(e) => onChange("apartment", e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>
          Town / City <span className={styles.required}>*</span>
        </span>
        <input
          type="text"
          value={data.city}
          onChange={(e) => onChange("city", e.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        <span>
          District <span className={styles.required}>*</span>
        </span>
        <input
          type="text"
          value={data.district}
          onChange={(e) => onChange("district", e.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        <span>Postcode / ZIP (optional)</span>
        <input
          type="text"
          value={data.postcode}
          onChange={(e) => onChange("postcode", e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>
          Phone <span className={styles.required}>*</span>
        </span>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        <span>
          Email address <span className={styles.required}>*</span>
        </span>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </label>
    </div>
  );
};

export default BillingForm;
