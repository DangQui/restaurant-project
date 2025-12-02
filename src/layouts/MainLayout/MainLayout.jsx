import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./MainLayout.module.scss";
import ChatWidget from "@/components/ChatWidget/ChatWidget";

const MainLayout = () => (
  <div className={styles.shell}>
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
    <ChatWidget />
  </div>
);

export default MainLayout;
