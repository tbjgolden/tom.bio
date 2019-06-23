import React, { useState, useEffect, useRef } from 'react';

const withWindowWidth = WrappedComponent => props => {
  const [w, setW] = useState(window.innerWidth);
  const callback = useRef(() => {
    const { innerWidth } = window;
    if (w !== innerWidth) setW(innerWidth);
  });

  useEffect(() => {
    window.addEventListener('resize', callback.current);
    return () => {
      window.removeEventListener('resize', callback.current);
    }
  }, []);

  return <WrappedComponent w={w} {...props} />;
};

export default withWindowWidth;
