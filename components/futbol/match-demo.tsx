import { Button } from "baseui/button";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { Select } from "baseui/select";
import React, { useEffect, useMemo, useState } from "react";
import { StatelessAccordion, Panel } from "baseui/accordion";
import Card from "components/card";
import {
  FixtureType,
  RANDOMIZER_DATA,
  RIVALRY_MAP,
  COMPETITIONS_MAP,
  COMPETITIONS,
  Competition,
  Team,
  Round, FIXTURE_TYPES
} from "./match-demo.data";

// ---

type Minute = {
  id: string;
  type: "firstHalf" | "secondHalf" | "firstHalfET" | "secondHalfET";
  time: string;
  whoScored: "H" | "A" | null;
};
type MatchReport = {
  id: string;
  winner: "H" | "A" | null;
  minutes: Minute[];
  htScore: [number, number] | null;
  ftScore: [number, number] | null;
  aetScore: [number, number] | null;
  aggScore: [number, number] | null;
  penalties: [number, number] | null;
};

function colorToBadge<T extends { colorA: string; colorB: string; pattern?: string }>({
  colorA,
  colorB,
}: T): {
  bg: string;
  fg: string;
  b: string;
} {
  // if (colorB === undefined) {
  //   const luminance =
  //     0.2126 * parseInt(colorA.slice(1, 3), 16) +
  //     0.7152 * parseInt(colorA.slice(3, 5), 16) +
  //     0.0722 * parseInt(colorA.slice(5, 7), 16);
  //
  //   colorB = luminance < 100 ? "#fff" : "#000";
  // }

  return {
    bg: colorA,
    fg: colorB,
    b: colorB,
  };
}

function Badge({ team, margin = 0 }: { team: Team; margin?: number | string }) {
  const { bg, fg, b } = colorToBadge(team);
  return (
    <>
      <div
        className="badge"
        style={{
          background: bg,
          color: fg,
          border: `1px solid ${b}`,
          margin,
        }}
      >
        {team.name}
      </div>
      <style jsx>{`
        .badge {
          font-size: 14px;
          display: inline-block;
          padding: 4px 8px;
          font-weight: bold;
          border-radius: 8px;
          font-variation-settings: "wght" 700;
        }
      `}</style>
    </>
  );
}

