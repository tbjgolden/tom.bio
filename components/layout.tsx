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
}) {
  return (
    <>
      <Meta />
      <Nav layoutData={layoutData} />
      {preview && <Alert />}
      <main className="pal30 par30 pat40 pab40">{children}</main>
      <Footer />
    </>
  );
}
