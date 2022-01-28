import { LayoutData, NavItem } from "types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav({
  layoutData,
}: {
  layoutData: LayoutData;
}): JSX.Element {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(min-width: 680px)");
    function handleResponsiveNavChange(mql) {
      if (mql.matches) {
        setIsMobileOpen(false);
        document.documentElement.style.overflow = "initial";
        document.body.style.overflow = "initial";
      }
    }
    handleResponsiveNavChange(mediaQueryList);
    mediaQueryList.addEventListener("change", handleResponsiveNavChange);
    return () => {
      mediaQueryList.removeEventListener("change", handleResponsiveNavChange);
    };
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "initial";
      document.body.style.overflow = "initial";
    }
  }, [isMobileOpen]);

  const mainItems: NavItem[] = [
    ...(layoutData?.allPages ?? []),
    {
      title: "CV / Resume",
      slug: "cv",
      children: [],
    },
    {
      title: "Portfolio",
      slug: "portfolio",
      children: [],
    },
    {
      title: "Experiments",
      slug: "experiments",
      children: [
        {
          title: "100 Days of Recruiters",
          slug: "experiments/recruiters",
          children: [],
        },
        {
          title: "Evolution of Football",
          slug: "experiments/evolution-of-football",
          children: [],
        },
        {
          title: "Football Simulator",
          slug: "experiments/football-simulator",
          children: [],
        },
      ],
    },
    {
      title: "Blog",
      slug: "blog",
      children: [],
    },
  ];

  return (
    <div className="nav-wrapper">
      <nav className="desktop-nav">
        <div className="mw">
          <Link href="/">
            <a className="home-link" tabIndex={0}>
              tom.bio
            </a>
          </Link>

          <ul className="nav-links">
            {mainItems
              .filter(({ slug }) => slug !== "")
              .map(({ title, slug, children }) => (
                <li
                  key={slug}
                  className="nav-link"
                  tabIndex={0}
                  data-slug={slug}
                >
                  {children.length > 0 ? (
                    <>
                      <span>
                        <span className="inactive-link">
                          <span style={{ textDecoration: "underline" }}>
                            {title}
                          </span>
                          {" ↓"}
                        </span>
                      </span>
                      <ul className="submenu">
                        <div className="mw">
                          {children
                            .filter(({ children }) => children.length === 0)
                            .map(({ title, slug }) => (
                              <Link key={slug} href={`/${slug}`}>
                                <a className="submenu-link" tabIndex={0}>
                                  {title}
                                </a>
                              </Link>
                            ))}
                        </div>
                      </ul>
                    </>
                  ) : (
                    <Link href={`/${slug}`}>
                      <a className="active-link" tabIndex={0}>
                        {title}
                      </a>
                    </Link>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </nav>
      <nav className="mobile-nav">
        <Link href="/">
          <a className="home-link" tabIndex={0}>
            tom.bio
          </a>
        </Link>
        <button
          tabIndex={0}
          className="mobile-nav-button"
          onClick={() => {
            setIsMobileOpen(!isMobileOpen);
          }}
        >
          Menu <span className="mobile-nav-button-icon">☰</span>
        </button>
        <ul
          className="nav-links"
          style={{ display: isMobileOpen ? "flex" : "none" }}
        >
          {mainItems
            .filter(({ slug }) => slug !== "")
            .map(({ title, slug, children }) => (
              <li key={slug} className="nav-link" tabIndex={0} data-slug={slug}>
                {children.length > 0 ? (
                  <>
                    <span>
                      <span className="inactive-link">
                        <span>{title}:</span>
                      </span>
                    </span>
                    <ul className="submenu">
                      {children
                        .filter(({ children }) => children.length === 0)
                        .map(({ title, slug }) => (
                          <Link key={slug} href={`/${slug}`}>
                            <a className="submenu-link" tabIndex={0}>
                              {title}
                            </a>
                          </Link>
                        ))}
                    </ul>
                  </>
                ) : (
                  <Link href={`/${slug}`}>
                    <a className="active-link" tabIndex={0}>
                      {title}
                    </a>
                  </Link>
                )}
              </li>
            ))}
          <div
            className="mobile-nav-backdrop"
            onClick={(event) => {
              event.stopPropagation();
              setIsMobileOpen(false);
            }}
          />
        </ul>
      </nav>
      <style jsx>{`
        .nav-wrapper {
          height: 40px;
        }

        .desktop-nav {
          display: none;
          height: 40px;
          position: fixed;
          z-index: 99;
          top: 0;
          left: 0;
          width: 100%;
          justify-content: center;
          border-bottom: 2px solid #ccc;
          background: #fff;
          filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2));
        }
        .desktop-nav .nav-links {
          display: flex;
        }
        .desktop-nav .nav-link {
          white-space: pre;
          display: flex;
          align-items: center;
        }
        .desktop-nav .home-link {
          text-decoration: none;
          align-self: center;
          padding: 6px 16px;
          font-weight: bold;
          font-variation-settings: "wght" 700;
        }
        .desktop-nav .active-link {
          padding: 6px 16px;
        }
        .desktop-nav .inactive-link {
          cursor: pointer;
          padding: 6px 16px;
        }
        .desktop-nav .submenu {
          display: none;
          position: absolute;
          top: 38px;
          left: 0;
          right: 0;
          height: 40px;
          justify-content: center;
          background: #fff;
          border-top: 1px solid #ccc;
          border-bottom: 2px solid #ccc;
        }

        .desktop-nav .submenu-link {
          white-space: pre;
          padding: 6px 16px;
          display: flex;
          align-items: center;
        }
        .desktop-nav .nav-link:hover,
        .desktop-nav .nav-link:focus,
        .desktop-nav .nav-link:focus-within,
        .desktop-nav .nav-link:active,
        .desktop-nav .submenu-link:hover,
        .desktop-nav .submenu-link:focus,
        .desktop-nav .submenu-link:focus-within,
        .desktop-nav .submenu-link:active {
          background: #f7f7f7;
        }
        .desktop-nav .nav-link:hover > .submenu,
        .desktop-nav .nav-link:focus > .submenu,
        .desktop-nav .nav-link:focus-within > .submenu,
        .desktop-nav .nav-link:active > .submenu,
        .desktop-nav .submenu:hover {
          display: flex;
        }
        .desktop-nav > .mw {
          display: flex;
          width: 100%;
          justify-content: space-between;
        }
        .desktop-nav .submenu > .mw {
          display: flex;
          width: 100%;
          justify-content: flex-end;
        }

        .mobile-nav {
          display: flex;
          height: 40px;
          position: fixed;
          z-index: 9;
          top: 0;
          left: 0;
          width: 100%;
          justify-content: space-between;
          border-bottom: 2px solid #ccc;
          background: #fff;
          filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2));
        }
        .mobile-nav-button {
          line-height: 1.3;
          padding: 0 16px;
        }
        .mobile-nav-button-icon {
          font-size: 1.3em;
          line-height: 1;
        }
        .mobile-nav .nav-links {
          width: 100%;
          height: auto;
          position: absolute;
          z-index: 99;
          top: 38px;
          left: 0;
          right: 0;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          flex-direction: column;
        }
        .mobile-nav .nav-link {
          white-space: pre;
          display: flex;
          background: #f9f9f9;
          width: 100%;
          border-bottom: 1px solid #ccc;
          position: relative;
          z-index: 2;
        }
        .mobile-nav .nav-link:last-of-type {
          filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.2));
          z-index: 1;
        }
        .mobile-nav .home-link {
          text-decoration: none;
          align-self: center;
          padding: 6px 16px;
          font-weight: bold;
          font-variation-settings: "wght" 700;
        }
        .mobile-nav .active-link {
          display: block;
          flex: 1 1 1px;
          padding: 6px 16px;
        }
        .mobile-nav .inactive-link {
          display: block;
          cursor: pointer;
          padding: 6px 16px;
          color: #777;
        }
        .mobile-nav .submenu {
          flex: 1 1 1px;
        }
        .mobile-nav .submenu-link {
          white-space: pre;
          padding: 6px 16px;
          display: flex;
          align-items: center;
        }
        .mobile-nav .submenu-link::before {
          content: "";
          display: inline-block;
          width: 4px;
          height: 4px;
          margin-right: 8px;
          background-color: #000;
        }
        .mobile-nav-backdrop {
          width: 100%;
          height: 100vh;
          border-top: 1px solid #ccc;
          background: rgba(255, 255, 255, 0.6);
        }

        @media (min-width: 680px) {
          .nav-wrapper {
            height: 72px;
          }
          .desktop-nav {
            display: flex;
          }
          .mobile-nav {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
