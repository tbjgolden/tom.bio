import { GetStaticProps } from "next";
import Container from "@/components/container";
import Layout from "@/components/layout";
import { getLayoutData, getPage } from "@/lib/api";
import Markdown from "@/components/markdown";
import { LayoutData } from "types";

export default function Index({
  page,
  layoutData,
}: {
  page: null | {
    title: string;
    slug: null | string;
    content: string;
  };
  layoutData: LayoutData;
}) {
  return (
    <Layout layoutData={layoutData}>
      <Container>
        <article>
          {page === null
            ? (
              "Something went wrong when loading the homepage content."
            )
            : (
              <Markdown content={page.content} />
            )}
        </article>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const layoutData = await getLayoutData();
  const data = await getPage("");

  return {
    props: {
      layoutData,
      page: data?.page,
    },
  };
};
