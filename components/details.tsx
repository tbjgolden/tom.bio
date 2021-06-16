const Details = ({
  summary,
  children
}: {
  summary: string,
  children: React.ReactChild
}): JSX.Element => (
  <details>
    <summary>{summary}</summary>
    {children}
  </details>
)

export default Details
