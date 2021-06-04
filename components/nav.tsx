import { LayoutData, NavItem } from "types";
import { AppNavBar, NavItemT, setItemActive } from "baseui/app-nav-bar";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Nav({ layoutData }: { layoutData: LayoutData }) {
  const router = useRouter();

  const [mainItems, setMainItems] = useState(apiPagesToMainItems([
    ...(layoutData?.allPages ?? []),
    {
      title: "Portfolio",
      slug: "portfolio",
      hidden: false,
      children: null,
    },
    {
      title: "Experiments",
      slug: "experiments",
      hidden: true,
      children: [
        {
          title: "Learn Football (Interactive!)",
          slug: "experiments/football",
          hidden: false,
          children: null
        }
      ],
    },
    {
      title: "Blog",
      slug: "blog",
      hidden: false,
      children: null,
    },
  ]));

  return (
    <AppNavBar
      title={
        <Link href="/">
          <a style={{ textDecoration: "none" }}>tom.bio</a>
        </Link>
      }
      mainItems={mainItems}
      onMainItemSelect={(item) => {
        const { slug, hidden } = item as NavItemT & { slug: string, hidden: boolean };
        setMainItems(setItemActive(mainItems, item));
        if (!hidden) {
          router.push(`/${slug}`);
        }
      }}
      overrides={{
        SecondaryMenuContainer: {
          style: {
            justifyContent: "flex-end"
          }
        }
      }}
    />
  );
}

const apiPagesToMainItems = (apiPages: NavItem[]): NavItemT[] => {
  const mainItems: NavItemT[] = apiPages.map(
    ({ title, slug, hidden, children }) => ({
      label: title,
      hidden,
      slug,
      children: children ? apiPagesToMainItems(children) : undefined,
    })
  );
  return mainItems;
};
