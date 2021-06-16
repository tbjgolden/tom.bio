export default function EmbedCSS({
  children,
}: {
  children: React.ReactChild;
}): JSX.Element {
  const __html = typeof children === "string" ? children : "";
  return <style dangerouslySetInnerHTML={{ __html }} />;
}
