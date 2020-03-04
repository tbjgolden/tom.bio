import React, { useState, useEffect } from 'react';

const withWindowWidth = WrappedComponent => props => {
  const [W, setW] = useState(window.innerWidth);

  useEffect(() => {
    const setWidth = () => setW(window.innerWidth);
    window.addEventListener('resize', setWidth);
    return () => window.removeEventListener('resize', setWidth);
  }, []);

  return <WrappedComponent W={W} {...props} />;
};

export default withWindowWidth;
