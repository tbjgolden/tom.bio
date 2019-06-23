import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.scss";

window.obfs = s =>
  s.split("").map((c, i) => {
    const inside = Math.random() > 0.5;
    const randomChar = String.fromCharCode(~~(32 + 80 * Math.random()));
    return (
      <React.Fragment key={i}>
        {inside ? "" : c}
        <span style={{ display: inside ? "inline" : "none" }}>
          {inside ? c : randomChar}
        </span>
      </React.Fragment>
    );
  });

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

window.addEventListener("keyup", ev => {
  if (!window.hasTabbed) {
    if (ev.keyCode === 9) {
      document.body.classList.add("show-focus");
      window.hasTabbed = true;
    }
  }
});
