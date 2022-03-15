/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useRouter } from 'next/router';
import styles from './header.module.scss';

export default function Header() {
  const { asPath } = useRouter;
  return (
    <header className={styles.conteiner}>
      <a href="/">
        <img src="images/Logospacetraveling.svg" alt="logo" />
      </a>
    </header>
  );
}
