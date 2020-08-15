import { Image } from "react-datocms";
import Link from "@/components/link";

export default function CoverImage({ title, responsiveImage, slug, ...props }) {
  const image = (
    <Image
      data={{
        ...responsiveImage,
        alt: `Cover Image for ${title}`,
      }}
      {...props}
    />
  );
  return (
    <div>
      {slug ? (
        <Link as={`/blog/${slug}`} href="/blog/[slug]" aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
}
