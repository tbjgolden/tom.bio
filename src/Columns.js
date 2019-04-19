import React from 'react';
import './Columns.scss';

const Columns = ({ children }) => {
  return (
    <div className='Columns'>
      {
        children.map((child, i) => {
          const { children, className, ...props } = child.props;
          return (
            <child.type key={i} className={`Columns-column ${className || ''}`} {...props}>
              {children}
            </child.type>
          );
        })
      }
    </div>
  );
};

export default Columns;
