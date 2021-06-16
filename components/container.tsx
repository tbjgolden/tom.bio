export default function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}): JSX.Element {
  return <div className={`malA marA xw80 ${className ?? ""}`}>{children}</div>;
}
