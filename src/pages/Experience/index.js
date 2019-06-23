import React, { useContext, useState } from "react";
import LocationContext from "../../LocationContext";
import Jumbotron from "../../Jumbotron";
import experience from "./experience.json";
import "./index.scss";

// import Timeline from "./Timeline";
// import Normal from "./Normal";
import Plaintext from "./Plaintext";
import Json from "./Json";

const styles = {
  // "timeline": Timeline,
  // "normal": Normal,
  "Plain Text": Plaintext,
  "JSON": Json
};

const Experience = () => {
  const location = useContext(LocationContext);
  const [activeStyle, setActiveStyle] = useState("Plain Text");
  const [xp] = useState(compileExperience(experience, location));

  const Format = styles[activeStyle];

  if (!Format) {
    setActiveStyle("Plain Text");
    return null;
  }

  return (
    <div className="Experience">
      <Jumbotron>
        <div
          className="App-row background-cover white-text Experience-jumbotron"
          style={{
            backgroundImage: `url('images/experience.jpg')`
          }}
        >
          <div className="App-row-sizer">
            <div className="App-row-title">
              {location === "us" ? "Résumé" : "CV"}
            </div>
          </div>
        </div>
      </Jumbotron>

      <div className="App-row Experience-foreword white">
        <div className="App-row-sizer">
          <div className="App-row-description">
            {Object.keys(styles).map(style => (
              <button
                key={style}
                onClick={() => setActiveStyle(style)}
                className={`Experience-style-buttons ${
                  style === activeStyle ? "active" : ""
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <Format xp={xp} />
        </div>
      </div>
    </div>
  );
};

function compileExperience (xp, location) {
  if (Array.isArray(xp)) {
    return xp.map(x => compileExperience(x, location));
  } else if (xp && typeof xp === "object") {
    return typeof xp[location] !== "undefined"
      ? xp[location]
      : Object.keys(xp)
          .map(k => [k, compileExperience(xp[k], location)])
          .reduce((o, [k, v]) => {
            o[k] = v;
            return o;
          }, {});
  } else {
    return xp;
  }
};

export default Experience;
