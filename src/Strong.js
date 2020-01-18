import React, { useState, useRef, useEffect } from 'react';

const Strong = ({ children }) => {
  const [fontWeight, setFontWeight] = useState('bolder');
  const spanEl = useRef(null);

  useEffect(() => {
    if (spanEl.current) {
      setFontWeight(
        `${Math.min(900, 200 + ~~window.getComputedStyle(spanEl.current.parentNode).fontWeight)}`
      );
    }
  }, []);

  return <span ref={spanEl} style={{ fontWeight }}>{ children }</span>;
}

export default Strong;
