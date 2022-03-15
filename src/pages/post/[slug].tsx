import { GetStaticPaths, GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';
import { ptBR } from 'date-fns/locale';
import { TiCalendarOutline } from 'react-icons/ti';
import { MdOutlinePersonOutline } from 'react-icons/md';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <img src={post.data.banner.url} alt="banner" style={{ width: '100%' }} />
      <main className={styles.conteiner}>
        <strong>{post.data.title}</strong>
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
        {/* {post.data.content.map(element => {})} */}
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  //const posts = await prismic.query(TODO);
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID(['post'], String(slug), {});
  console.log(response.data.banner);
  const post = {
    uid: response.uid,
    data: {
      title: RichText.asText(response.data.title),
      subtitle: RichText.asText(response.data.subtitle),
      author: RichText.asText(response.data.author),
      banner: {
        url: response.data.banner.url,
      },
    },
    first_publication_date: format(
      new Date(response.first_publication_date),
      ' dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
    content: RichText.asHtml(response.data.content),
  };
  console.log(post);
  return { props: { post } };
  // TODO
};
