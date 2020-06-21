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
import markdownToHtml from "@/lib/markdownToHtml";

export default function Post({ post, morePosts, layoutData, preview }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview} layoutData={layoutData}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>{post.title} | Next.js Blog Example</title>
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <Markdown content={post.content} />
            </article>
            <SectionSeparator />
            {morePosts.length > 0 && <MoreStories posts={morePosts} />}
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params, preview = false }) {
  const layoutData = await getLayoutData();
  const data = await getPostAndMorePosts(params.slug, preview);
  const content = await markdownToHtml(data?.post?.content || "");

  return {
    props: {
      preview,
      layoutData,
      post: {
        ...data?.post,
        content,
      },
      morePosts: data?.morePosts ?? [],
    },
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug();
  return {
    paths: allPosts?.map((post) => `/posts/${post.slug}`) || [],
    fallback: true,
  };
}
