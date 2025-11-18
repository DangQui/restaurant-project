import { NavLink } from 'react-router-dom'
import styles from './Footer.module.scss'

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.brandSection}>
        <div className={styles.logo}>
          {/* Logo: white circular với fork and spoon icon - user tự thêm */}
          {/* <img src="/logo.svg" alt="Logo" /> */}
        </div>
        <h5 className={styles.brandName}>Wow Wraps</h5>
        <p className={styles.downloadText}>Download the WowWraps app today.</p>
        <div className={styles.appButtons}>
          {/* App Store button - user tự thêm */}
          {/* <a href="#" className={styles.appButton}>
            <img src="/app-store.svg" alt="Download on the App Store" />
          </a> */}
          {/* Google Play button - user tự thêm */}
          {/* <a href="#" className={styles.appButton}>
            <img src="/google-play.svg" alt="GET IT ON Google Play" />
          </a> */}
        </div>
      </div>

      <div className={styles.section}>
        <h6 className={styles.sectionTitle}>Usefull Link</h6>
        <nav className={styles.linkList}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/reservation">Booking</NavLink>
          <NavLink to="/menu">Menu</NavLink>
        </nav>
      </div>

      <div className={styles.section}>
        <h6 className={styles.sectionTitle}>Contact Info</h6>
        <div className={styles.contactList}>
          <p>Silk St, Barbican, London</p>
          <p>EC2Y 8DS, UK</p>
          <a href="mailto:info@example.com" className={styles.email}>
            info@example.com
          </a>
          <p>800-123-45-678</p>
        </div>
      </div>

      <div className={styles.section}>
        <h6 className={styles.sectionTitle}>Follow us</h6>
        <nav className={styles.socialList}>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            Linkedin
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            Twitter
          </a>
        </nav>
      </div>

      <div className={styles.section}>
        <h6 className={styles.sectionTitle}>Legal</h6>
        <div className={styles.legalList}>
          <p>Website by uihut.com</p>
          <p>©2022. All Rights Reserved</p>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer

