export default function Markdown({ content, className }) {
  return (
    <div
      className={`markdown ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
