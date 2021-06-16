import Date from "./formatted-date";
import CoverImage from "./cover-image";
import Excerpt from "./excerpt";
import Link from "components/link";
import Card from "components/card";
import { ResponsiveImageType } from "react-datocms";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { BlockProps } from "baseui/block";

const itemProps: BlockProps = {
  display: "flex",
  justifyContent: "center",
};

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
}): JSX.Element {
  return (
    <FlexGrid
      as="section"
      marginTop="scale500"
      flexGridColumnCount={[1, 1, 2, 2]}
      flexGridColumnGap="scale500"
      flexGridRowGap="scale500"
    >
      {posts.map(({ title, coverImage, date, excerpt, slug }) => (
        <FlexGridItem key={slug} {...itemProps}>
          <Card style={{ padding: 0 }}>
            <CoverImage
              slug={slug}
              title={title}
              responsiveImage={coverImage.responsiveImage}
            />
            <div className="p" style={{ borderTop: "2px solid #ccc" }}>
              <h3 className="h5 m-sm">
                <Link as={`/blog/${slug}`} href="/blog/[slug]">
                  {title}
                </Link>
              </h3>
              <Date className="sr-only" dateString={date} />
              <div className="small m">
                <Excerpt>{excerpt}</Excerpt>
              </div>
            </div>
          </Card>
        </FlexGridItem>
      ))}
    </FlexGrid>
  );
}
