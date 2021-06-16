import { GetStaticProps } from "next";
import { getAllProjects } from "lib/api";
import { AllProjects } from "types";
import Markdown from "components/markdown";
import Card from "components/card";
// import { Button } from "baseui/button";
// import { Image, ResponsiveImageType } from "react-datocms";

export default function Portfolio({
  allProjects,
}: {
  allProjects: AllProjects;
}): JSX.Element {
  return (
    <section>
      {allProjects.map(({ name, url, media, description, parts }) => {
        const formattedUrl = url.slice(
          url.includes("//") ? url.indexOf("//") + 2 : 0
        );

        return (
          <Card
            key={name}
            className="m"
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <Card
                style={{
                  flex: "1 1 auto",
                  width: "50%",
                  minWidth: 200,
                  paddingBottom: 16,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ flex: "1 0 auto" }}>
                  {name === formattedUrl ? (
                    <a
                      className="h3 m-sm link"
                      href={url}
                      style={{ display: "block" }}
                    >
                      {name}
                    </a>
                  ) : (
                    <div className="h3 m-sm">{name}</div>
                  )}
                  <Markdown>{description}</Markdown>
                  {parts.length > 1 ? (
                    <div className="m">
                      {parts.map(({ name, url }, i) => (
                        <div key={i}>
                          <a href={url}>{name}</a>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                {/* <Button overrides={{ BaseButton: { style: { width: "100%" } } }}>
                  See More
                </Button> */}
              </Card>
              {media?.url ? (
                <img
                  className="hide-520"
                  src={media.url}
                  style={{
                    flex: "1 1 auto",
                    width: "50%",
                    alignSelf: "flex-start",
                  }}
                />
              ) : null}
            </div>
          </Card>

          // <div key={name}>
          //   <h2>
          //   </h2>
          //   <hr />
          //   <div>
          //     <div>
          //       {(url && name !== formattedUrl)
          //         ? <p>
          //           <a href={url}>
          //             {url.slice(
          //               url.indexOf("//") === -1
          //                 ? 0
          //                 : (url.indexOf("//") + 2),
          //             )}
          //           </a>
          //         </p>
          //         : null}
          //       {description.length > 0
          //         ? <Markdown>{description}</Markdown>
          //         : null}
          //       {parts.map(({ name, url, description }) =>
          //         <div key={name}>
          //           <h3>
          //             {name}
          //             {url
          //               ? (
          //                 <span>
          //                   {" "}
          //                   [<a href={url}>link</a>]
          //                 </span>
          //               )
          //               : null}
          //           </h3>
          //           {description.length > 0
          //             ? <Markdown>{description}</Markdown>
          //             : null}
          //         </div>
          //       )}
          //     </div>
          //   </div>
          // </div>
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
