import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { Sheet } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from 'styletron-react'
import { styletron } from '../styletron'

export default class _Document extends Document {
  static async getInitialProps(context: DocumentContext) {
    const renderPage = () =>
      context.renderPage({
        enhanceApp: (App) => (props) => (
          <StyletronProvider value={styletron}>
            <App {...props} />
          </StyletronProvider>
        ),
      })

    const initialProps = await Document.getInitialProps({
      ...context,
      renderPage,
    })
    let stylesheets: Sheet[] = []
    if ('getStylesheets' in styletron) {
      stylesheets = styletron.getStylesheets() ?? []
    }
    return { ...initialProps, stylesheets }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="theme-color" content="#222222" />
        </Head>
        <body
          style={{
            fontFamily: "'Manrope VF',Manrope,-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',sans-serif",
            fontWeight: 500,
            fontVariationSettings: "'wght' 500",
          }}
          className="foszMD"
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
