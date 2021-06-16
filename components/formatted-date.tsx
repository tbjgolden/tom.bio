export default function FormattedDate({
  dateString,
  ...props
}: {
  dateString: string;
  [key: string]: any;
}): JSX.Element {
  const date = new Date(dateString);
  return (
    <time dateTime={dateString} style={{
      fontVariantNumeric: "tabular-nums"
    }} {...props}>
      {date.toLocaleDateString(undefined)}
    </time>
  );
}
