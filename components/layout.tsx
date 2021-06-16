import Alert from "./alert";
import Nav from "./nav";
import Footer from "./footer";
import Meta from "./meta";
import { LayoutData } from "types";

export default function Layout({
  preview,
  layoutData,
  children,
}: {
  preview?: boolean;
  layoutData: LayoutData;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <Meta />
      <Nav layoutData={layoutData} />
      {preview && <Alert />}
      <main style={{ padding: "16px" }}>
        <div style={{ maxWidth: "66ch", margin: "0 auto" }}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
