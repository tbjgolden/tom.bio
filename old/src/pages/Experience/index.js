import React, { useContext, useState } from "react";
import TomContext from "../../TomContext";
import Jumbotron from "../../Jumbotron";
import "./index.scss";

// import Timeline from "./Timeline";
// import Normal from "./Normal";
import Plaintext from "./Plaintext";
import Json from "./Json";

const styles = {
  // "timeline": Timeline,
  // "normal": Normal,
  "Plain Text": Plaintext,
  JSON: Json
};

const Experience = () => {
  const { location, tom } = useContext(TomContext);
  const [activeStyle, setActiveStyle] = useState("Plain Text");

  console.log({ location, tom });

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
              {location === "US" ? "Résumé" : "CV"}
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

          <Format xp={tom} />
        </div>
      </div>
    </div>
  );
};

export default Experience;
