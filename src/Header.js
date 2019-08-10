import React, { useState, useEffect, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import Lion from "./Lion";
import RoutesContext from "./RoutesContext";
import withWindowWidth from "./withWindowWidth";
import "./Header.scss";

const Header = ({ location, w }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const routes = useContext(RoutesContext);

  function toggleMenu (open = !menuOpen) {
    document.body.style.overflowY = open ? "hidden" : "auto";
    document.body.style.pointerEvents = open ? "none" : "auto";
    setMenuOpen(open);
  };

  useEffect(() => toggleMenu(false), ["location"]);

  return (
    <header className={`Header ${menuOpen ? "is-open" : ""}`}>
      <div
        className="App-row-sizer"
        style={{ padding: 0, position: "relative" }}
      >
        <button
          className="Header-menu-button"
          onClick={() => toggleMenu()}
          aria-label="Toggle menu"
        />
        <Link
          to="/"
          className="Header-logo"
          onClick={() => toggleMenu(false)}
        >
          <Lion />
        </Link>
        <nav
          className="Header-menu-nav hidden-block"
          hidden={!menuOpen || w < 768}
        >
          <ul className="Header-menu-nav-list">
            {
              routes.map(({ url, title, external }) => {
                  const linkClassName = `Header-menu-nav-list-item-link ${
                    location.pathname === url ? "active" : ""
                  }`;
                  return (
                    <li key={url} className="Header-menu-nav-list-item">
                      {external ? (
                        <a href={url} className={linkClassName} alt={title}>
                          {title}
                        </a>
                      ) : (
                        <Link to={url} className={linkClassName}>
                          {title}
                        </Link>
                      )}
                    </li>
                  );
              })
            }
          </ul>
        </nav>
        <Link
          to="/contact"
          className="Header-cart-button"
          hidden={menuOpen && w < 768}
        />
      </div>
    </header>
  );
};

export default withRouter(withWindowWidth(Header));
