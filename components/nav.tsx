import Link from "@/components/link";
import Container from "./container";
import { LayoutData, NavItem } from "types";
import { useMemo, Fragment, useRef } from "react";
import useActive from "hooks/useActive";

const NavLink = ({ title, slug, hidden, children, level }: {
  title: string;
  slug: string;
  hidden: boolean;
  children: null | NavItem[];
  level: number;
}) => {
  const wrapperEl = useRef<HTMLDivElement | null>(null);
  const isActive = useActive(wrapperEl.current ?? null);

  return (
    <div
      key={slug}
      ref={wrapperEl}
      className={`dIB pR ${isActive ? "zi2" : ""}`}
    >
      {hidden
        ? (
          <div className="dIB ma10 fowB">
            {title}
            {children?.length ? " ▾" : null}
          </div>
        )
        : (
          <Link href={`/${slug}`} className="dIB ma10 fowB">
            {title}
            {children?.length ? " " : null}
          </Link>
        )}
      {(children?.length && isActive)
        ? (
          <div className="pA l0 w70 tP zi2 bacW bot1B bor1B bol1B bob1B pa20">
            <NavLinks navItems={children} level={level + 1} />
          </div>
        )
        : null}
    </div>
  );
};

const NavLinks = (
  { navItems, level }: { navItems: NavItem[]; level: number },
) => (
  <>
    {navItems.map(({ title, slug, hidden, children }) => {
      const shouldShow = !hidden ||
        (children ?? []).find((child) => child?.hidden === false);

      return shouldShow
        ? <NavLink
          key={slug}
          title={title}
          slug={slug}
          hidden={hidden}
          children={children}
          level={level}
        />
        : null;
    })}
  </>
);

export default function Nav({ layoutData }: { layoutData: LayoutData }) {
  return (
    <nav className="pal30 par30">
      <Container className="pat20 pab20 bob2B">
        <div className="malN10 marN10">
          <NavLinks
            navItems={[
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
            ]}
            level={0}
          />
        </div>
      </Container>
    </nav>
  );
}

/*


*/