function generateMatchReport({
  requiresAWinner,
  prevScore,
  usesExtraTime = false,
  usesGoldenGoal = false,
  usesAwayGoals = false,
  usesAwayGoalsInET = false,
}: {
  prevScore?: [number, number];
  requiresAWinner: boolean;
  usesExtraTime?: boolean;
  usesGoldenGoal?: boolean;
  usesAwayGoals?: boolean;
  usesAwayGoalsInET?: boolean;
}): MatchReport {
  const minutes: Minute[] = [];

  let aetScore: [number, number] | null = null;
  let penalties: [number, number] | null = null;
  let winner: "H" | "A" | null = null;

  for (let i = 1; i <= 47; i++) {
    const time = i > 45 ? `45+${i - 45}` : `${i}`;
    const homeScored = Math.random() < RANDOMIZER_DATA.H1;
    const awayScored = Math.random() < RANDOMIZER_DATA.A1;
    const whoScored =
      homeScored && awayScored
        ? i % 2 === 1
          ? "H"
          : "A"
        : homeScored
        ? "H"
        : awayScored
        ? "A"
        : null;
    minutes.push({
      id: `${time}-${Math.random()}-${Math.random()}`,
      type: "firstHalf",
      time,
      whoScored,
    });
  }

  const htScore: [number, number] = minutes.reduce(
    ([h, a], { whoScored }) => {
      return [h + (whoScored === "H" ? 1 : 0), a + (whoScored === "A" ? 1 : 0)];
    },
    [0, 0]
  );

  for (let i = 46; i <= 96; i++) {
    const time = i > 90 ? `90+${i - 90}` : `${i}`;
    const homeScored = Math.random() < RANDOMIZER_DATA.H2;
    const awayScored = Math.random() < RANDOMIZER_DATA.A2;
    const whoScored =
      homeScored && awayScored
        ? i % 2 === 1
          ? "H"
          : "A"
        : homeScored
        ? "H"
        : awayScored
        ? "A"
        : null;
    minutes.push({
      id: `${time}-${Math.random()}-${Math.random()}`,
      type: "secondHalf",
      time,
      whoScored,
    });
  }

  const ftScore: [number, number] = minutes.reduce(
    ([h, a], { whoScored }) => {
      return [h + (whoScored === "H" ? 1 : 0), a + (whoScored === "A" ? 1 : 0)];
    },
    [0, 0]
  );

  let aggScore: [number, number] = [ftScore[0], ftScore[1]];
  if (prevScore !== undefined) {
    aggScore[0] += prevScore[0];
    aggScore[1] += prevScore[1];
  }

  if (aggScore[0] !== aggScore[1]) {
    winner = aggScore[0] > aggScore[1] ? "H" : "A";
  } else if (requiresAWinner) {
    if (
      usesAwayGoals &&
      prevScore !== undefined &&
      prevScore[0] !== ftScore[1]
    ) {
      // decided on away goals
      winner = prevScore[0] > ftScore[1] ? "H" : "A";
    } else {
      if (usesExtraTime) {
        continueIfNecessary: {
          for (let i = 91; i <= 106; i++) {
            const time = i > 105 ? `105+${i - 105}` : `${i}`;
            const homeScored = Math.random() < RANDOMIZER_DATA.H_ET;
            const awayScored = Math.random() < RANDOMIZER_DATA.A_ET;
            const whoScored =
              homeScored && awayScored
                ? i % 2 === 1
                  ? "H"
                  : "A"
                : homeScored
                ? "H"
                : awayScored
                ? "A"
                : null;
            minutes.push({
              id: `${time}-${Math.random()}-${Math.random()}`,
              type: "firstHalfET",
              time,
              whoScored,
            });
            if (usesGoldenGoal && whoScored !== null) {
              winner = whoScored;
              break continueIfNecessary;
            }
          }
          for (let i = 106; i <= 121; i++) {
            const time = i > 120 ? `120+${i - 120}` : `${i}`;
            const homeScored = Math.random() < RANDOMIZER_DATA.H_ET;
            const awayScored = Math.random() < RANDOMIZER_DATA.A_ET;
            const whoScored =
              homeScored && awayScored
                ? i % 2 === 1
                  ? "H"
                  : "A"
                : homeScored
                ? "H"
                : awayScored
                ? "A"
                : null;
            minutes.push({
              id: `${time}-${Math.random()}-${Math.random()}`,
              type: "secondHalfET",
              time,
              whoScored,
            });
            if (usesGoldenGoal && whoScored !== null) {
              winner = whoScored;
              break continueIfNecessary;
            }
          }
        }

        aetScore = minutes.reduce(
          ([h, a], { whoScored }) => {
            return [
              h + (whoScored === "H" ? 1 : 0),
              a + (whoScored === "A" ? 1 : 0),
            ];
          },
          [0, 0]
        );

        aggScore = [aetScore[0], aetScore[1]];
        if (prevScore !== undefined) {
          aggScore[0] += prevScore[0];
          aggScore[1] += prevScore[1];
        }

        if (aggScore[0] !== aggScore[1]) {
          // won in extra time
          winner = aggScore[0] > aggScore[1] ? "H" : "A";
        } else if (
          usesAwayGoalsInET &&
          prevScore !== undefined &&
          prevScore[0] !== aetScore[1]
        ) {
          // decided on away goals after extra time
          winner = prevScore[0] > aetScore[1] ? "H" : "A";
        }
      }

      if (winner === null) {
        // decided on penalties
        const rand = Math.random();
        let sum = 0;
        for (const [score, p] of RANDOMIZER_DATA.P) {
          sum += p;
          if (sum > rand) {
            penalties = [score[0], score[1]];
            winner = penalties[0] > penalties[1] ? "H" : "A";
            break;
          }
        }
      }
    }
  }

  return {
    id: `${Math.random()}-${Math.random()}`,
    winner,
    minutes,
    htScore,
    ftScore,
    aetScore,
    aggScore: prevScore === undefined ? null : aggScore,
    penalties,
  };
}

type StructuredMatchReport = Omit<MatchReport, "minutes"> & {
  secondHalfET: Minute[];
  secondHalf: Minute[];
  firstHalfET: Minute[];
  firstHalf: Minute[];
};

