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
import { FiCalendar, FiUser } from 'react-icons/fi';

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
      <main className={commonStyles.container}>
        <strong>{post.data.title}</strong>
        <div className={styles.post}>
          <div className={styles.postTop}>
            <h1>{post.data.title}</h1>
            <ul>
              <li>
                <FiCalendar />
                {post.first_publication_date}
              </li>
              <li>
                <FiUser />
                {post.data.author}
              </li>
              {/* <li>
                <FiClock />
                {`${readTime} min`}
              </li> */}
            </ul>
          </div>

          {post.data.content.map(content => (
            <article key={content.heading}>
              <h2
                className={styles.postContent}
                dangerouslySetInnerHTML={{
                  __html: content.heading,
                }}
              />
              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{
                  __html: content.body,
                }}
              />
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID(['post'], String(slug), {});
  const post = {
    uid: response.uid,
    data: {
      title: RichText.asText(response.data.title),
      subtitle: RichText.asText(response.data.subtitle),
      author: RichText.asText(response.data.author),
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: RichText.asHtml(content.heading),
          body: RichText.asHtml(content.body),
        };
      }),
    },
    first_publication_date: format(
      new Date(response.first_publication_date),
      ' dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
  };
  return { props: { post } };
};
