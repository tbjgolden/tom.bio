import React, { Component } from 'react';
import './Jumbotron.scss';
import Jumbotron from '../../Jumbotron';

export default class HomeJumbotron extends Component {
  componentDidMount () {
    if (this.canvas) this.canvas.style.opacity = '0';
    if (this.image) {
      this.image.style.opacity = '0';
      this.image.style.transform = 'translate3d(0, 20px, 0)';
    }

    const ctx = this.canvas.getContext('2d');
    const laptopScreenImg = new Image();

    const onScreenLoad = new Promise(resolve => {
      if (laptopScreenImg.complete && laptopScreenImg.naturalHeight !== 0) return resolve();
      laptopScreenImg.addEventListener('load', resolve);
    });
    const onBgLoad = new Promise(resolve => {
      if (this.image.complete && this.image.naturalHeight !== 0) return resolve();
      this.image.addEventListener('load', resolve);
    });

    laptopScreenImg.src = 'images/mylaptopscreen.jpg';

    Promise.all([onScreenLoad, onBgLoad]).then(() => {
      if (this.image) {
        this.image.style.opacity = '1';
        this.image.style.transform = 'translate3d(0, 0, 0)';
      }

      const width = this.canvas.width = laptopScreenImg.width;
      const height = this.canvas.height = laptopScreenImg.height;

      ctx.drawImage(laptopScreenImg, 0, 0);

      const imageData = ctx.getImageData(0, 0, width, height);
      const d = imageData.data;

      const buf = new ArrayBuffer(imageData.data.length);
      const buf8 = new Uint8ClampedArray(buf);
      const data = new Uint32Array(buf);

      function getPixelPointer (x, y) {
        if (x < 0 || x >= width || y < 0 || y >= height) return null;
        return (y * width + x) << 2;
      }

      function calcPixel (x, y) {
        if (x < 0 || x > (width - 1)) return 0;
        const floorX = ~~x;
        const p = getPixelPointer(floorX, y);
        const diff = x - floorX;
        return [
          ((1 - diff) * d[p] + diff * d[p + 4]),
          ((1 - diff) * d[p + 1] + diff * d[p + 5]),
          ((1 - diff) * d[p + 2] + diff * d[p + 6])
        ];
      }

      const midX = width >> 1;
      const delta = height * 0.23;

      for (let y = 0; y < height; y++) {
        const percY = y / height;

        for (let x = 0; x < width; x++) {
          const pseudoX = x - midX;
          const percX = pseudoX / width;
          const inpX = midX + width * (percX / ((width - (delta * percY)) / width));

          const rgb = calcPixel(inpX, y);
          data[y * width + x] = rgb
            ? (255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]
            : 0;
        }
      }

      imageData.data.set(buf8);
      ctx.putImageData(imageData, 0, 0);

      if (this.canvas) this.canvas.style.zIndex = '0';
      setTimeout(() => {
        if (this.canvas) this.canvas.style.opacity = '1';
      }, 800);
    });
  }

  render () {
    return (
      <Jumbotron>
        <div className='App-row-sizer centre'>
          <div className='App-row-title'>
            Incredible engineering.
          </div>
          <div className='App-row-description' id='design-film-link'>
            <a href='film.html' target='_blank'>Watch the design film</a>
          </div>
        </div>
        <div className='jumbotron-laptop-image-sizer-outer'>
          <div className='jumbotron-laptop-image-sizer-inner'>
            <img ref={el => { this.image = el; }} className='jumbotron-laptop-image' alt='My laptop' src='images/mylaptop.jpg' />
            <div className='jumbotron-laptop-image-screen'>
              <canvas ref={el => { this.canvas = el; }} />
            </div>
          </div>
        </div>
      </Jumbotron>
    );
  }
}
