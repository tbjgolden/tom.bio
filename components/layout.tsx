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
      <main className="p-res">
        <div className="mw" style={{ margin: "0 auto", padding: "1em 0" }}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
