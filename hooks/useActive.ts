import { useContext } from "react";
import C from "context";

const useActive = (el: HTMLElement | null) => {
  const { focused, hovered } = useContext(C);
  return el ? el.contains(focused) || el.contains(hovered) : false;
};

export default useActive;
