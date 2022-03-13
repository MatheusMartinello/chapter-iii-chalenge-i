/* eslint-disable react/button-has-type */
import { GetStaticProps } from 'next';
import { Head } from 'next/document';

import { TiCalendarOutline } from 'react-icons/ti';
import { MdOutlinePersonOutline } from 'react-icons/md';
import Link from 'next/link';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  const date = format(new Date(), ' dd LLL yyyy', {
    locale: ptBR,
  });
  const handlePress = () => {
    console.log('Click');
  };
  return (
    <>
      <div className={styles.conteiner}>
        <div>
          <Link key={1} href={`/posts/1`}>
            <a key={1}>
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.content}>
                <p>
                  <TiCalendarOutline className={styles.icon} /> {date}
                </p>
                <p style={{ marginLeft: 15 }}>
                  <MdOutlinePersonOutline className={styles.icon} /> Nome Autor
                </p>
              </div>
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.conteiner}>
        <div>
          <Link key={2} href={`/posts/1`}>
            <a key={2}>
              <strong>Criando um app CRA do Zero</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <div className={styles.content}>
                <p>
                  <TiCalendarOutline className={styles.icon} /> {date}
                </p>
                <p style={{ marginLeft: 15 }}>
                  <MdOutlinePersonOutline className={styles.icon} /> Nome Autor
                </p>
              </div>
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.buttonContent}>
        <button onClick={handlePress}>Carregar Mais</button>
      </div>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
