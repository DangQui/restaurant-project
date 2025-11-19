import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import styles from './MainLayout.module.scss'

const MainLayout = () => (
  <div className={styles.shell}>
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default MainLayout






