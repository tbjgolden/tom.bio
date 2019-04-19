import React from 'react';
import './MobileDiagram.scss';

const MobileDiagram = () => {
  return (
    <div className='MobileDiagram'>
      <div className='MobileDiagram-screen-container'>
        <div className='MobileDiagram-screen'>
          <div className='MobileDiagram-menu-button' />
          <div className='MobileDiagram-body'>
            <div className='MobileDiagram-body-header'>
              <div className='MobileDiagram-body-title' />
            </div>
            <div className='MobileDiagram-body-paragraph'>
              <div className='MobileDiagram-body-paragraph-line' />
              <div className='MobileDiagram-body-paragraph-line' />
              <div className='MobileDiagram-body-paragraph-line' />
            </div>
            <div className='MobileDiagram-body-paragraph'>
              <div className='MobileDiagram-body-paragraph-line' />
              <div className='MobileDiagram-body-paragraph-line' />
              <div className='MobileDiagram-body-paragraph-line' />
            </div>
            <div className='MobileDiagram-body-paragraph'>
              <div className='MobileDiagram-body-paragraph-line' />
              <div className='MobileDiagram-body-paragraph-line' />
              <div className='MobileDiagram-body-paragraph-line' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDiagram;
