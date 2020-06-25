import Date from "./formatted-date";
import CoverImage from "./cover-image";
import Excerpt from "./excerpt";
import Link from "@/components/link";

export default function MoreStories({ posts }) {
  return (
    <section className="dG g30 gtc1 l-gtc2">
      {posts.map(({ title, coverImage, date, excerpt, slug }) => (
        <div className="mab30" key={slug}>
          <div>
            <CoverImage
              slug={slug}
              title={title}
              responsiveImage={coverImage.responsiveImage}
            />
          </div>
          <h3>
            <Link as={`/blog/${slug}`} href="/blog/[slug]">
              {title}
            </Link>
          </h3>
          <div>
            <Date className="foszSM" dateString={date} />
          </div>
          <Excerpt className="foszSM">{excerpt}</Excerpt>
        </div>
      ))}
    </section>
  );
}
