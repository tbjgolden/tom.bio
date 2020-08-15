import { Image, ResponsiveImageType } from "react-datocms";
import Link from "@/components/link";

export default function CoverImage({
  title,
  responsiveImage,
  slug,
  ...props
}: {
  title: string;
  responsiveImage: ResponsiveImageType;
  slug?: string;
  [key: string]: any;
}) {
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
