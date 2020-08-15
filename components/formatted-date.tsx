export default function FormattedDate({ dateString, ...props }) {
  const date = new Date(dateString);
  return (
    <time dateTime={dateString} {...props}>
      {date.toLocaleDateString(undefined)}
    </time>
  );
}
