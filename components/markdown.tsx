import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const H1 = ({ children, ...props }) => (
  <h1 className="h1 m-sm" {...props}>
    {children}
  </h1>
);
const H2 = ({ children, ...props }) => (
  <h2 className="h2 m-sm" {...props}>
    {children}
  </h2>
);
const H3 = ({ children, ...props }) => (
  <h3 className="h3 m-sm" {...props}>
    {children}
  </h3>
);
const H4 = ({ children, ...props }) => (
  <h4 className="h4 m-sm" {...props}>
    {children}
  </h4>
);
const H5 = ({ children, ...props }) => (
  <h5 className="h5 m-sm" {...props}>
    {children}
  </h5>
);
const H6 = ({ children, ...props }) => (
  <h6 className="h6 m-sm" {...props}>
    {children}
  </h6>
);

const P = ({ children, ...props }) => (
  <p className="m" {...props}>
    {children}
  </p>
);
const Strong = ({ children, ...props }) => (
  <strong className="b" {...props}>
    {children}
  </strong>
);
const Em = ({ children, ...props }) => (
  <em
    style={{
      fontStyle: "italic",
      fontVariationSettings: "'wght' 700",
    }}
    {...props}
  >
    {children}
  </em>
);
const Blockquote = ({ children, ...props }) => (
  <blockquote className="quote border p m" {...props}>
    {children}
  </blockquote>
);
const Hr = ({ ...props }) => <hr className="m hr" {...props} />;
const A = ({ children, ...props }) => (
  <a className="b link" {...props}>
    {children}
  </a>
);
const Ul = ({ children, ...props }) => (
  <ul className="m ul" {...props}>
    {children}
  </ul>
);
const Ol = ({ children, ...props }) => (
  <ol className="m ol" {...props}>
    {children}
  </ol>
);
const Li = ({ children, ...props }) => (
  <li className="m-sm" {...props}>
    {children}
  </li>
);
const Table = ({ children, ...props }) => (
  <div className="h-scroll m border">
    <div className="h-scroll-inner p-all">
      <table className="table" {...props}>
        {children}
      </table>
    </div>
  </div>
);
const Pre = ({ children, ...props }) => (
  <pre className="border p-all m" {...props}>
    {children}
  </pre>
);
const Code = ({ node: _, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");

  if (inline) {
    return (
      <code className={`code ${className}`} {...props}>
        {children}
      </code>
    );
  }

  return match ? (
    <SyntaxHighlighter
      style={dark}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={`code ${className}`} {...props}>
      {children}
    </code>
  );
};

const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  strong: Strong,
  em: Em,
  blockquote: Blockquote,
  hr: Hr,
  a: A,
  ul: Ul,
  ol: Ol,
  li: Li,
  pre: Pre,
  code: Code,
  table: Table
};

const Markdown = React.memo(
  ({ children }: { children: React.ReactChild }): JSX.Element => (
    <ReactMarkdown
      components={components}
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[gfm]}
    >
      {String(children)}
    </ReactMarkdown>
  )
);

export default Markdown;
