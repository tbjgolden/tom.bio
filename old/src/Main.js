import React, { useEffect, useRef } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Experience from "./pages/Experience";
import Contact from "./pages/Contact";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import "./Main.scss";

const Main = ({ children, ...props }) => {
  const mainEl = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (mainEl.current) mainEl.current.scrollIntoView();
  }, [location]);

  return (
    <main className="Main" ref={mainEl}>
      <div id="top" />
      <Switch>
        <Route exact path="/" render={() => <Home {...props} />} />
        <Route
          exact
          path="/portfolio"
          render={() => <Portfolio {...props} />}
        />
        <Route
          exact
          path="/experience"
          render={() => <Experience {...props} />}
        />
        <Route exact path="/contact" render={() => <Contact {...props} />} />
        <Route
          exact
          path="/about-this-site"
          render={() => <ComingSoon {...props} />}
        />
        <Route render={() => <NotFound />} />
      </Switch>
    </main>
  );
};

export default Main;