function generateFixtureReport({
  fixtureType,
  usesExtraTime,
  usesGoldenGoal,
  usesAwayGoals,
  usesAwayGoalsInET,
}: {
  fixtureType: FixtureType;
  usesExtraTime: boolean;
  usesGoldenGoal: boolean;
  usesAwayGoals: boolean;
  usesAwayGoalsInET: boolean;
}): StructuredMatchReport[] {
  // "single-draw" | "single-no-draw" | "2-leg" | "replay-1" | "replay-inf"
  const matches: MatchReport[] = [];
  if (fixtureType === "single-draw") {
    matches.push(generateMatchReport({ requiresAWinner: false }));
  } else if (fixtureType === "single-no-draw") {
    matches.push(
      generateMatchReport({
        requiresAWinner: true,
        usesExtraTime,
        usesGoldenGoal,
      })
    );
  } else if (fixtureType === "replay-1") {
    const firstMatch = generateMatchReport({
      requiresAWinner: false,
    });
    matches.push(firstMatch);
    if (firstMatch.ftScore[0] === firstMatch.ftScore[1]) {
      matches.push(
        generateMatchReport({
          requiresAWinner: true,
          usesExtraTime,
          usesGoldenGoal,
        })
      );
    }
  } else if (fixtureType === "replay-inf") {
    let match: ReturnType<typeof generateMatchReport>;
    do {
      match = generateMatchReport({
        requiresAWinner: false,
      });
      matches.push(match);
    } while (match.ftScore[0] === match.ftScore[1]);
  } else {
    // 2-leg
    const firstMatch = generateMatchReport({
      requiresAWinner: false,
    });
    matches.push(firstMatch);
    matches.push(
      generateMatchReport({
        requiresAWinner: true,
        // swap order - this together with swapping the home and away teams in the component makes everything add up
        prevScore: [firstMatch.ftScore[1], firstMatch.ftScore[0]],
        usesExtraTime,
        usesGoldenGoal,
        usesAwayGoals,
        usesAwayGoalsInET,
      })
    );
  }

  return matches.map(({ minutes, ...match }) => {
    const firstHalf = minutes.filter(({ type }) => type === "firstHalf");
    const secondHalf = minutes.filter(({ type }) => type === "secondHalf");
    const firstHalfET = minutes.filter(({ type }) => type === "firstHalfET");
    const secondHalfET = minutes.filter(({ type }) => type === "secondHalfET");

    return {
      ...match,
      firstHalf,
      secondHalf,
      firstHalfET: firstHalfET.length === 0 ? null : firstHalfET,
      secondHalfET: secondHalfET.length === 0 ? null : secondHalfET,
    };
  });
}

