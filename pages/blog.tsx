import { GetStaticProps } from "next";
import MoreStories from "components/more-stories";
import HeroPost from "components/hero-post";
import { getAllPostsForHome } from "lib/api";
import { ResponsiveImageType } from "react-datocms";

export default function Blog({
  allPosts,
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
}) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  return (
    <>
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
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = (await getAllPostsForHome(preview)) || [];
  return {
    props: { allPosts },
  };
};
