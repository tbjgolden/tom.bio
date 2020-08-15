export default function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`malA marA xw80 ${className ?? ""}`}>{children}</div>;
}
