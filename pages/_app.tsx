import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import "../styles/markdown.scss";
import { generate, embed } from "ainsley";
import getAinsley from "ainsley/macro";
import C from "context";

const hasUpperCaseRegex = /[A-Z]/;
const removeNonUpperCaseRegex = /[^A-Z]+/g;

//////////

function _App({ Component, pageProps }: AppProps) {
  const [focused, setFocused] = useState<HTMLElement | null>(null);
  const [hovered, setHovered] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Focus
    window.addEventListener("focusin", (event) => {
      setFocused(document.activeElement as HTMLElement | null);
    });

    // Hover
    let debounce: ReturnType<typeof setTimeout>;
    window.addEventListener("mousemove", (event) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        setHovered(event.target as HTMLElement | null);
      }, 20) as unknown as ReturnType<typeof setTimeout>;
    });

    // CSS
    const css = generate(getAinsley("../styles/index.ainsley"), {
      abbreviateProperty: (propertyName) => [
        hasUpperCaseRegex.test(propertyName)
          ? propertyName.replace(removeNonUpperCaseRegex, "")
          : propertyName
            .split("-")
            .map((word) => word.charAt(0))
            .join("")
            .toLowerCase(),
        propertyName.toLowerCase(),
      ],
    });
    // const x = css.indexOf("z-index");
    // console.log(css.slice(x - 1000, x + 1000));
    embed(css);
    document.body.style.visibility = "";
  }, []);

  return <C.Provider value={{ focused, hovered }}>
    <Component {...pageProps} />
  </C.Provider>;
}

export default _App;
