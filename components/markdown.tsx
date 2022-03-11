import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Link from "next/link";

const PRISM_THEME = {
  'pre[class*="language-"]': {
    color: "#d4d4d4",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    MozTabSize: "2",
    OTabSize: "2",
    tabSize: "2",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
    padding: "16px",
    background: "#1e1e1e",
  },
  'code[class*="language-"]': {
    color: "#d4d4d4",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    MozTabSize: "2",
    OTabSize: "2",
    tabSize: "2",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
  },
  'pre[class*="language-"]::selection': {
    textShadow: "none",
    background: "#75a7ca",
  },
  'code[class*="language-"]::selection': {
    textShadow: "none",
    background: "#75a7ca",
  },
  'pre[class*="language-"] *::selection': {
    textShadow: "none",
    background: "#75a7ca",
  },
  'code[class*="language-"] *::selection': {
    textShadow: "none",
    background: "#75a7ca",
  },
  ':not(pre) > code[class*="language-"]': {
    padding: ".1em .3em",
    borderRadius: ".3em",
    color: "#db4c69",
    background: "#f9f2f4",
  },
  ".namespace": {
    Opacity: ".7",
  },
  "doctype.doctype-tag": {
    color: "#569CD6",
  },
  "doctype.name": {
    color: "#9cdcfe",
  },
  comment: {
    color: "#6a9955",
  },
  prolog: {
    color: "#6a9955",
  },
  punctuation: {
    color: "#d4d4d4",
  },
  ".language-html .language-css .token.punctuation": {
    color: "#d4d4d4",
  },
  ".language-html .language-javascript .token.punctuation": {
    color: "#d4d4d4",
  },
  property: {
    color: "#9cdcfe",
  },
  tag: {
    color: "#569cd6",
  },
  boolean: {
    color: "#569cd6",
  },
  number: {
    color: "#b5cea8",
  },
  constant: {
    color: "#9cdcfe",
  },
  symbol: {
    color: "#b5cea8",
  },
  inserted: {
    color: "#b5cea8",
  },
  unit: {
    color: "#b5cea8",
  },
  selector: {
    color: "#d7ba7d",
  },
  "attr-name": {
    color: "#9cdcfe",
  },
  string: {
    color: "#ce9178",
  },
  char: {
    color: "#ce9178",
  },
  builtin: {
    color: "#ce9178",
  },
  deleted: {
    color: "#ce9178",
  },
  ".language-css .token.string.url": {
    textDecoration: "underline",
  },
  operator: {
    color: "#d4d4d4",
  },
  entity: {
    color: "#569cd6",
  },
  "operator.arrow": {
    color: "#569CD6",
  },
  atrule: {
    color: "#ce9178",
  },
  "atrule.rule": {
    color: "#c586c0",
  },
  "atrule.url": {
    color: "#9cdcfe",
  },
  "atrule.url.function": {
    color: "#dcdcaa",
  },
  "atrule.url.punctuation": {
    color: "#d4d4d4",
  },
  keyword: {
    color: "#569CD6",
  },
  "keyword.module": {
    color: "#c586c0",
  },
  "keyword.control-flow": {
    color: "#c586c0",
  },
  function: {
    color: "#dcdcaa",
  },
  "function.maybe-class-name": {
    color: "#dcdcaa",
  },
  regex: {
    color: "#d16969",
  },
  important: {
    color: "#569cd6",
  },
  italic: {
    fontStyle: "italic",
  },
  "class-name": {
    color: "#4ec9b0",
  },
  "maybe-class-name": {
    color: "#4ec9b0",
  },
  console: {
    color: "#9cdcfe",
  },
  parameter: {
    color: "#9cdcfe",
  },
  interpolation: {
    color: "#9cdcfe",
  },
  "punctuation.interpolation-punctuation": {
    color: "#569cd6",
  },
  variable: {
    color: "#9cdcfe",
  },
  "imports.maybe-class-name": {
    color: "#9cdcfe",
  },
  "exports.maybe-class-name": {
    color: "#9cdcfe",
  },
  escape: {
    color: "#d7ba7d",
  },
  "tag.punctuation": {
    color: "#808080",
  },
  cdata: {
    color: "#808080",
  },
  "attr-value": {
    color: "#ce9178",
  },
  "attr-value.punctuation": {
    color: "#ce9178",
  },
  "attr-value.punctuation.attr-equals": {
    color: "#d4d4d4",
  },
  namespace: {
    color: "#4ec9b0",
  },
  'pre[class*="language-javascript"]': {
    color: "#9cdcfe",
  },
  'code[class*="language-javascript"]': {
    color: "#9cdcfe",
  },
  'pre[class*="language-jsx"]': {
    color: "#9cdcfe",
  },
  'code[class*="language-jsx"]': {
    color: "#9cdcfe",
  },
  'pre[class*="language-typescript"]': {
    color: "#9cdcfe",
  },
  'code[class*="language-typescript"]': {
    color: "#9cdcfe",
  },
  'pre[class*="language-tsx"]': {
    color: "#9cdcfe",
  },
  'code[class*="language-tsx"]': {
    color: "#9cdcfe",
  },
  'pre[class*="language-css"]': {
    color: "#ce9178",
  },
  'code[class*="language-css"]': {
    color: "#ce9178",
  },
  'pre[class*="language-html"]': {
    color: "#d4d4d4",
  },
  'code[class*="language-html"]': {
    color: "#d4d4d4",
  },
  ".language-regex .token.anchor": {
    color: "#dcdcaa",
  },
  ".language-html .token.punctuation": {
    color: "#808080",
  },
  "pre[data-line]": {
    position: "relative",
  },
  'pre[class*="language-"] > code[class*="language-"]': {
    position: "relative",
    zIndex: "1",
  },
  ".line-highlight": {
    position: "absolute",
    left: "0",
    right: "0",
    padding: "inherit 0",
    marginTop: "1em",
    background: "#f7ebc6",
    boxShadow: "inset 5px 0 0 #f7d87c",
    zIndex: "0",
    pointerEvents: "none",
    lineHeight: "inherit",
    whiteSpace: "pre",
  },
};

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
const A = ({ children, href, ...props }) => {
  const isInternal = href !== undefined && href.startsWith("/");
  return isInternal ? (
    <Link href={href}>
      <a className="b link" {...props}>
        {children}
      </a>
    </Link>
  ) : (
    <a className="b link" href={href} {...props}>
      {children}
    </a>
  );
};
const Ul = ({ children, ordered: _, ...props }) => (
  <ul className="m ul" {...props}>
    {children}
  </ul>
);
const Ol = ({ children, ordered: _, ...props }) => (
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
const Pre = ({ children, ...props }) => {
  return (
    <pre className="m h-scroll-pre" {...props}>
      {children}
    </pre>
  );
};
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
      style={PRISM_THEME}
      className="code h-scroll-pre-inner p-all"
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className={`code h-scroll-pre-inner p-all ${className}`} {...props}>
      {children}
    </code>
  );
};

const Markdown = React.memo(
  ({ children }: { children: React.ReactChild }): JSX.Element => (
    <ReactMarkdown
      components={
        {
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
          table: Table,
        } as any
      }
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[gfm]}
    >
      {String(children)}
    </ReactMarkdown>
  )
);

export default Markdown;
