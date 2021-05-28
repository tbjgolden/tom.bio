import { GetStaticProps } from "next";
import Container from "@/components/container";
import MoreStories from "@/components/more-stories";
import HeroPost from "@/components/hero-post";
import Layout from "@/components/layout";
import { getLayoutData, getAllPostsForHome } from "@/lib/api";
import { ResponsiveImageType } from "react-datocms";
import { LayoutData } from "types";
import { Card } from "baseui/card";

export default function Blog({
  allPosts,
  layoutData,
}: {
  allPosts: {
    title: string;
    coverImage: {
      responsiveImage: ResponsiveImageType;
    };
    date: string;
    slug: string;
    excerpt: string;
  }[];
  layoutData: LayoutData;
}) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  return (
    <Layout layoutData={layoutData}>
      <Container>
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const layoutData = await getLayoutData();
  const allPosts = (await getAllPostsForHome(preview)) || [];
  return {
    props: { allPosts, layoutData },
  };
};
