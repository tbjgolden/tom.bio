import React, { Component } from 'react';

export default class Strong extends Component {
  state = {
    fontWeight: 'bolder'
  };

  componentDidMount () {
    this.setState({
      fontWeight: `${Math.min(900, 200 + ~~window.getComputedStyle(this.el.parentNode).fontWeight)}`
    });
  }

  render () {
    const { children } = this.props;
    const { fontWeight } = this.state;

    return <span ref={span => { this.el = span; }} style={{ fontWeight }}>{ children }</span>;
  }
}
