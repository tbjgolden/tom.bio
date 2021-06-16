export default function Excerpt({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}): JSX.Element {
  let excerpt = children;
  if (typeof excerpt === "string" && excerpt.length > 100) {
    const slice = excerpt.slice(0, 100);
    excerpt = `${slice.slice(0, slice.lastIndexOf(" "))}...`;
  }

  return <span {...props}>{excerpt}</span>;
}
