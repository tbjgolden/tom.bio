import { GetStaticProps } from "next";
import { getAllProjects } from "lib/api";
import { AllProjects } from "types";
import Markdown from "components/markdown";

export default function Portfolio({
  allProjects,
}: {
  allProjects: AllProjects;
}) {
  return (
    <section>
      {allProjects.map(({
        name,
        url,
        media,
        description,
        parts,
      }) => {
        const formattedUrl = url.slice(
          url.indexOf("//") === -1 ? 0 : (url.indexOf("//") + 2),
        );

        return (
          <div
            key={name}
            className="mab30 pa30 bot1G80 bor1G80 bob1G80 bol1G80"
          >
            <h2 className="foszLG fowB">
              {name === formattedUrl
                ? (
                  <a href={url}>
                    {name}
                  </a>
                )
                : name}
            </h2>
            <hr />
            <div className="mat30 pat30 bot1G80 dFL flwW">
              <div className="fl10A w65">
                {(url && name !== formattedUrl)
                  ? <p className="foszMD pab30 par30">
                    <a href={url} className="ovwBW">
                      {url.slice(
                        url.indexOf("//") === -1
                          ? 0
                          : (url.indexOf("//") + 2),
                      )}
                    </a>
                  </p>
                  : null}
                {description.length > 0
                  ? <Markdown className="pab30 par30">{description}</Markdown>
                  : null}
                {parts.map(({ name, url, description }) =>
                  <div className="dib ovwA nw55 pab30 par30" key={name}>
                    <h3>
                      {name}
                      {url
                        ? (
                          <span>
                            {" "}
                            [<a href={url}>link</a>]
                          </span>
                        )
                        : null}
                    </h3>
                    {description.length > 0
                      ? <Markdown>{description}</Markdown>
                      : null}
                  </div>
                )}
              </div>
              {media?.url
                ? (
                  <div
                    className="fl00A wP l-w70 bot1G80 bor1G80 bob1G80 bol1G80"
                  >
                    <img src={media.url} className="dB" />
                  </div>
                )
                : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allProjects = await getAllProjects();
  return {
    props: {
      allProjects,
    },
  };
};
