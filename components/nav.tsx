import { LayoutData, NavItem } from "types";
import { AppNavBar, NavItemT } from "baseui/app-nav-bar";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Nav({ layoutData }: { layoutData: LayoutData }) {
  const router = useRouter();

  return (
    <AppNavBar
      title={
        <Link href="/">
          <a style={{ textDecoration: "none" }}>tom.bio</a>
        </Link>
      }
      mainItems={apiPagesToMainItems([
        ...(layoutData?.allPages ?? []),
        {
          title: "Portfolio",
          slug: "portfolio",
          hidden: false,
          children: null,
        },
        {
          title: "Blog",
          slug: "blog",
          hidden: false,
          children: null,
        },
      ])}
      onMainItemSelect={(item) => {
        const slug = (item as { slug?: string })?.slug ?? "";
        if (slug.length > 0) {
          router.push(`/${slug}`);
        }
      }}
    />
  );
}

const apiPagesToMainItems = (apiPages: NavItem[]): NavItemT[] => {
  const mainItems: NavItemT[] = apiPages.map(
    ({ title, slug, hidden, children }) => ({
      label: title,
      slug: hidden ? null : slug,
      children: children ? apiPagesToMainItems(children) : undefined,
    })
  );
  return mainItems;
};
