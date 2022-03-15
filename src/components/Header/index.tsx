import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './header.module.scss';

export default function Header() {
  const { asPath } = useRouter;
  return (
    <header className={styles.postHeader}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="logo" className={styles.logo} />
        </a>
      </Link>
    </header>
  );
}
