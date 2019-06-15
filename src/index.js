import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.scss';

ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));

window.addEventListener('keyup', ev => {
  if (!window.hasTabbed) {
    if (ev.keyCode === 9) {
      document.body.classList.add('show-focus');
      window.hasTabbed = true;
    }
  }
});
