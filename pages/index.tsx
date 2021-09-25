import { GetStaticProps } from "next";
import { getPage } from "lib/api";
import Markdown from "components/markdown";
import Card from "components/card";

export default function Index({
  page,
}: {
  page: null | {
    title: string;
    slug: null | string;
    content: string;
  };
}): JSX.Element {
  return (
    <article>
      {page === null ? (
        "Something went wrong when loading the homepage content."
      ) : (
        <Card>
          <Markdown>{page.content}</Markdown>
        </Card>
      )}
    </article>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const page = await getPage("");

  return {
    props: {
      page,
    },
  };
};
