import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Header.scss';

export const routes = [
  { title: 'Portfolio', url: '/portfolio' },
  { title: 'Experience', url: '/experience' },
  { title: 'Contact', url: '/contact' },
  { title: 'Blog', url: '//tbjgolden.com/blog' }
];

class Header extends Component {
  state = { menuOpen: false, redirect: false };

  menu = active =>
    ((items =>
      items.map(({ url, title }) => {
        const linkClassName = `Header-menu-nav-list-item-link ${active === url ? 'active' : ''}`;
        return (
          <li key={url} className='Header-menu-nav-list-item'>
            {
              (url[0] === '/' && url[1] === '/')
                ? <a href={url} className={linkClassName} alt={title}>{title}</a>
                : <Link to={url} className={linkClassName}>{title}</Link>
            }
          </li>
        );
      })
    )(routes));

  componentDidMount = () => {
    this.top = document.getElementById('top');
  };

  toggleMenu = (menuOpen = !this.state.menuOpen) => {
    document.body.style.overflowY = menuOpen ? 'hidden' : 'auto';
    document.body.style.pointerEvents = menuOpen ? 'none' : 'auto';
    this.setState({ menuOpen });
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.toggleMenu(false);
    }
  };

  render = () => {
    const { menu, state, props } = this;
    const { location } = props;
    const { menuOpen } = state;

    const cartButtonProps = menuOpen ? { 'aria-hidden': true } : {};

    return (
      <header className={`Header ${(menuOpen ? 'is-open' : '')}`}>
        <div className='App-row-sizer' style={{ padding: 0, position: 'relative' }}>
          <button className='Header-menu-button' onClick={() => this.toggleMenu()} aria-label='Toggle menu' />
          <Link to='/' className='Header-logo' onClick={() => this.toggleMenu(false)} />
          <nav className='Header-menu-nav' >
            <ul className='Header-menu-nav-list'>
              { menu(location.pathname) }
            </ul>
          </nav>
          <Link to='/contact' className='Header-cart-button' {...cartButtonProps} />
        </div>
      </header>
    );
  };
}

export default withRouter(Header);
