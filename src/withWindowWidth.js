import React, { useState, useEffect, useRef } from 'react';

const withWindowWidth = WrappedComponent => props => {
  const [w, setW] = useState(window.innerWidth);
  const callback = useRef(() => {
    const { innerWidth } = window;
    if (w !== innerWidth) setW(innerWidth);
  });

  useEffect(() => {
    const cb = callback.current;
    window.addEventListener('resize', cb);
    return () => window.removeEventListener('resize', cb);
  }, []);

  return <WrappedComponent w={w} {...props} />;
};

export default withWindowWidth;
