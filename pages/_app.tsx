import App, { AppContext, AppProps } from "next/app";

import "../styles/reset.scss";
import "../styles/fonts.scss";
// import "../styles/debug.scss";
import "../styles/markdown.scss";

import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider } from "baseui";
import { styletron, theme } from "../styletron";
import { getLayoutData } from "lib/api";
import Layout from "components/layout";

function _App({ Component, pageProps: { layoutData, ...pageProps } }: AppProps) {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={theme}>
        <Layout layoutData={layoutData}>
          <Component {...pageProps} />
        </Layout>
      </BaseProvider>
    </StyletronProvider>
  );
}

_App.getInitialProps = async (appContext: AppContext) => {
  const [appProps, layoutData] = await Promise.all([
    App.getInitialProps(appContext),
    await getLayoutData()
  ]);

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      layoutData
    },
  }
}

export default _App;
