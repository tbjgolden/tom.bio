import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const NotFound = () => (
  <div className='App-row-sizer'>
    <div className='App-row-title'>
      <div className='not-found-message'>
        The page you're looking
        for can't be found.
      </div>
    </div>
    <div className='App-row-description'>
      <Link to='/'>Home</Link>
    </div>
  </div>
);

export default NotFound;
