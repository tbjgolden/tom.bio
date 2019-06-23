import React, { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import LocationContext from './LocationContext';
import './App.scss';

const App = () => {
  const [loc, setLoc] = useState(localStorage.getItem("loc"));

  useEffect(() => {
    if (!localStorage.getItem("loc")) {
      window.fetch(`http://ip-api.com/json`)
        .then(res => res.json())
        .then(({ countryCode }) => {
          countryCode = countryCode.toUpperCase();
          setLoc(countryCode);
          localStorage.setItem("loc", countryCode);
        })
        .catch(() => {
          setLoc('US');
          localStorage.setItem("loc", 'US');
        });
    }
  }, []);

  return (
    <LocationContext.Provider value={loc}>
      <div className='App'>
        {
          loc && (
            <React.Fragment>
              <Header />
              <Main />
              <Footer />
            </React.Fragment>
          )
        }
      </div>
    </LocationContext.Provider>
  );
};

export default App;