const Minute = ({
  time,
  whoScored,
  home,
  away,
}: {
  time: string;
  whoScored: "H" | "A" | null;
  home: Team;
  away: Team;
}) => {
  const minuteInt = time
    .split("+")
    .reduce((total, next) => total + parseInt(next), 0);
  const isMultipleOf5 = minuteInt % 5 === 0;
  const isMultipleOf10 = isMultipleOf5 && minuteInt % 2 === 0;
  const topClass = isMultipleOf10 ? "ten" : isMultipleOf5 ? "five" : "";
  const bottomClass = isMultipleOf10 ? "ten" : isMultipleOf5 ? "five" : "";

  const text = `${time}'`;
  const { suffix, team } = {
    "": {
      suffix: "",
      team: {
        colorA: "#ffffff",
        colorB: "#000000"
      },
    },
    H: {
      suffix: `GOAL!\n${home.name}`,
      team: home,
    },
    A: {
      suffix: `GOAL!\n${away.name}`,
      team: away,
    },
  }[whoScored || ""];
  const { bg, fg } = colorToBadge(team);

  return (
    <>
      <div
        key={time}
        className={`minute ${time.includes("+") ? "added-time" : ""}`}
      >
        <div
          className="popover"
          style={{
            background: bg,
            color: fg,
            filter: `drop-shadow(0 .5px 1px ${fg})`,
          }}
        >
          {text}
          <div className="suffix">{suffix}</div>
          <div
            className="popover-arrow"
            style={{
              borderTopColor: bg,
            }}
          />
        </div>
        <div
          className={`top-half ${whoScored === "H" ? "goal" : ""}`}
          style={{
            background: home.colorA,
          }}
        />
        <div
          className={`bottom-half ${whoScored === "A" ? "goal" : ""}`}
          style={{
            background: away.colorA.toLowerCase() === "#ffffff" ? "#777" : away.colorA,
          }}
        />
        <div className={`tick-top ${topClass}`} data-whoscored={whoScored} />
        <div
          className={`tick-bottom ${bottomClass}`}
          data-whoscored={whoScored}
        />
      </div>
      <style jsx>{`
        .minute {
          user-select: none;
          position: relative;
          height: 24px;
          flex: 1 0 1px;
          background: #fff;
        }

        .minute.added-time {
          background: #ccc;
        }

        .popover-arrow {
          display: block;
          position: absolute;
          left: 50%;
          top: 100%;
          transform: translate(-50%, 0);
          border: 5px solid transparent;
        }

        .popover {
          display: none;
          position: absolute;
          white-space: pre;
          text-align: center;
          left: calc(50% - 1px);
          transform: translate(-50%, 0);
          bottom: calc(100% + 5px);
          border-radius: 4px;
          padding: 4px 6px;
          font-size: 80%;
        }

        .suffix {
          font-size: 90%;
          font-weight: bold;
          font-variation-settings: "wght" 700;
          margin: 3px 0 1px;
        }

        .minute:hover .popover,
        .minute:active .popover {
          display: inline-block;
        }

        .top-half {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          opacity: 0.3;
        }
        .bottom-half {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          opacity: 0.3;
        }
        .top-half.goal,
        .bottom-half.goal {
          opacity: 1;
        }
        .tick-top,
        .tick-bottom {
          position: absolute;
          right: calc(50% - 1px);
          height: 1px;
          width: 1px;
          background: #777;
        }
        .tick-top {
          bottom: 50%;
        }
        .tick-bottom {
          top: 50%;
        }
        .tick-top.five,
        .tick-bottom.five {
          height: 2px;
        }
        .tick-top.ten,
        .tick-bottom.ten {
          height: 3px;
        }

        .minute:hover .tick-top,
        .minute:active .tick-top {
          left: 1px;
          right: 1px;
          width: auto;
          height: auto;
        }
        .minute:hover .tick-top::before,
        .minute:active .tick-top::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding-top: 100%;
          background: #777;
          transform: translate(0, -50%);
        }
        .minute:hover .tick-bottom,
        .minute:active .tick-bottom {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          width: auto;
          height: auto;
          background: rgba(30, 30, 30, 0.3);
        }
      `}</style>
    </>
  );
};

const Timeline = ({
  home,
  away,
  x,
}: {
  home: Team;
  away: Team;
  x: StructuredMatchReport;
}) => {
  return (
    <div className="timeline">
      <div className="first-half">
        {x.firstHalf.map(({ id, whoScored, time }) => (
          <Minute
            key={id}
            time={time}
            whoScored={whoScored}
            home={home}
            away={away}
          />
        ))}
      </div>
      <div
        className="break"
        data-before="HT"
        data-after={x.htScore.join(" - ")}
      />
      <div className="second-half">
        {x.secondHalf.map(({ id, whoScored, time }) => (
          <Minute
            key={id}
            time={time}
            whoScored={whoScored}
            home={home}
            away={away}
          />
        ))}
      </div>
      {x.firstHalfET ? (
        <>
          <div
            className="break"
            data-before="FT"
            data-after={x.ftScore.join(" - ")}
          />
          <div className="first-half-et">
            {x.firstHalfET.map(({ id, whoScored, time }) => (
              <Minute
                key={id}
                time={time}
                whoScored={whoScored}
                home={home}
                away={away}
              />
            ))}
          </div>
        </>
      ) : null}
      {x.secondHalfET ? (
        <>
          <div className="break" />
          <div className="second-half-et">
            {x.secondHalfET.map(({ id, whoScored, time }) => (
              <Minute
                key={id}
                time={time}
                whoScored={whoScored}
                home={home}
                away={away}
              />
            ))}
          </div>
        </>
      ) : null}
      {x.penalties ? (
        <>
          {
            <div
              className="break"
              data-before={x.aetScore ? "AET" : "FT"}
              data-after={(x.aetScore || x.ftScore).join(" - ")}
            />
          }
          <div className="penalties">{x.penalties.join(" - ")}</div>
        </>
      ) : null}

      <style jsx>{`
        .timeline {
          line-height: 1;
          width: 100%;
          display: flex;
          align-items: center;
          border-top: 1px solid #ccc;
          padding-top: 16px;
        }

        .first-half,
        .second-half,
        .first-half-et,
        .second-half-et,
        .penalties {
          display: flex;
          border: 1px solid #777;
        }

        .first-half {
          flex: 47 0 0;
        }
        .second-half {
          flex: 51 0 0;
        }
        .first-half-et {
          flex: 16 0 0;
        }
        .second-half-et {
          flex: 16 0 0;
        }

        .penalties {
          padding: 1px 4px;
          font-size: 75%;
        }

        .break {
          position: relative;
          border: dotted #333;
          border-width: 0 0 1px;
          flex: 0 0 32px;
          font-size: 75%;
          text-align: center;
        }

        .break::before {
          bottom: 2px;
          left: 50%;
          transform: translate(-50%, 0);
          position: absolute;
          content: attr(data-before);
          width: 100%;
        }
        .break::after {
          top: 2px;
          left: 50%;
          transform: translate(-50%, 0);
          position: absolute;
          content: attr(data-after);
          width: 100%;
        }

        .break:not([data-before]) {
          flex-basis: 4px;
        }
        
        @media (max-width: 480px) {
          .break[data-before="HT"] {
            flex-basis: 4px;
          }
          .break[data-before="HT"]::before,
          .break[data-before="HT"]::after {
            content: none;
          }
        }
      `}</style>
    </div>
  );
};

