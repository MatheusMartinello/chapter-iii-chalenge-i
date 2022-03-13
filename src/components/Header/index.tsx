/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import styles from './header.module.scss';

import logo from '../../../public/Logospacetraveling.svg';

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <a href="/">
        <img src={logo} alt="logo" />
      </a>
    </header>
  );
}
