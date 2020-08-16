import { GetStaticProps } from "next";
import Container from "@/components/container";
import Layout from "@/components/layout";
import { getLayoutData, getPage } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Markdown from "@/components/markdown";

export default function Index({
  page,
  layoutData,
}: {
  page: null | {
    title: string;
    slug: null | string;
    content: string;
  };
  layoutData: {
    menu: {
      items: {
        name: string;
        href: string;
      }[];
    };
  };
}) {
  return (
    <Layout layoutData={layoutData}>
      <Container>
        <article>
          {page === null ? (
            "Something went wrong when loading the homepage content."
          ) : (
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
  const content = await markdownToHtml(data?.page?.content ?? "");

  return {
    props: {
      layoutData,
      page: {
        ...data?.page,
        content,
      },
    },
  };
};
