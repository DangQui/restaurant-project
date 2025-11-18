import Button from '@/components/Button/Button'
import styles from './NewsletterSection.module.scss'

const NewsletterSection = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className={`${styles.newsletter} page-section`}>
      <div className={styles.container}>
        <div>
          <span className="pill">Newsletter</span>
          <h3>Stay In The Loop</h3>
          <p>Nhận ưu đãi ẩm thực và sự kiện đặc biệt mỗi tuần.</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="email" placeholder="Email của bạn" required />
          <Button variant="primary" type="submit">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}

export default NewsletterSection

