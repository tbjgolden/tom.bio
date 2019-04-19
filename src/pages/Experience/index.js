import React from 'react';
import Jumbotron from '../../Jumbotron';
import Columns from '../../Columns';
import Filters from './Filters';
import './index.scss';

const Experience = () => (
  <div className='Experience'>
    <Jumbotron>
      <div className='App-row background-cover white-text Experience-jumbotron' style={{
        backgroundImage: `url('images/experience.jpg')`
      }}>
        <div className='App-row-sizer'>
          <div className='App-row-title'>Experience</div>
        </div>
      </div>
    </Jumbotron>

    <div className='App-row Experience-foreword white'>
      <div className='App-row-sizer'>
        <div className='App-row-header'>
          A quick summary
        </div>
        <Columns>
          <div>
            <div className='App-row-description'>
              My main expertise as a programmer is with web technologies, particularly the design and
              user experience of websites.
            </div>
          </div>
          <div>
            <div className='App-row-description'>
              While I have a degree in computer science from a prestigious university and a strong
              background in mathematics, my natural strength is making high-quality websites that scale
              well and best achieve their purpose.
            </div>
          </div>
          <div>
            <div className='App-row-description'>
              I have been working in various capacities on websites since I was 7, when I got my
              hands on a copy of Dreamweaver that my father had for his early online business. Since then,
              it has become a hobby, an obsession, and a career that I love doing.
            </div>
          </div>
        </Columns>
      </div>
    </div>

    <Filters />
  </div>
);

export default Experience;
