import { GetStaticProps } from "next";
import Container from "@/components/container";
import Layout from "@/components/layout";
import { getLayoutData } from "@/lib/api";

export default function Index({
  layoutData,
}: {
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
        <section>
          <p>
            Howdy! I am currently rebuilding my website.
            <br />
            (last updated: 2020-06-22)
          </p>
          <p className="mat30">This is very much a work in progress!</p>
        </section>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const layoutData = await getLayoutData();
  return {
    props: {
      layoutData,
    },
  };
};
