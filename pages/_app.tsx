import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import "../styles/markdown.scss";

import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider } from "baseui";
import { styletron, theme } from "../styletron";

function _App({ Component, pageProps }: AppProps) {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={theme}>
        <Component {...pageProps} />
      </BaseProvider>
    </StyletronProvider>
  );
}

export default _App;
