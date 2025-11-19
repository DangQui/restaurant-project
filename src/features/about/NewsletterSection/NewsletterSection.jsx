import Button from '@/components/Button/Button'
import { newsletterContent } from '../aboutData'
import styles from './NewsletterSection.module.scss'

const AboutNewsletterSection = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className={`${styles.newsletter} page-section`}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <img src={newsletterContent.image} alt="Newsletter" />
        </div>
        <div className={styles.content}>
          <span className="pill">Newsletter</span>
          <h3>{newsletterContent.title}</h3>
          <p>{newsletterContent.description}</p>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email address" required />
            <Button variant="primary" type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AboutNewsletterSection






