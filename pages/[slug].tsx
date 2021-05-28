import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "@/components/container";
import Layout from "@/components/layout";
import Markdown from "@/components/markdown";
import { getLayoutData, getPage, getAllPagesWithSlug } from "@/lib/api";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";
import { Fragment, useEffect } from "react";
import { LayoutData } from "types";
import { Card } from "baseui/card";
import { route } from "next/dist/next-server/server/router";

export default function Page({
  page,
  layoutData,
  preview,
}: {
  page: null | {
    title: string;
    slug: null | string;
    hidden: boolean;
    content: string;
  };
  layoutData: LayoutData;
  preview: boolean;
}) {
  const router = useRouter();

  const isPageHidden = page?.hidden ?? false;

  useEffect(() => {
    if (isPageHidden) {
      router.replace("/");
    }
  }, [isPageHidden]);

  if (!router.isFallback && !page?.slug) {
    return <ErrorPage statusCode={404} />;
  } else if (isPageHidden) {
    return null;
  }

  return (
    <Layout preview={preview} layoutData={layoutData}>
      <Container>
        {router.isFallback ? (
          <h1>Loading…</h1>
        ) : (
          <article>
            {page === null ? null : (
              <Card>
                <Head>
                  <title>{page.title}</title>
                </Head>
                <Markdown content={page.content} />
              </Card>
            )}
          </article>
        )}
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  const layoutData = await getLayoutData();
  const data = await getPage((params as { slug: string }).slug, preview);

  return {
    props: {
      preview,
      layoutData,
      page: data?.page,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getAllPagesWithSlug();

  return {
    paths: allPages?.map((page: { slug: string }) => `/${page.slug}`) ?? [],
    fallback: true,
  };
};
