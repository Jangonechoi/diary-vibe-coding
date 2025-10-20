'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './styles.module.css';
import { useLayoutRouting } from './hooks/index.link.routing.hook';
import { useLayoutArea } from './hooks/index.area.hook';
import URLS from '@/commons/constants/url';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isActive } = useLayoutRouting();
  const visibility = useLayoutArea();

  return (
    <div className={styles.container}>
      {visibility.header && (
        <header className={styles.header} data-testid="layout-header">
          {visibility.logo && (
            <Link href={URLS.DIARIES.path} className={styles.logo} data-testid="layout-logo">
              민지의 다이어리
            </Link>
          )}
        </header>
      )}
      {visibility.banner && <div className={styles.gap24}></div>}
      {visibility.banner && (
        <div className={styles.banner} data-testid="layout-banner">
          <Image src="/images/banner.png" alt="배너" fill style={{ objectFit: 'cover' }} />
        </div>
      )}
      {visibility.navigation && <div className={styles.gap24}></div>}
      {visibility.navigation && (
        <nav className={styles.navigation} data-testid="layout-navigation">
          <Link
            href={URLS.DIARIES.path}
            className={`${styles.tab} ${isActive(URLS.DIARIES.path) ? styles.tabActive : ''}`}
            data-testid="nav-tab-diaries"
          >
            일기보관함
          </Link>
          <Link
            href={URLS.PICTURES.path}
            className={`${styles.tab} ${isActive(URLS.PICTURES.path) ? styles.tabActive : ''}`}
            data-testid="nav-tab-pictures"
          >
            사진보관함
          </Link>
        </nav>
      )}
      <div className={styles.gap32}></div>
      <main className={styles.children}>{children}</main>
      {visibility.footer && (
        <footer className={styles.footer} data-testid="layout-footer">
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>민지의 다이어리</div>
            <div className={styles.footerInfo}>대표 : {'{name}'}</div>
            <div className={styles.footerCopyright}>Copyright © 2024. {'{name}'} Co., Ltd.</div>
          </div>
        </footer>
      )}
    </div>
  );
}
