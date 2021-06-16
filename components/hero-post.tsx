import Date from "./formatted-date";
import CoverImage from "./cover-image";
import Excerpt from "./excerpt";
import Link from "components/link";
import Card from "components/card";
import { ResponsiveImageType } from "react-datocms";

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  slug,
}: {
  title: string;
  coverImage: {
    responsiveImage: ResponsiveImageType;
  };
  date: string;
  excerpt: string;
  slug: string;
}): JSX.Element {
  return (
    <Card style={{ padding: 0 }}>
      <section>
        <CoverImage
          title={title}
          responsiveImage={coverImage.responsiveImage}
          slug={slug}
        />
        <div className="p">
          <h3 className="h3 m-sm">
            <Link as={`/blog/${slug}`} href="/blog/[slug]">
              {title}
            </Link>
          </h3>
          <Date className="sr-only" dateString={date} />
          <div className="mat20">
            <Excerpt>{excerpt}</Excerpt>
          </div>
        </div>
      </section>
    </Card>
  );
}