const Match = ({
  home,
  away,
  len,
  i,
  x,
  usesNeutralVenue
}: {
  home: Team;
  away: Team;
  len: number;
  i: number;
  x: StructuredMatchReport;
  usesNeutralVenue: boolean
}) => {
  let resultMessage: string | null = null;
  if (i === len - 1) {
    if (x.winner === null) {
      resultMessage = "Draw";
    } else {
      const winningTeam = x.winner === "H" ? home : away;
      resultMessage = `${winningTeam.name} win`;

      if (x.penalties) {
        resultMessage += ` ${
          x.penalties[0] > x.penalties[1]
            ? x.penalties.join("-")
            : `${x.penalties[1]}-${x.penalties[0]}`
        } on penalties`;
      } else {
        if (x.aetScore) {
          resultMessage += ` after extra time`;
        }
        if (x.aggScore && (x.aggScore[0] === x.aggScore[1])) {
          resultMessage += ` on away goals`
        }
      }
    }

    if (x.aggScore !== null) {
      resultMessage = `Agg ${x.aggScore.join(
        "-"
      )} \u00a0\u00b7\u00a0 ${resultMessage}`;
    }
  }

  return (
    <div style={{ marginTop: i === 0 ? 0 : 16 }}>
      <div style={{
        margin: "16px 0 0"
      }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {len > 1 || !usesNeutralVenue ? (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: "80%",
                marginBottom: 8,
              }}
            >
              {len === 1 ? null : `Match ${i + 1} - `}
              {home.stadium}{home.city ? ` (${home.city})` : null}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: "1 1 1px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Badge team={home} margin="0 8px 0 0" />
            </div>
            <div
              style={{
                margin: "0 8px",
                fontSize: "90%",
                minWidth: 64,
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              {x.aetScore ? <div>AET</div> : null}
              <div style={{ fontSize: "180%" }}>
                {(x.aetScore || x.ftScore).join(" - ")}
              </div>
              <div style={{ marginTop: 4 }}>HT {x.htScore.join(" - ")}</div>
              {x.aetScore ? <div>FT {x.ftScore.join(" - ")}</div> : null}
            </div>
            <div style={{ flex: "1 1 1px" }}>
              <Badge team={away} margin="0 0 0 8px" />
            </div>
          </div>
          <div style={{ margin: "16px 0 0" }} />
          <Timeline home={home} away={away} x={x} />
          {resultMessage ? (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: "80%",
                marginTop: 16,
                borderTop: "1px solid #ccc",
                paddingTop: 16,
              }}
            >
              {resultMessage}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const RandomFixtureReport = ({
  home,
  away,
  round,
  randomizeTeams
}: {
  home: Team;
  away: Team;
  round: Round;
  randomizeTeams?: null | (() => void)
}) => {
  const {
    fixtureType,
    usesExtraTime,
    usesAwayGoalsInET,
    usesGoldenGoal,
    usesAwayGoals,
  } = round.rules

  const [regenerate, setRegenerate] = useState(0);
  const fixtureReport = useMemo(() => {
    return generateFixtureReport({
      fixtureType,
      usesExtraTime,
      usesAwayGoalsInET,
      usesGoldenGoal,
      usesAwayGoals,
    });
  }, [
    fixtureType,
    usesExtraTime,
    usesAwayGoalsInET,
    usesGoldenGoal,
    usesAwayGoals,
    regenerate,
  ]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontSize: "120%",
            fontWeight: 700,
            fontVariationSettings: '"wght" 700',
            marginRight: 16
          }}
        >
          Example <span style={{ display: "inline-block" }}>Match Report</span>
        </h3>
        <div>
          <Button size="compact" onClick={() => {
            setRegenerate(regenerate + 1)
            if (randomizeTeams) {
              randomizeTeams()
            }
          }}>
            Regenerate
          </Button>
        </div>
      </div>
      <hr />
      {fixtureReport.map((x, i) => (
        <Match
          key={x.id}
          usesNeutralVenue={round.usesNeutralVenue}
          home={i % 2 === 0 ? home : away}
          away={i % 2 === 0 ? away : home}
          len={fixtureReport.length}
          i={i}
          x={x}
        />
      ))}
    </div>
  );
};

const ContentOverride = {
  Content: {
    style: {
      borderTop: "1px solid rgb(203, 203, 203)",
      padding: "20px",
      background: "#fafafa"
    }
  }
}

type Fixture = [{ label: string, id: FixtureType }]

const MatchDemo = (): JSX.Element => {
  const [regenerate, setRegenerate] = useState(0);
  const [expanded, setExpanded] = React.useState<React.Key[]>([
    '0',
  ]);

  const [competition, setCompetition] = useState<[Competition]>([
    COMPETITIONS[0],
  ]);
  const { teamA, teamB, competitionData } = useMemo(() => {
    const competitionData = COMPETITIONS_MAP[competition[0].id]
    let teamA: Team
    let teamB: Team
    let rivalry: string | null = null
    if (competitionData.teams.length === 2) {
      teamA = competitionData.teams[0]
      teamB = competitionData.teams[1]
    } else {
      const noOfTeams = competitionData.teams.length
      const firstIndex = Math.floor(Math.random() * noOfTeams)
      let secondIndex = Math.floor(Math.random() * (noOfTeams - 1))
      if (secondIndex >= firstIndex) secondIndex += 1
      teamA = competitionData.teams[firstIndex]
      teamB = competitionData.teams[secondIndex]
      const rivalryId = (teamA.id < teamB.id) ? `${teamA.id}_${teamB.id}` : `${teamB.id}_${teamA.id}`
      rivalry = RIVALRY_MAP[rivalryId]?.description || null
    }
    return {
      teamA,
      teamB,
      rivalry,
      competitionData
    }
  }, [competition, regenerate])
  const [roundIndex, setRoundIndex] = useState<number>(0);
  const round = competitionData.rounds[
    roundIndex < competitionData.rounds.length ? roundIndex : 0
  ]

  useEffect(() => {
    if (competitionData.rounds.length > 0) {
      setRoundIndex(0)
    }
  }, [competitionData])


  const [fixtureType, setFixtureType] = useState<Fixture>([
    { label: "Single match", id: "single-draw" },
  ]);
  const fixtureTypeId = fixtureType[0].id;

  const [usesExtraTime, setUsesExtraTime] = useState(true);
  const [usesGoldenGoal, setUsesGoldenGoal] = useState(false);
  const [_usesAwayGoals, setUsesAwayGoals] = useState(true);
  const [_usesAwayGoalsInET, setUsesAwayGoalsInET] = useState(true);
  const usesAwayGoals = _usesAwayGoals && fixtureTypeId === "2-leg";
  const usesAwayGoalsInET =
    _usesAwayGoalsInET && usesExtraTime && usesAwayGoals;

  const hasOptions =
    fixtureTypeId !== "single-draw" && fixtureTypeId !== "replay-inf";

  return (
    <div>
      <div style={{ border: "1px solid #ccc", borderBottom: 0 }}>
        <StatelessAccordion
          expanded={expanded}
          onChange={({ key }) => {
            setExpanded([key]);
          }}
        >
          <Panel key="0" title="Competition Selector" overrides={ContentOverride}>
            <Select
              searchable={false}
              clearable={false}
              options={COMPETITIONS.map(({ id }) => ({ id }))}
              value={competition}
              onChange={(params) => {
                if (params.value.length === 1) {
                  setCompetition(params.value as [Competition]);
                }
              }}
              getOptionLabel={({ option }): JSX.Element => {
                const id = `${option?.id ?? ""}`
                const competition = COMPETITIONS_MAP[id]
                return (
                  <div>
                    <div>{competition.name}</div>
                    <div style={{ fontSize: "80%" }}>{competition.shortDescription}</div>
                  </div>
                );
              }}
              getValueLabel={({ option }): JSX.Element => {
                const id = `${option?.id ?? ""}`
                const competition = COMPETITIONS_MAP[id]
                return (
                  <div>
                    <div>{competition.name}</div>
                    <div style={{ fontSize: "80%" }}>{competition.shortDescription}</div>
                  </div>
                );
              }}
            />

            {competitionData.rounds.length >= 2 ? (
              <div style={{ marginTop: 8 }}>
                <Select
                  size="compact"
                  searchable={false}
                  clearable={false}
                  options={competitionData.rounds.map(({ id, round }, i) => ({ id, label: round, i }))}
                  value={[
                    competitionData.rounds[roundIndex]
                  ]}
                  onChange={(params) => {
                    if (params.value.length === 1) {
                      setRoundIndex(params.value[0].i);
                    }
                  }}
                />
              </div>
            ) : null}
          </Panel>
          <Panel key="1" title="Sandbox" overrides={ContentOverride}>
            <Select
              size="compact"
              searchable={false}
              clearable={false}
              options={FIXTURE_TYPES.map(([id, label]) => ({
                label,
                id,
              }))}
              value={fixtureType}
              onChange={(params) => {
                setFixtureType(params.value as Fixture);
              }}
            />
            <div style={{ marginTop: hasOptions ? 8 : 0 }}>
              {fixtureTypeId === "2-leg" ? (
                <>
                  <Checkbox
                    checked={usesAwayGoals}
                    onChange={(event) => {
                      const target = event.target as HTMLInputElement & {
                        checked: boolean;
                      };
                      setUsesAwayGoals(target.checked);
                    }}
                    labelPlacement={LABEL_PLACEMENT.right}
                  >
                    Uses away goals rule
                  </Checkbox>
                  {usesExtraTime && usesAwayGoals ? (
                    <>
                      <Checkbox
                        checked={usesAwayGoalsInET}
                        onChange={(event) => {
                          const target = event.target as HTMLInputElement & {
                            checked: boolean;
                          };
                          setUsesAwayGoalsInET(target.checked);
                        }}
                        labelPlacement={LABEL_PLACEMENT.right}
                      >
                        Uses away goals rule in extra time
                      </Checkbox>
                    </>
                  ) : null}
                </>
              ) : null}
              {fixtureTypeId === "single-draw" ||
              fixtureTypeId === "replay-inf" ? null : (
                <>
                  <Checkbox
                    checked={usesExtraTime}
                    onChange={(event) => {
                      const target = event.target as HTMLInputElement & {
                        checked: boolean;
                      };
                      setUsesExtraTime(target.checked);
                    }}
                    labelPlacement={LABEL_PLACEMENT.right}
                  >
                    Extra time (in event of a draw)
                  </Checkbox>
                  {usesExtraTime ? (
                    <>
                      <Checkbox
                        checked={usesGoldenGoal}
                        onChange={(event) => {
                          const target = event.target as HTMLInputElement & {
                            checked: boolean;
                          };
                          setUsesGoldenGoal(target.checked);
                        }}
                        labelPlacement={LABEL_PLACEMENT.right}
                      >
                        Extra time uses golden goal rule
                      </Checkbox>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </Panel>
        </StatelessAccordion>
      </div>

      <div style={{ marginTop: 16 }}>
        {/*{rivalry ? <div style={{ marginBottom: 16 }}>{rivalry}</div> : null}*/}
        <Card style={{ borderColor: "#000", padding: 16 }}>
          <RandomFixtureReport
            home={teamA}
            away={teamB}
            round={
              expanded[0] === '0' ? round : {
                id: `Sandbox_${Math.random()}`,
                round: "Sandbox",
                usesNeutralVenue: (
                  fixtureTypeId === "single-no-draw" ||
                  fixtureTypeId === "replay-1" ||
                  fixtureTypeId === "replay-inf"
                ),
                rules: {
                  fixtureType: fixtureTypeId,
                  usesExtraTime,
                  usesGoldenGoal,
                  usesAwayGoals,
                  usesAwayGoalsInET
                }
              }
            }
            randomizeTeams={
              competitionData.teams.length > 2 ? () => {
                setRegenerate(regenerate + 1)
              } : null
            }
          />
        </Card>
      </div>
    </div>
  );
};

export default MatchDemo;
