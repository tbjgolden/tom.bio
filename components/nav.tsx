import { LayoutData, NavItem } from "types";
import { AppNavBar, NavItemT, setItemActive } from "baseui/app-nav-bar";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Nav({
  layoutData,
}: {
  layoutData: LayoutData;
}): JSX.Element {
  const router = useRouter();

  const [mainItems, setMainItems] = useState(
    apiPagesToMainItems([
      ...(layoutData?.allPages ?? []),
      {
        title: "CV / Resume",
        slug: "cv",
        hidden: false,
        children: null,
      },
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
            title: "100 Days of Recruiters",
            slug: "experiments/recruiters",
            hidden: false,
            children: null
          },
          {
            title: "Evolution of Football",
            slug: "experiments/evolution-of-football",
            hidden: false,
            children: null
          },
          {
            title: "Football Simulator",
            slug: "experiments/football-simulator",
            hidden: false,
            children: null
          },
        ],
      },
      {
        title: "Blog",
        slug: "blog",
        hidden: false,
        children: null,
      },
    ])
  );

  return (
    <AppNavBar
      title={
        <Link href="/">
          <a style={{ textDecoration: "none" }}>tom.bio</a>
        </Link>
      }
      mainItems={mainItems}
      onMainItemSelect={(item) => {
        const { slug, hidden } = item as NavItemT & {
          slug: string;
          hidden: boolean;
        };
        setMainItems(setItemActive(mainItems, item));
        if (!hidden) {
          router.push(`/${slug}`);
        }
      }}
      {...({
        overrides: {
          SecondaryMenuContainer: {
            style: {
              justifyContent: "flex-end",
            },
          },
        },
      } as any)}
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
