import React from "react";

const Json = ({ xp }) => (
  <pre>
    <code>{JSON.stringify(xp, null, 2)}</code>
  </pre>
);

export default Json;
