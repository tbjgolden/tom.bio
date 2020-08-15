export default function Excerpt({ children, ...props }) {
  let excerpt = children;
  if (typeof excerpt === "string" && excerpt.length > 100) {
    let slice = excerpt.slice(0, 100);
    excerpt = `${slice.slice(0, slice.lastIndexOf(" "))}...`;
  }

  return <span {...props}>{excerpt}</span>;
}
