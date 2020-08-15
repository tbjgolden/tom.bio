import Container from "@/components/container";
import Layout from "@/components/layout";
import { getLayoutData } from "@/lib/api";

export default function Index({ layoutData }) {
  return (
    <Layout layoutData={layoutData}>
      <Container>
        <section>
          <p>This page is under construction.</p>
        </section>
      </Container>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const layoutData = await getLayoutData();
  return {
    props: {
      layoutData,
    },
  };
};