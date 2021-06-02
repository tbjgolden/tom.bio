export default function EmbedCSS({ children }) {
  const __html = typeof children === "string" ? children : "";
  return <style dangerouslySetInnerHTML={{ __html }} />
}