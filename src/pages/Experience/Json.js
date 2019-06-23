import React from "react";

const Json = ({ xp }) => {
  return (
    <pre>
      <code>
        {"{\n  "}
        {[...Object.entries(xp)].map(([k, v], i, arr) =>
          ["email", "phone"].includes(k) ? (
            <React.Fragment>
              {`"${k}": "`}
              {window.obfs(v)}
              {'",\n  '}
            </React.Fragment>
          ) : (
            `${JSON.stringify(k)}: ${JSON.stringify(v, null, 2)
              .split("\n")
              .join("\n  ")}${i === arr.length - 1 ? "" : ",\n  "}`
          )
        )}
        {"\n}"}
      </code>
    </pre>
  );
};

export default Json;
