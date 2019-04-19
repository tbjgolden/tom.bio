import React from 'react';
import './index.scss';

const ComingSoon = ({ history }) => (
  <div className='App-row-sizer'>
    <div className='App-row-title'>
      <div className='coming-soon-message'>
        This page is coming soon.
      </div>
    </div>
    <div className='App-row-description'>
      <a onClick={() => history.goBack()}>Back</a>
    </div>
  </div>
);

export default ComingSoon;
