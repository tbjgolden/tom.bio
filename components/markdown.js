export default function Markdown({ content }) {
  return (
    <div className="markdown" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
