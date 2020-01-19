import React from 'react';
import './Jumbotron.scss';

const Jumbotron = ({ children, className, ...props }) => (
  <div className={`Jumbotron ${className || ""}`} {...props}>
    { children }
  </div>
);

export default Jumbotron;
