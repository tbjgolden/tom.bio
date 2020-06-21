import Avatar from "./avatar";
import Date from "./date";
import CoverImage from "./cover-image";

export default function PostHeader({ title, coverImage, date, author }) {
  return (
    <>
      <h1>{title}</h1>
      <div>
        <CoverImage
          title={title}
          responsiveImage={coverImage.responsiveImage}
        />
      </div>
      <div>
        <div>
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div>
          <Date dateString={date} />
        </div>
      </div>
    </>
  );
}
