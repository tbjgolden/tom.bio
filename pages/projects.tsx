import { GetStaticProps } from "next";
import Container from "@/components/container";
import Layout from "@/components/layout";
import { getLayoutData, getAllProjects } from "@/lib/api";
import { useMemo } from "react";

export default function Index({
  layoutData,
  allProjects,
}: {
  layoutData: {
    menu: {
      items: {
        name: string;
        href: string;
      }[];
    };
  };
  allProjects: {
    name: string;
    platform: string;
    url: null | string;
    media: null | {
      url: string;
    };
  }[];
}) {
  const projects = useMemo(() => {
    const map = new Map<
      string,
      Map<
        string,
        {
          linkUrl: null | string;
          imageUrl: null | string;
        }
      >
    >();

    for (const project of allProjects) {
      let nameMap = map.get(project.name);
      if (nameMap === undefined) {
        nameMap = new Map<
          string,
          {
            linkUrl: null | string;
            imageUrl: null | string;
          }
        >();
        map.set(project.name, nameMap);
      }

      nameMap.set(project.platform, {
        linkUrl: project.url,
        imageUrl: project?.media?.url ?? null,
      });
    }

    return Array.from(map.entries()).map(([name, entry]) => [
      name,
      Array.from(entry.entries()).sort(([a], [b]) => (a[0] > b[0] ? -1 : 1)),
    ]) as [
      string,
      [
        "web" | "kaios" | "ios" | "android",
        {
          linkUrl: string | null;
          imageUrl: string | null;
        }
      ][]
    ][];
  }, [allProjects]);

  return (
    <Layout layoutData={layoutData}>
      <Container>
        <section>
          {projects.map(([name, platforms]) => (
            <div
              key={name}
              className="mab30 pa30 bot1G80 bor1G80 bob1G80 bol1G80"
            >
              <h2 className="foszLG fowB">{name}</h2>
              <hr />
              {platforms.map(([platform, { linkUrl, imageUrl }]) =>
                imageUrl ? (
                  <div className="mat30 pat30 bot1G80 dFX flwW" key={platform}>
                    <div className="fl10a ovwA">
                      {platform}
                      {linkUrl ? (
                        <span>
                          {" "}
                          [<a href={linkUrl}>link</a>]
                        </span>
                      ) : null}
                    </div>
                    <div className="fl00a w70 bot1G80 bor1G80 bob1G80 bol1G80">
                      <img src={imageUrl} className="dB" />
                    </div>
                  </div>
                ) : null
              )}
            </div>
          ))}
        </section>
      </Container>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [layoutData, allProjects] = await Promise.all([
    getLayoutData(),
    getAllProjects(),
  ]);
  return {
    props: {
      layoutData,
      allProjects,
    },
  };
};
