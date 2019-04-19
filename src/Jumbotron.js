import React from 'react';
import './Jumbotron.scss';

const Jumbotron = ({ children }) => {
  return (
    <div className='Jumbotron'>
      { children }
    </div>
  );
};

export default Jumbotron;
