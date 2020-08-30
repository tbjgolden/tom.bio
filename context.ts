import React from "react";

const C = React.createContext<{
  focused: HTMLElement | null;
  hovered: HTMLElement | null;
}>({
  focused: null,
  hovered: null,
});

export default C;
