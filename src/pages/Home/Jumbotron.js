import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Jumbotron.scss";
import Jumbotron from "../../Jumbotron";
import Stand from '../../images/stand.jpg';

const HomeJumbotron = () => {
  return (
    <Jumbotron className="HomeJumbotron">
      <div className="App-row-sizer centre">
        <div className="App-row-title">
          I got $999 problems
        </div>
        <div className="App-row-description" id="design-film-link">
          <a href="film.html" target="_blank">
            {"Watch the design film"}
            <svg
              className="chevron-icon"
              width="0.9em"
              height="0.9em"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>

        <img src={Stand} alt="Stand" className="HomeJumbotron-stand" />
      </div>
    </Jumbotron>
  );
};

export default HomeJumbotron;
