const Details = ({
  summary,
  children
}) => (
  <details>
    <summary>{summary}</summary>
    {children}
  </details>
)

export default Details
