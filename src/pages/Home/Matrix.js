import React, { Component } from 'react';
import './Matrix.scss';

export default class Matrix extends Component {
  constructor (props) {
    super(props);

    this.state = { screenWidth: props.screenWidth };
  }

  componentDidMount () {
    this.ctx = this.canvas.getContext("2d");
    this.height = this.canvas.height = this.canvas.clientHeight;
    this.width = this.canvas.width = this.canvas.clientWidth;

    this.startCanvas();
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.screenWidth !== nextProps.screenWidth) {
      this.setState({ screenWidth: nextProps.screenWidth });
      this.width = this.canvas.width = this.canvas.clientWidth;
      this.height = this.canvas.height = this.canvas.clientHeight;
      this.startCanvas();
    }
  }

  startCanvas () {
    clearInterval(this.interval);

    const cols = Math.ceil(this.width / 24);
    const rows = Math.ceil(this.height / 24);

    const coords = new Array(Math.ceil(cols / 5))
      .fill(0)
      .map(() => [
        ~~(cols * Math.random()),
        Math.max(0, ~~(rows / 2) - ~~(rows * Math.random())),
        randomEmoji()
      ]);

    this.interval = setInterval(() => {
      this.ctx.font = `18px monospace`;
      this.ctx.fillStyle = 'rgba(0,0,0,.05)';
      this.ctx.fillRect(0, 0, this.width, this.height);

      for (let i = coords.length - 1; i >= 0; i--) {
        let [col, row, char] = coords[i];

        if (row >= rows + 1) {
          coords[i] = [
            ~~(cols * Math.random()),
            Math.max(0, ~~(rows / 2) - ~~(rows * Math.random())),
            randomEmoji()
          ];
          [col, row, char] = coords[i];
        }

        this.ctx.fillStyle = 'rgba(0,0,0,.5)';
        this.ctx.fillRect(24 * col, 24 * row, 24, 144);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(24 * col, 24 * row, 24, 96);

        this.ctx.fillText(char, 24 * col, (24 - 4) + (24 * row));

        coords[i][2] = char = randomEmoji();
        coords[i][1] = row = coords[i][1] + 1;

        this.ctx.fillText(char, 24 * col, (24 - 4) + (24 * row));
      }
    }, 60);
  }

  render () {
    return (
      <div className='Matrix'>
        <canvas ref={el => { this.canvas = el; }} />
      </div>
    );
  }
}

function findSurrogatePair (point) {
  const offset = point - 0x10000;
  const lead = 0xd800 + (offset >> 10);
  const trail = 0xdc00 + (offset & 0x3ff);
  return [lead.toString(16), trail.toString(16)];
}

const emojis = [
  '1F601', '1F602', '1F603', '1F604', '1F605', '1F609', '1F60A', '1F60B',
  '1F60C', '1F60D', '1F612', '1F613', '1F614', '1F616', '1F618', '1F61A',
  '1F61C', '1F61D', '1F61E', '1F620', '1F622', '1F623', '1F624', '1F625',
  '1F628', '1F629', '1F62A', '1F62B', '1F62D', '1F630', '1F631', '1F632',
  '1F633', '1F635', '1F637', '1F600', '1F607', '1F60E', '1F610', '1F611',
  '1F617', '1F619', '1F61B', '1F61F', '1F626', '1F627', '1F62C', '1F62E',
  '1F62F', '1F634', '1F636'
]
  .map(charCode => String.fromCharCode(
    ...findSurrogatePair(parseInt(charCode, 16)).map(code => parseInt(code, 16))
  ));

function randomEmoji () {
  return emojis[~~(emojis.length * Math.random())];
}
