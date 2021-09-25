import { useEffect, useState } from "react";
import { endOfDay, differenceInDays, parseISO } from "date-fns";

const flightDate = parseISO("2021-10-15T18:20-05");

export default function Experiments(): JSX.Element {
  const [daysUntilMove, setDaysUntilMove] = useState(
    differenceInDays(flightDate, new Date())
  );

  useEffect(() => {
    let timeout;
    const updateDate = () => {
      const now = new Date();
      setDaysUntilMove(differenceInDays(flightDate, now));
      const dayEnd = endOfDay(now);

      timeout = setTimeout(() => {
        updateDate();
      }, dayEnd.getTime() + 1000 - now.getTime());
    };
    updateDate();
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section>
      <div id="calendar">
        {daysUntilMove > 0 ? (
          <>
            <div className="inner">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141 146">
                <path d="M13.3 126.4v-89c0-2.4.9-4.5 2.6-6.3 1.7-1.8 3.8-2.6 6.2-2.6h8.8v-6.7c0-3.1 1.1-5.7 3.2-7.9 2.2-2.2 4.7-3.3 7.8-3.3h4.4c3 0 5.6 1.1 7.8 3.3 2.2 2.2 3.2 4.8 3.2 7.9v6.7h26.4v-6.7c0-3.1 1.1-5.7 3.2-7.9 2.2-2.2 4.7-3.3 7.8-3.3h4.4c3 0 5.6 1.1 7.8 3.3 2.2 2.2 3.2 4.8 3.2 7.9v6.7h8.8c2.4 0 4.4.9 6.2 2.6 1.7 1.8 2.6 3.8 2.6 6.3v88.9c0 2.4-.9 4.5-2.6 6.3-1.7 1.8-3.8 2.6-6.2 2.6H22.1c-2.4 0-4.4-.9-6.2-2.6-1.7-1.8-2.6-3.8-2.6-6.2zm8.8 0h96.8V55.2H22.1v71.2zm17.6-84.5c0 .6.2 1.2.6 1.6.4.4.9.6 1.6.6h4.4c.6 0 1.2-.2 1.6-.6.4-.4.6-.9.6-1.6v-20c0-.6-.2-1.2-.6-1.6-.4-.4-.9-.6-1.6-.6h-4.4c-.6 0-1.2.2-1.6.6-.4.4-.6 1-.6 1.6v20zm52.8 0c0 .6.2 1.2.6 1.6.4.4.9.6 1.6.6h4.4c.6 0 1.2-.2 1.6-.6.4-.4.6-.9.6-1.6v-20c0-.6-.2-1.2-.6-1.6-.4-.4-.9-.6-1.6-.6h-4.4c-.6 0-1.2.2-1.6.6-.4.4-.6 1-.6 1.6v20z" />
              </svg>

              <div className="page">
                <strong className="big">{daysUntilMove}</strong>
                <strong>days until move</strong>
              </div>
            </div>
            <br />
            Moving to London
            <br />
            <small>(flight date: {flightDate.toLocaleDateString()})</small>
          </>
        ) : (
          <strong className="big">
            {daysUntilMove === 0
              ? "Moving Day! 🎉"
              : `Moved on ${flightDate.toLocaleDateString()}!`}
          </strong>
        )}
      </div>
      <style jsx>{`
        #calendar {
          padding: 24px;
          text-align: center;
        }

        #calendar svg {
          width: 240px;
          height: auto;
        }

        #calendar .inner {
          position: relative;
          display: inline-block;
        }

        #calendar .page {
          position: absolute;
          top: 100px;
          left: 42px;
          right: 42px;
          bottom: 46px;
          display: flex;
          overflow-y: auto;
          flex-direction: column;
        }

        strong {
          font-weight: 700;
          font-variation-settings: "wght" 700;
        }

        strong.big {
          font-size: 48px;
        }

        small {
          font-size: 80%;
        }
      `}</style>
    </section>
  );
}
