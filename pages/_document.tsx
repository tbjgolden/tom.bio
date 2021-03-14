import Document, { Html, Head, Main, NextScript } from "next/document";

export default class _Document extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
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
            fontVariationSettings: "'wght' 500",
            visibility: "hidden",
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
