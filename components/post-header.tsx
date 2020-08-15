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
  coverImage: { responsiveImage: ResponsiveImageType };
  date: string;
  author: {
    name: string;
  };
}) {
  return (
    <>
      <h1 className="foszH2 fowB mab30">{title}</h1>
      <CoverImage
        className="mab30"
        title={title}
        responsiveImage={coverImage.responsiveImage}
      />
      <div className="dFX jcFE aiC mab30">
        <div>
          <img
            src={author.picture.url}
            alt={author.name}
            className="h45 borX mar25"
          />
        </div>
        <div>
          <div>{author.name}</div>
          <Date dateString={date} />
        </div>
      </div>
    </>
  );
}