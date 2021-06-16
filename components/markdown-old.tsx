
export default function Markdown({
  html,
  className,
}: {
  html: string;
  className?: string;
}): JSX.Element {
  return (
    <div
      className={`markdown ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
