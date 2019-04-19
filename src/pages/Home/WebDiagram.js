import React from 'react';
import './WebDiagram.scss';

const WebDiagram = () => {
  return (
    <div className='WebDiagram'>
      <div className='WebDiagram-screen-container'>
        <div className='WebDiagram-screen'>
          <div className='WebDiagram-sidebar'>
            <div className='WebDiagram-sidebar-header' />
          </div>
          <div className='WebDiagram-body'>
            <div className='WebDiagram-body-header' />
            <div className='WebDiagram-body-paragraph'>
              <div className='WebDiagram-body-paragraph-line' />
              <div className='WebDiagram-body-paragraph-line' />
              <div className='WebDiagram-body-paragraph-line' />
            </div>
            <div className='WebDiagram-body-paragraph'>
              <div className='WebDiagram-body-paragraph-line' />
              <div className='WebDiagram-body-paragraph-line' />
              <div className='WebDiagram-body-paragraph-line' />
            </div>
            <div className='WebDiagram-body-paragraph'>
              <div className='WebDiagram-body-paragraph-line' />
              <div className='WebDiagram-body-paragraph-line' />
              <div className='WebDiagram-body-paragraph-line' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDiagram;
