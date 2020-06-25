import { useEffect } from "react";

import "../styles/markdown.scss";
import { generate, embed } from "ainsley";
import getAinsley from "ainsley/macro";

//////

const hasUpperCaseRegex = /[A-Z]/;
const removeNonUpperCaseRegex = /[^A-Z]+/g;

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    embed(
      generate(getAinsley("../styles/index.ainsley"), {
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
      })
    );
    document.body.style.visibility = "";
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
