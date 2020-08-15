import Alert from "./alert";
import Nav from "./nav";
import Footer from "./footer";
import Meta from "./meta";

export default function Layout({ preview, layoutData, children }) {
  return (
    <>
      <Meta />
      <Nav menuItems={layoutData?.menu?.items ?? []} />
      {preview && <Alert />}
      <main className="pal30 par30 pat40 pab40">{children}</main>
      <Footer />
    </>
  );
}
