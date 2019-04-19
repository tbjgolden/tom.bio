import React from 'react';
import Jumbotron from '../../Jumbotron';
import Gallery, { GalleryItem, GalleryRow, GalleryText, GalleryImage } from '../../Gallery';
import './index.scss';

const createPortfolioGalleryImage = (src, doubleWidth = false) => (
  <GalleryImage
    src={src}
    doubleWidth={!!doubleWidth}
    bgProps={{
      src: 'images/fruitbookpro.png',
      top: '-5%',
      left: '-15%',
      width: '130%',
      maxWidth: 'none'
    }}
  />
);

const Portfolio = () => (
  <div className='Portfolio'>
    <Jumbotron>
      <div className='App-row white-text Portfolio-jumbotron' style={{
        background: 'radial-gradient(circle at 100% 100%, rgb(232, 17, 35), rgb(247, 148, 29) 14%, rgba(255, 242, 0, 1) 28%, rgba(255, 255, 0, 1) 34%, rgb(0, 166, 80) 68%, rgb(0, 84, 165) 80%, rgb(103, 45, 147))'
      }}>
        <div className='App-row-sizer'>
          <div className='App-row-title'>Portfolio</div>
        </div>
      </div>
    </Jumbotron>
    <Gallery>
      <GalleryItem>
        <GalleryText>
          <div className='Gallery-title'>willtheygo.com</div>
          <div className='Gallery-description'>Analytical-engine predicting football's biggest transfers.</div>
        </GalleryText>
        {createPortfolioGalleryImage('images/portfolio/willtheygo.com.png')}
      </GalleryItem>
      <GalleryRow>
        <GalleryItem>
          <GalleryText>
            <div className='Gallery-title'>theboar.org</div>
            <div className='Gallery-description'>Award-winning website for student newspaper.</div>
          </GalleryText>
          {createPortfolioGalleryImage('images/portfolio/theboar.org.png')}
        </GalleryItem>
        <GalleryItem>
          <GalleryText>
            <div className='Gallery-title'>tbjgolden.website</div>
            <div className='Gallery-description'>Landing page for my rapid website service.</div>
          </GalleryText>
          {createPortfolioGalleryImage('images/portfolio/tbjgolden.website.png')}
        </GalleryItem>
      </GalleryRow>
      <GalleryRow>
        <GalleryItem>
          <GalleryText>
            <div className='Gallery-title'>live.gobiapp.com</div>
            <div className='Gallery-description'>Gobi{'’'}s premium live feed of snaps.</div>
          </GalleryText>
          {createPortfolioGalleryImage('images/portfolio/live.gobiapp.com.png')}
        </GalleryItem>
        <GalleryItem>
          <GalleryText>
            <div className='Gallery-title'>shop.shipt.com</div>
            <div className='Gallery-description'>One of the front-end projects at Shipt.</div>
          </GalleryText>
          {createPortfolioGalleryImage('images/portfolio/shop.shipt.com.png')}
        </GalleryItem>
      </GalleryRow>
    </Gallery>
  </div>
);

export default Portfolio;
