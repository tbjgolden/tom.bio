import Date from "./formatted-date";
import CoverImage from "./cover-image";
import { ResponsiveImageType } from "react-datocms";

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
}: {
  title: string;
  coverImage: { url: string; responsiveImage: ResponsiveImageType };
  date: string;
  author: {
    picture: {
      url: string;
    };
    name: string;
  };
}): JSX.Element {
  return (
    <>
      <div className="m">
        <CoverImage
          title={title}
          url={coverImage.url}
          responsiveImage={coverImage.responsiveImage}
        />
      </div>
      <h1 className="h2 m-sm">{title}</h1>
      <div
        className="m"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: ".8em", textAlign: "right" }}>
          <div>{author.name}</div>
          <Date dateString={date} />
        </div>
        <div>
          <img
            src={author.picture.url}
            alt={author.name}
            style={{
              borderRadius: 9999,
              margin: "0 0 0 .8em",
              height: "2.5em",
            }}
          />
        </div>
      </div>
      <hr className="hr m" />
    </>
  );
}
