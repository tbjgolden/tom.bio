import Date from "./formatted-date";
import CoverImage from "./cover-image";
import Excerpt from "./excerpt";
import Link from "@/components/link";
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
}) {
  return (
    <section className="mab35">
      <CoverImage
        title={title}
        responsiveImage={coverImage.responsiveImage}
        slug={slug}
      />
      <h3 className="foszH4 mat25">
        <Link as={`/blog/${slug}`} href="/blog/[slug]">
          {title}
        </Link>
      </h3>
      <Date className="dN" dateString={date} />
      <div className="mat20">
        <Excerpt>{excerpt}</Excerpt>
      </div>
    </section>
  );
}
