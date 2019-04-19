import React from 'react';
import './Period.scss';

export default ({ beginMonth, beginYear, endMonth, endYear }) => {
  const finished = endMonth && endYear;
  if (!finished) {
    const now = new Date();
    endMonth = now.getMonth() + 1;
    endYear = now.getFullYear();
  }

  let totalMonths = (12 * (endYear - beginYear)) + (endMonth - beginMonth);
  if (totalMonths < 6) totalMonths++;

  const years = ~~(totalMonths / 12);
  const months = totalMonths - (years * 12);

  const durationLine = [
    [' ', '1 year'][years] || `${years} years`,
    [' ', '1 month'][months] || `${months} months`
  ].filter(str => str.trim()).join(', ');

  return (
    <div>
      <div className='App-row-description'>
        <div className='Period-dates'>
          {padIntToTwoDigits(beginMonth)}/{padIntToTwoDigits(beginYear)}
          {' – '}
          {
            finished
              ? `${padIntToTwoDigits(endMonth)}/${padIntToTwoDigits(endYear)}`
              : '?'
          }
        </div>
        <div className='Period-duration'>
          ({durationLine})
        </div>
      </div>
    </div>
  );
};

function padIntToTwoDigits (n) {
  return n > 10 ? n : `0${n}`;
}
