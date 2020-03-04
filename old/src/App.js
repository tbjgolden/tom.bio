import React, { useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import TomContext from "./TomContext";
import RoutesContext from "./RoutesContext";
import tom from "./tom.json";
import "./App.scss";

const App = () => {
  const [location, setLocation] = useState(localStorage.getItem("loc"));

  useEffect(() => {
    if (!localStorage.getItem("loc")) {
      window
        .fetch(`http://ip-api.com/json`)
        .then(res => res.json())
        .then(({ countryCode }) => {
          countryCode = countryCode.toUpperCase();
          setLocation(countryCode);
          localStorage.setItem("loc", countryCode);
        })
        .catch(() => {
          setLocation("US");
          localStorage.setItem("loc", "US");
        });
    }
  }, []);

  return (
    <TomContext.Provider
      value={{
        location,
        tom: compileExperience(tom, location)
      }}
    >
      <div className="App">
        {location && (
          <RoutesContext.Provider
            value={[
              { title: "Portfolio", url: "/portfolio" },
              {
                title: location === "US" ? "Résumé" : "CV",
                url: "/experience"
              },
              { title: "Contact", url: "/contact" },
              { title: "Blog", url: "/blog", external: true }
            ]}
          >
            <Header />
            <Main />
            <Footer />
          </RoutesContext.Provider>
        )}
      </div>
    </TomContext.Provider>
  );
};

function compileExperience(xp, location) {
  if (Array.isArray(xp)) {
    return xp.map(x => compileExperience(x, location));
  } else if (xp && typeof xp === "object") {
    return typeof xp[location] === "undefined"
      ? Object.keys(xp)
          .map(k => [k, compileExperience(xp[k], location)])
          .reduce((o, [k, v]) => {
            o[k] = v;
            return o;
          }, {})
      : compileExperience(xp[location], location);
  } else {
    return xp;
  }
}

export default App;
