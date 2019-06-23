import React, { useContext } from "react";
import Jumbotron from "../../Jumbotron";
import Columns from "../../Columns";
import TomContext from "../../TomContext";
import "./index.scss";

const Contact = () => {
  const { tom } = useContext(TomContext);
  return (
    <Jumbotron>
      <div className="App-row">
        <div className="App-row-sizer">
          <div className="App-row-title">Get in touch.</div>
          <hr />
          <Columns>
            <div>
              <div className="App-row-header">Email</div>
              <div className="App-row-description">
                <a
                  onClick={() => {
                    const a = document.createElement("A");
                    a.setAttribute("href", `mailto:${tom.email}`);
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }}
                >
                  {window.obfs(tom.email)}
                </a>
              </div>
            </div>
            <div>
              <div className="App-row-header">Text</div>
              <div className="App-row-description">
                <a
                  onClick={() => {
                    const a = document.createElement("A");
                    a.setAttribute(
                      "href",
                      `tel:${tom.phone.replace(/[^0-9]+/g, "")}`
                    );
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }}
                >
                  {window.obfs(tom.phone)}
                </a>
              </div>
            </div>
          </Columns>
          <div className="App-row-header">Username</div>
          <div className="App-row-description">tbjgolden</div>
          <div className="App-row-smallprint">
            <a
              href="https://t.me/tbjgolden"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
            {", "}
            <a
              href="https://www.github.com/tbjgolden"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
            {", "}
            <a
              href="https://www.twitter.com/tbjgolden"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            {", "}
            <a
              href="https://www.snapchat.com/add/tbjgolden"
              target="_blank"
              rel="noopener noreferrer"
            >
              Snapchat
            </a>
            {", "}
            <a
              href="https://www.linkedin.com/in/tbjgolden"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </Jumbotron>
  );
};

export default Contact;
