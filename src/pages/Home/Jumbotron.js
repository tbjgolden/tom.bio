import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSpring, animated } from "react-spring";
import "./Jumbotron.scss";
import Jumbotron from "../../Jumbotron";
import Me from '../../images/me.png';

const HomeJumbotron = () => {
  const [stage, setStage] = useState(0);
  const [W, setW] = useState(window.innerWidth);
  const timeout = useRef(null);
  const widthListener = useCallback(() => setW(window.innerWidth), []);

  const fontSize = (W > 960) ? 64 : (W * 0.07);

  const pro = useSpring({ maxWidth: stage > 0 ? (1.9 * fontSize) : 0 });
  const max = useSpring({ maxWidth: stage > 1 ? (2.2 * fontSize) : 0 });
  const xdr = useSpring({ maxWidth: stage > 2 ? (2.3 * fontSize) : 0 });
  const s = useSpring({ maxWidth: stage > 3 ? (1.1 * fontSize) : 0 });

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setStage(1);
      timeout.current = setTimeout(() => {
        setStage(2);
        timeout.current = setTimeout(() => {
          setStage(3);
          timeout.current = setTimeout(() => setStage(4), 2000);
        }, 1000);
      }, 800);
    }, 800);

    window.addEventListener("resize", widthListener);

    return () => {
      clearTimeout(timeout.current);
      window.removeEventListener("resize", widthListener);
    };
  }, [widthListener]);

  return (
    <Jumbotron className="HomeJumbotron">
      <div className="App-row-sizer centre">
        <div className="App-row-title">
          <span className="HomeJumbotron-title-frag">
            {"TomGolden"}
          </span>
          <animated.span className="HomeJumbotron-title-frag" style={pro}>
            {" Pro"}
          </animated.span>
          <animated.span className="HomeJumbotron-title-frag" style={max}>
            {" Max"}
          </animated.span>
          <animated.span className="HomeJumbotron-title-frag" style={xdr}>
            {" XDR"}
          </animated.span>
          <animated.span className="HomeJumbotron-title-frag" style={s}>
            {" 🅂"}
          </animated.span>
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

        <img src={Me} alt="me" className={`me stage-${stage}`} />

        {/*
        <div className="HomeJumbotron-square-outer">
          <div className="HomeJumbotron-square-inner">
            <div className="HomeJumbotron-square" />
          </div>
        </div>
        */}
      </div>
    </Jumbotron>
  );
};

export default HomeJumbotron;
