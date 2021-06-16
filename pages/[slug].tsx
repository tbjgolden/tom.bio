import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Markdown from "components/markdown";
import { getPage, getAllPagesWithSlug } from "lib/api";
import Head from "next/head";
import { GetStaticProps, GetStaticPaths } from "next";

export default function Page({
  page,
}: {
  page: null | {
    title: string;
    slug: null | string;
    hidden: boolean;
    content: string;
  };
  preview: boolean;
}): JSX.Element {
  const router = useRouter();

  if (!router.isFallback && page === null) {
    return <ErrorPage statusCode={404} />;
  }

  return router.isFallback || page === null ? null : (
    <article>
      <div>
        <Head>
          <title>{page.title}</title>
        </Head>
        <Markdown>{page.content}</Markdown>
      </div>
    </article>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  const data = await getPage((params as { slug: string }).slug, preview);

  return {
    props: {
      preview,
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
