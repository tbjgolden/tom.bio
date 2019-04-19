import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';
import './Main.scss';

class Main extends Component {
  componentWillReceiveProps = nextProps => {
    if (this.props.location.pathname !== nextProps.location.pathname && this.mainEl) {
      this.mainEl.scrollIntoView()
    }
  };

  render () {
    const { children, ...props } = this.props;
    return (
      <main className='Main' ref={el => { this.mainEl = el; }}>
        <div id='top' />
        <Switch>
          <Route exact path="/" render={() => <Home {...props} />}/>
          <Route exact path="/portfolio" render={() => <Portfolio {...props} />}/>
          <Route exact path="/experience" render={() => <Experience {...props} />}/>
          <Route exact path="/contact" render={() => <Contact {...props} />}/>
          <Route exact path="/about-this-site" render={() => <ComingSoon {...props} />}/>
          <Route render={() => <NotFound />}/>
        </Switch>
      </main>
    );
  }
}

export default withRouter(Main);
