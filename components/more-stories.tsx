import Date from "./formatted-date";
import CoverImage from "./cover-image";
import Excerpt from "./excerpt";
import Link from "@/components/link";
import { ResponsiveImageType } from "react-datocms";

export default function MoreStories({
  posts,
}: {
  posts: {
    title: string;
    coverImage: {
      responsiveImage: ResponsiveImageType;
    };
    date: string;
    excerpt: string;
    slug: string;
  }[];
}) {
  return (
    <section className="dG g30 gtc1 l-gtc2">
      {posts.map(({ title, coverImage, date, excerpt, slug }) => (
        <div className="mab30" key={slug}>
          <CoverImage
            slug={slug}
            title={title}
            responsiveImage={coverImage.responsiveImage}
          />
          <h3 className="foszMD mat20">
            <Link as={`/blog/${slug}`} href="/blog/[slug]">
              {title}
            </Link>
          </h3>
          <Date className="dN" dateString={date} />
          <div className="foszSM mat15">
            <Excerpt>{excerpt}</Excerpt>
          </div>
        </div>
      ))}
    </section>
  );
}
