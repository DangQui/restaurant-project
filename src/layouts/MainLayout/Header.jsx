import { NavLink } from 'react-router-dom'
import styles from './Header.module.scss'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/blog', label: 'Blog' },
  { path: '/pages', label: 'Pages' },
  { path: '/contact', label: 'Contact' },
]

const Header = () => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.navLeft}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.logo}>
          {/* Logo: white circular với fork and spoon icon - user tự thêm */}
          {/* <img src="/logo.svg" alt="Logo" /> */}
        </div>

        <div className={styles.rightSection}>
          <span className={styles.status}>{currentTime} we're open</span>
          <NavLink to="/reservation" className={styles.reservationLink}>
            Table Reservation
          </NavLink>
        </div>
      </div>
    </header>
  )
}

export default Header

