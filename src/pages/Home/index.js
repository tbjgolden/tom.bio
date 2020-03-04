import React from 'react';
import Columns from '../../Columns';
import Strong from '../../Strong';
import WebDiagram from './WebDiagram';
import MobileDiagram from './MobileDiagram';
import ServerDiagram from './ServerDiagram';
import Matrix from './Matrix';
import Jumbotron from './Jumbotron';
import './index.scss';

const Home = () => (
  <div>
    <Jumbotron />
    <div className='App-row-sizer'>
      <div className='App-row-title centre'>but a stand aint one</div>
      <div className='App-row-description centre'>
        Tom Golden makes websites and apps, like <a href='http://willtheygo.com' target='_blank' rel='noopener noreferrer'>willtheygo.com</a> and&nbsp;<a href='//prevent.rip' target='_blank' rel='noopener noreferrer'>prevent.rip</a>.
      </div>
    </div>
    <div className='App-row' style={{ height: 'calc(300px + 15vw)' }}>
      <Matrix />
      <div className='App-row-sizer'>
        <div className='App-row-title'>Revolutionary algorithms.</div>
        <div className='App-row-description'>
          <Strong>EmojiRain&trade; &ndash; powered by the Canvas API.</Strong>
        </div>
      </div>
    </div>
    <div className='App-row white'>
      <div className='App-row-sizer'>
        <div className='App-row-title'>TomGolden helps you build:</div>
        <Columns>
          <div>
            <div className='App-row-header'>Web</div>
            <div className='App-row-description'>React, SCSS, ES6+, Angular</div>
            <WebDiagram />
          </div>
          <div>
            <div className='App-row-header'>Mobile</div>
            <div className='App-row-description'>Flutter, React&nbsp;Native, Ionic, KaiOS</div>
            <MobileDiagram />
          </div>
          <div>
            <div className='App-row-header'>Server</div>
            <div className='App-row-description'>Node, Rust, GraphQL</div>
            <ServerDiagram />
          </div>
        </Columns>
      </div>
    </div>
  </div>
);

export default Home;
