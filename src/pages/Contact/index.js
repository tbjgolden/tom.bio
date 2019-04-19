import React from 'react';
import Jumbotron from '../../Jumbotron';
import Columns from '../../Columns';
import './index.scss';

const Contact = () => (
  <Jumbotron>
    <div className='App-row'>
      <div className='App-row-sizer'>
        <div className='App-row-title'>Get in touch.</div>
        <hr />
        <Columns>
          <div>
            <div className='App-row-header'>Email</div>
            <div className='App-row-description'>
              <a href='mailto:mail@tbjgolden.com'>mail@tbjgolden.com</a>
            </div>
          </div>
          <div>
            <div className='App-row-header'>Text</div>
            <div className='App-row-description'>
              <a href='tel:0012097640446'>+1 (209) 764 0446</a>
            </div>
          </div>
        </Columns>
        <div className='App-row-header'>Username</div>
        <div className='App-row-description'>
          tbjgolden
        </div>
        <div className='App-row-smallprint'>
          <a href='https://www.facebook.com/tbjgolden' target='_blank' rel='noopener noreferrer'>
            Facebook
          </a>
          {', '}
          <a href='https://www.twitter.com/tbjgolden' target='_blank' rel='noopener noreferrer'>
            Twitter
          </a>
          {', '}
          <a href='https://www.instagram.com/tbjgolden' target='_blank' rel='noopener noreferrer'>
            Instagram
          </a>
          {', '}
          <a href='https://www.snapchat.com/add/tbjgolden' target='_blank' rel='noopener noreferrer'>
            Snapchat
          </a>
          {', '}
          <a href='https://www.linkedin.com/in/tbjgolden' target='_blank' rel='noopener noreferrer'>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </Jumbotron>
);

export default Contact;
