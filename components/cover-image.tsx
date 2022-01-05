import { Image, ResponsiveImageType } from "react-datocms";
import Link from "components/link";

export default function CoverImage({
  title,
  imageUrl,
  responsiveImage,
  slug,
  ...props
}: {
  title: string;
  imageUrl: string;
  responsiveImage: ResponsiveImageType;
  slug?: string;
  [key: string]: any;
}): JSX.Element {
  type ResponsiveImageType = {
    /** The HTML5 `sizes` attribute for the image */
    sizes?: string;
    /** The fallback `src` attribute for the image */
    src?: string;
    /** The HTML5 `srcSet` attribute for the image */
    srcSet?: string;
    /** The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format */
    webpSrcSet?: string;
  };

  const image = (
    <Image
      data={{
        ...responsiveImage,
        alt: `Cover Image for ${title}`,
        ...(
          // gif override as imgix conversion of gif to webp is slow
          imageUrl.slice(-4).toLowerCase() === ".gif"
            ? {
              sizes: "1000px",
              src: imageUrl,
              srcSet: `${imageUrl} 1000w`,
              webpSrcSet: "",
              base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89x8AAuEB74Y0o2cAAAAASUVORK5CYII="
            }
            : {}
        )
      }}
      {...props}
    />
  );

  return (
    <div className="pR dFL">
      {slug ? (
        <Link
          as={`/blog/${slug}`}
          href="/blog/[slug]"
          aria-label={title}
          className="lhB"
        >
          {image}
        </Link>
      ) : (
        image
      )}
      <div className="pA t0 l0 wP hP bsON peN" />
    </div>
  );
}
