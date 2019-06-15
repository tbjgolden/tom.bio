import React, { useState, useEffect, useRef } from 'react';

window.windowWidthListeners = window.windowWidthListeners || {};
window.prevWidth = window.prevWidth || window.innerWidth;

window.addEventListener('resize', () => {
  if (window.prevWidth !== window.innerWidth) {
    window.prevWidth = window.innerWidth;
    Object.values(window.windowWidthListeners).forEach(fn => fn(window.prevWidth));
  }
});

const withWindowWidth = WrappedComponent => props => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const uid = useRef(`${Date.now()}${Math.random()}`);

  useEffect(() => {
    window.windowWidthListeners[uid.current] = w => setWindowWidth(w);
    return () => delete window.windowWidthListeners[uid.current];
  }, []);

  return <WrappedComponent windowWidth={windowWidth} {...props} />;
};

export default withWindowWidth;
