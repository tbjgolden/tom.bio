import { useEffect } from "react";

import "../styles/markdown.scss";
import { generate, embed } from "ainsley";
import getAinsley from "ainsley/macro";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    embed(generate(getAinsley("../styles/index.ainsley")));
    document.body.style.visibility = "";
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
