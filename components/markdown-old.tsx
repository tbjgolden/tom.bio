
export default function Markdown({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`markdown ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
