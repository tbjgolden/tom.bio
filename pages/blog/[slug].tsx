import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Markdown from "components/markdown";
import MoreStories from "components/more-stories";
import PostHeader from "components/post-header";
import SectionSeparator from "components/section-separator";
import { getAllPostsWithSlug, getPostAndMorePosts } from "lib/api";
import PostTitle from "components/post-title";
import Head from "next/head";
import { ResponsiveImageType } from "react-datocms";
import { GetStaticProps } from "next";

type DatoPost = {
  title: string;
  coverImage: {
    responsiveImage: ResponsiveImageType;
  };
  date: string;
  slug: string;
  excerpt: string;
  author: {
    picture: {
      url: string;
    };
    name: string;
  };
  content: string;
  ogImage: {
    url: string;
  };
};

export default function Post({
  post,
  morePosts,
}: {
  post: DatoPost;
  morePosts: DatoPost[];
}): JSX.Element {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return router.isFallback ? (
    <PostTitle>Loading…</PostTitle>
  ) : (
    <>
      <article>
        <Head>
          <title>{post.title}</title>
          <meta property="og:image" content={post.ogImage.url} />
        </Head>
        <div>
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <Markdown>{post.content}</Markdown>
        </div>
      </article>
      <SectionSeparator />
      {morePosts.length > 0 && <MoreStories posts={morePosts} />}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  const data = await getPostAndMorePosts(
    (params as { slug: string }).slug,
    preview
  );
  return {
    props: {
      post: data?.post,
      morePosts: data?.morePosts ?? [],
    },
  };
};

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug();
  return {
    paths:
      allPosts?.map((post: { slug: string }) => `/blog/${post.slug}`) ?? [],
    fallback: true,
  };
}
