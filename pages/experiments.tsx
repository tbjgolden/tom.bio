import { GetStaticProps } from "next";
import Link from "next/link";
import Container from "@/components/container";
import Layout from "@/components/layout";
import { getLayoutData } from "@/lib/api";
import { LayoutData } from "types";
import { useEffect, useState } from "react";

export default function Experiments({ layoutData }: { layoutData: LayoutData }) {
  const [lightOpacity, setLightOpacity] = useState(0.4);

  useEffect(() => {
    let hasStopped = false;
    let loopTimeout: ReturnType<typeof setTimeout>;

    const flicker = () => {
      if (!hasStopped) {
        setLightOpacity(0.9);
        setTimeout(() => {
          if (!hasStopped) {
            setLightOpacity(0.5);
            setTimeout(() => {
              if (!hasStopped) {
                setLightOpacity(1);
                setTimeout(() => {
                  if (!hasStopped) setLightOpacity(0.4);
                }, 100);
              }
            }, 200);
          }
        }, 100);
      }
    };

    const startCycle = () => (
      setTimeout(() => {
        flicker();
        startCycle();
      }, 2000 + Math.round(Math.random() * 4000))
    );

    const timeout = setTimeout(() => {
      flicker();
      loopTimeout = startCycle();
    }, 3000);

    return () => {
      hasStopped = true;
      clearTimeout(timeout);
      clearTimeout(loopTimeout);
    };
  }, []);

  const links = [
    ["Image Packing Algorithm Demo", "imagepacking"]
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `html{transition:filter .35s ease-out;filter:invert(1);background:#000}` }} />
      <Layout layoutData={layoutData}>
        <Container>
          <section>
            <h1 className="foszH3" style={{ color: "#000065", textShadow: "1px 0 0 #000065, 0 1px 0 #000065, -1px 0 0 #000065, 0 -1px 0 #000065, 0 0 2px #000065" }}>
              E<span style={{ opacity: lightOpacity, transition: `opacity .05s ease-${lightOpacity < .6 ? "out" : "in"}` }}>x</span>periments
            </h1>

            <ul className="mat30">
              {
                links.map(([title, url]) => (
                  <li key={url}>
                    <Link href={`/experiments/${url}`}>
                      {title}
                    </Link>
                  </li>
                ))
              }
            </ul>
          </section>
        </Container>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const layoutData = await getLayoutData();
  return {
    props: { layoutData },
  };
};
