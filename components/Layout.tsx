import Sidebar from '@/components/Sidebar';
import styles from '@/styles/Layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {children}
        </main>
    </div>
  );
}