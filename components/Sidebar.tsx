import { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Sidebar.module.css';

export default function Sidebar() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    return (
        <div className={`${styles.sidebar} ${sidebarVisible ? styles.sidebarVisible : styles.sidebarHidden}`}>
            <div className={styles.sidebarHeader}>
                <div className={styles.sidebarTitle}>
                    <span>Pano Library</span>
                </div>
                <button className={styles.sidebarToggle} onClick={() => setSidebarVisible(!sidebarVisible)}>
                    <span>☰</span>
                </button>
            </div>
            <div className={styles.sidebarContent}>
                <ul>
                    <li className={styles.sidebarNavItem}>
                        <div className={styles.sidebarNavItemButton}>
                            <button>
                                <Link href="/explorer">Explorer</Link>
                            </button>
                        </div>

                    </li>
                    <li className={styles.sidebarNavItem}>
                        <div className={styles.sidebarNavItemButton}>
                            <button>
                                <Link href="/local-editor">Editor</Link>
                            </button>
                        </div>


                    </li>
                </ul>
            </div>

        </div>
    );
}