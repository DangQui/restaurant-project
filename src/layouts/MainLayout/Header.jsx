import { NavLink } from 'react-router-dom'
import LogoButton from '@/components/Logo/LogoButton'
import SearchBar from '@/components/SearchBar/SearchBar'
import { useLogoNavigation } from '@/hooks/useLogoNavigation'
import styles from './Header.module.scss'

const navItems = [
  { path: '/', label: 'Trang chủ' },
  { path: '/menu', label: 'Thực đơn' },
  { path: '/blog', label: 'Blog' },
  { path: '/pages', label: 'Trang' },
  { path: '/contact', label: 'Liên hệ' },
]

const Header = () => {
  const currentTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const handleLogoClick = useLogoNavigation()

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
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
        <SearchBar className={styles.searchBar} />
        </div>

        <div className={styles.logoWrapper}>
          <LogoButton onClick={handleLogoClick} />
        </div>

        <div className={styles.rightSection}>
          <span className={styles.status}>{currentTime} chúng tôi đang mở cửa</span>
          <NavLink to="/reservation" className={styles.reservationLink}>
            Đặt bàn
          </NavLink>
        </div>
      </div>
    </header>
  )
}

export default Header

