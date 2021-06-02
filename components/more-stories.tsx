import Date from "./formatted-date";
import CoverImage from "./cover-image";
import Excerpt from "./excerpt";
import Link from "components/link";
import { ResponsiveImageType } from "react-datocms";
import { Card } from "baseui/card";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { BlockProps } from "baseui/block";

const itemProps: BlockProps = {
  backgroundColor: "mono300",
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
}) {
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
          <Card>
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
          </Card>
        </FlexGridItem>
      ))}
    </FlexGrid>
  );
}
