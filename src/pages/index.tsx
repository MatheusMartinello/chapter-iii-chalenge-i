/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/button-has-type */
import { GetStaticProps } from 'next';
import { Head } from 'next/document';

import { TiArrowMaximiseOutline, TiCalendarOutline } from 'react-icons/ti';
import { MdElectricRickshaw, MdOutlinePersonOutline } from 'react-icons/md';
import Link from 'next/link';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';
import { useEffect, useState } from 'react';

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

export default function Home({ postsPagination }: HomeProps) {
  const [showButton, setShowButton] = useState(true);
  const [posts, setposts] = useState<Post[]>(postsPagination.results);
  const handlePress = async () => {
    let newResult: any;
    await fetch(postsPagination.next_page)
      .then(res => res.json())
      .then(results => {
        newResult = results;
      });
    postsPagination.next_page = newResult.next_page;
    const dataResult = newResult.results.map(post => {
      return {
        uid: post.uid,
        data: {
          title: RichText.asText(post.data.title),
          subtitle: RichText.asText(post.data.subtitle),
          author: RichText.asText(post.data.author),
        },
        first_publication_date: format(
          new Date(post.last_publication_date),
          ' dd LLL yyyy',
          {
            locale: ptBR,
          }
        ),
      };
    });
    postsPagination.next_page === null
      ? setShowButton(false)
      : setShowButton(true);
    postsPagination.results = [...posts, dataResult[0]];
    setposts([...posts, dataResult[0]]);
  };
  return (
    <div className={commonStyles.cont}>
      {posts.map(post => (
        <div className={styles.container}>
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a key={post.uid}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div className={styles.content}>
                <p>
                  <TiCalendarOutline className={styles.icon} />{' '}
                  {post.first_publication_date}
                </p>
                <p style={{ marginLeft: 15 }}>
                  <MdOutlinePersonOutline className={styles.icon} />{' '}
                  {post.data.author}
                </p>
              </div>
            </a>
          </Link>
        </div>
      ))}
      {showButton && (
        <div className={styles.buttonContent}>
          <button onClick={handlePress}>Carregar Mais posts</button>
        </div>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = await getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      //fetch: '[post.title,post.subtitle,post.author]',
    }
  );
  const results = response.results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: RichText.asText(post.data.author),
      },
      first_publication_date: format(
        new Date(post.first_publication_date),
        ' dd LLL yyyy',
        {
          locale: ptBR,
        }
      ),
    };
  });
  const { next_page } = response;
  const postsPagination = {
    results,
    next_page,
  };

  return { props: { postsPagination } };
};
