import SectionHeading from '@/components/SectionHeading/SectionHeading'
import Button from '@/components/Button/Button'
import { galleryImages } from '../data'
import styles from './VisitSection.module.scss'

const VisitSection = () => (
  <section className={`${styles.visit} page-section`}>
    <div className={styles.container}>
      <div className={styles.gallery}>
        {galleryImages.map((src, index) => (
          <img key={src} src={src} alt={`Gallery ${index + 1}`} />
        ))}
      </div>
      <div className={styles.info}>
        <SectionHeading
          eyebrow="Visit Our Restaurant"
          title="Visit Our Restaurant"
          description="Không gian ấm cúng, ánh sáng vàng và nghệ thuật sắp đặt giúp buổi tối của bạn thêm đáng nhớ."
          align="left"
        />

        <div className={styles.schedule}>
          <div>
            <strong>Opening Time</strong>
            <p>Mon - Fri : 10:00am - 10:00pm</p>
          </div>
          <div>
            <strong>Weekend</strong>
            <p>Sat - Sun : 08:00am - 11:00pm</p>
          </div>
        </div>

        <div className={styles.booking}>
          <div>
            <span>Seats</span>
            <strong>21</strong>
          </div>
          <div>
            <span>Guests</span>
            <strong>02</strong>
          </div>
          <Button variant="primary">Reserve / Book Now</Button>
        </div>
      </div>
    </div>
  </section>
)

export default VisitSection


