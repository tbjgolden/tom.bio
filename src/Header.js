import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import withWindowWidth from './withWindowWidth';
import './Header.scss';

export const routes = [
  { title: 'Portfolio', url: '/portfolio' },
  { title: 'Experience', url: '/experience' },
  { title: 'Contact', url: '/contact' },
  { title: 'Blog', url: '/blog', external: true }
];

class Header extends Component {
  state = { menuOpen: false, redirect: false };

  menu = active =>
    ((items =>
      items.map(({ url, title, external }) => {
        const linkClassName = `Header-menu-nav-list-item-link ${active === url ? 'active' : ''}`;
        return (
          <li key={url} className='Header-menu-nav-list-item'>
            {
              external
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
    const { location, windowWidth } = props;
    const { menuOpen } = state;

    return (
      <header className={`Header ${(menuOpen ? 'is-open' : '')}`}>
        <div className='App-row-sizer' style={{ padding: 0, position: 'relative' }}>
          <button className='Header-menu-button' onClick={() => this.toggleMenu()} aria-label='Toggle menu' />
          <Link to='/' className='Header-logo' onClick={() => this.toggleMenu(false)} />
          <nav className='Header-menu-nav hidden-block' hidden={!menuOpen || windowWidth < 768}>
            <ul className='Header-menu-nav-list'>
              { menu(location.pathname) }
            </ul>
          </nav>
          <Link to='/contact' className='Header-cart-button' hidden={menuOpen && windowWidth < 768} />
        </div>
      </header>
    );
  };
}

export default withRouter(withWindowWidth(Header));
