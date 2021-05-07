import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "@/components/container";
import Markdown from "@/components/markdown";
import MoreStories from "@/components/more-stories";
import PostHeader from "@/components/post-header";
import SectionSeparator from "@/components/section-separator";
import Layout from "@/components/layout";
import {
  getLayoutData,
  getAllPostsWithSlug,
  getPostAndMorePosts,
} from "@/lib/api";
import PostTitle from "@/components/post-title";
import Head from "next/head";
import { ResponsiveImageType } from "react-datocms";
import { GetStaticProps } from "next";
import { LayoutData } from "types";

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
  layoutData,
  preview,
}: {
  post: DatoPost;
  morePosts: DatoPost[];
  layoutData: LayoutData;
  preview: boolean;
}) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview} layoutData={layoutData}>
      <Container>
        {router.isFallback
          ? (
            <PostTitle>Loading…</PostTitle>
          )
          : (
            <>
              <article>
                <Head>
                  <title>{post.title}</title>
                  <meta property="og:image" content={post.ogImage.url} />
                </Head>
                <div className="mat30 mab40">
                  <PostHeader
                    title={post.title}
                    coverImage={post.coverImage}
                    date={post.date}
                    author={post.author}
                  />
                  <Markdown content={post.content} />
                </div>
              </article>
              <SectionSeparator />
              {morePosts.length > 0 && <MoreStories posts={morePosts} />}
            </>
          )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  const layoutData = await getLayoutData();
  const data = await getPostAndMorePosts(
    (params as { slug: string }).slug,
    preview,
  );
  return {
    props: {
      preview,
      layoutData,
      post: data?.post,
      morePosts: data?.morePosts ?? [],
    },
  };
};

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug();
  return {
    paths: allPosts?.map((post: { slug: string }) => `/blog/${post.slug}`) ??
      [],
    fallback: true,
  };
}
