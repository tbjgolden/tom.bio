import { Button } from "baseui/button";
import { Card } from "baseui/card";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { Option, Select } from "baseui/select";
import React, { useEffect, useMemo, useState } from "react";
import TeamLogo, { TeamLogoProps } from "./team-logo";

/**
 * - set up with dropdown to select competition
 * - away goals not working for some reason
 */

const fixtureTypesMap = {
  "single-draw": "Single match",
  "single-no-draw": "Single match (no draw)",
  "2-leg": "2-legged fixture (2 matches with scores added)",
  "replay-1": "Replay once in case of a draw",
  "replay-inf": "Replay until a team wins",
};
const fixtureTypes = Object.entries(fixtureTypesMap);

type FixtureType =
  | "single-draw"
  | "single-no-draw"
  | "2-leg"
  | "replay-1"
  | "replay-inf";

type Fixture = [{ label: string; id: FixtureType }];
type FixtureConfig = {
  fixtureType: FixtureType;
  usesExtraTime: boolean;
  usesGoldenGoal: boolean;
  usesAwayGoals: boolean;
  usesAwayGoalsInET: boolean;
};

const competitionsMap: Record<
  string,
  {
    label: string;
    description: string;
    stages?: string;
    home: Team;
    away: Team;
    config: FixtureConfig;
  }
> = {
  "animal-league": {
    label: "Animal League",
    description: "Fictional match in a fictional league",
    home: {
      name: "FC Kangaroo",
      logo: { type: "kangaroo" },
      location: "Australia",
      stadium: "Outback Stadium",
      color: "#cb0707",
    },
    away: {
      name: "Penguin FC",
      logo: { type: "penguin" },
      location: "Antarctica",
      stadium: "Igloo Arena",
      color: "#1100a2",
    },
    config: {
      fixtureType: "single-draw",
      usesExtraTime: false,
      usesGoldenGoal: false,
      usesAwayGoals: false,
      usesAwayGoalsInET: false,
    },
  },
  "world-cup-final": {
    label: "World Cup",
    stages: "Final",
    description: "The most-watched sporting event in the world",
    home: {
      name: "France",
      logo: { type: "kangaroo" },
      location: "Qatar",
      stadium: "Lusail Stadium",
      color: "#1100a2",
    },
    away: {
      name: "Brazil",
      logo: { type: "penguin" },
      location: "Qatar",
      stadium: "Lusail Stadium",
      color: "#ffcc00",
    },
    config: {
      fixtureType: "single-no-draw",
      usesExtraTime: true,
      usesGoldenGoal: false,
      usesAwayGoals: false,
      usesAwayGoalsInET: false,
    },
  },
  "champions-league-final": {
    label: "UEFA Champions League",
    stages: "Final",
    description: "The most-watched annual sporting event in the world",
    home: {
      name: "FC Bayern Munich",
      logo: { type: "kangaroo" },
      location: "Lisbon, Portugal",
      stadium: "Estádio da Luz",
      color: "#cb0707",
    },
    away: {
      name: "Chelsea FC",
      logo: { type: "penguin" },
      location: "Lisbon, Portugal",
      stadium: "Estádio da Luz",
      color: "#1100a2",
    },
    config: {
      fixtureType: "single-no-draw",
      usesExtraTime: true,
      usesGoldenGoal: false,
      usesAwayGoals: false,
      usesAwayGoalsInET: false,
    },
  },
  "champions-league-knockout": {
    label: "UEFA Champions League",
    stages: "R16, QF, SF",
    description: "",
    home: {
      name: "Manchester City",
      logo: { type: "kangaroo" },
      location: "Manchester, England",
      stadium: "Etihad Stadium",
      color: "#95c6e7",
    },
    away: {
      name: "Atletico Madrid",
      logo: { type: "penguin" },
      location: "Madrid, Spain",
      stadium: "Wanda Metropolitano",
      color: "#ed0707",
    },
    config: {
      fixtureType: "2-leg",
      usesExtraTime: true,
      usesGoldenGoal: false,
      usesAwayGoals: true,
      usesAwayGoalsInET: true,
    },
  },
};
const competitions = Object.entries(competitionsMap);
type Competition = [{ label: string; id: keyof typeof competitionsMap }];

const getCompetitionValue = ({
  option,
}: {
  option?: Option;
}): React.ReactNode => {
  const competition =
    competitionsMap[option.id] ?? competitions["animal-league"];
  return (
    <>
      <div
        style={{
          fontSize: competition.stages ? "80%" : "",
          lineHeight: competition.stages ? 1 : "",
        }}
      >
        {competition.label}
      </div>
      {competition.stages ? (
        <div
          style={{
            fontSize: "70%",
            color: "#777",
            lineHeight: 1,
          }}
        >
          {competition.stages}
        </div>
      ) : null}
    </>
  );
};
const getCompetitionLabel = ({
  option,
}: {
  option?: Option;
}): React.ReactNode => {
  const competition =
    competitionsMap[option.id] ?? competitions["animal-league"];
  return (
    <>
      <div
        style={{
          fontSize: "90%",
          lineHeight: 1.2,
        }}
      >
        {competition.label}
        {competition.stages ? ` - ${competition.stages}` : null}
      </div>
      {competition.description ? (
        <div
          style={{
            fontSize: "80%",
            color: "#777",
            lineHeight: 1,
          }}
        >
          {competition.description}
        </div>
      ) : null}
    </>
  );
};

const RANDOMIZER_DATA = {
  H1: 0.009171959551498122,
  A1: 0.005876036986981905,
  H2: 0.02267865416654344,
  A2: 0.015393487711826812,
  H_ET: 0.03731004395141018,
  A_ET: 0.025324770106553787,
  P: [
    [[4, 3], 0.14705882352941177],
    [[3, 2], 0.11764705882352941],
    [[5, 4], 0.08823529411764706],
    [[4, 1], 0.08823529411764706],
    [[3, 4], 0.08823529411764706],
    [[1, 3], 0.058823529411764705],
    [[4, 2], 0.058823529411764705],
    [[2, 3], 0.058823529411764705],
    [[6, 5], 0.058823529411764705],
    [[2, 4], 0.029411764705882353],
    [[1, 4], 0.029411764705882353],
    [[6, 7], 0.029411764705882353],
    [[9, 8], 0.029411764705882353],
    [[5, 6], 0.029411764705882353],
    [[4, 5], 0.029411764705882353],
    [[8, 7], 0.029411764705882353],
    [[5, 3], 0.02941176470588235],
  ] as [[number, number], number][],
};

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

function colorToBadge(color: string): {
  bg: string;
  fg: string;
  b: string;
} {
  const sum = [color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)].reduce(
    (a, b) => a + parseInt(b, 16),
    0
  );
  const fg = sum > 300 ? "#000000" : "#ffffff";
  const b = fg === "#ffffff" ? "transparent" : "#ffffff";

  return {
    bg: color,
    fg,
    b,
  };
}

function Badge({
  team: { name, color },
  margin = 0,
}: {
  team: Team;
  margin?: number | string;
}) {
  const { bg, fg, b } = colorToBadge(color);
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
        {name}
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
      winner = prevScore[0] > ftScore[1] ? "A" : "H";
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
          winner = prevScore[0] > aetScore[1] ? "A" : "H";
        }
      }

      if (winner === null) {
        // decided on penalties
        let rand = Math.random();
        let sum = 0;
        for (const [score, p] of RANDOMIZER_DATA.P) {
          sum += p;
          if (sum > rand) {
            penalties = score;
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

type Team = {
  name: string;
  logo: TeamLogoProps;
  location: string;
  stadium: string;
  color: string;
};

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
  const { suffix, color } = {
    "": {
      suffix: "",
      color: "#ffffff",
    },
    H: {
      suffix: `GOAL!\n${home.name}`,
      color: home.color,
    },
    A: {
      suffix: `GOAL!\n${away.name}`,
      color: away.color,
    },
  }[whoScored || ""];
  const { bg, fg } = colorToBadge(color);

  return (
    <>
      <div
        key={time}
        className="minute"
        style={{
          background: time.includes("+") ? "#ccc" : "#fff",
        }}
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
          className="top-half"
          style={{
            background: home.color,
            opacity: whoScored === "H" ? 1 : 0.3,
          }}
        />
        <div
          className="bottom-half"
          style={{
            background: away.color,
            opacity: whoScored === "A" ? 1 : 0.3,
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
          width: 3px;
          height: 24px;
          flex: 1 0 auto;
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

        .minute:hover .popover {
          display: inline-block;
        }

        .top-half {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
        }
        .bottom-half {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
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

        .minute:hover .tick-top {
          left: 1px;
          right: 1px;
          width: auto;
          height: auto;
        }
        .minute:hover .tick-top::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding-top: 100%;
          background: #777;
          transform: translate(0, -50%);
        }
        .minute:hover .tick-bottom {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          width: auto;
          height: auto;
          background: rgba(127, 127, 127, 0.3);
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
        {x.secondHalf.map(({ id, whoScored, time }, i) => (
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
            {x.firstHalfET.map(({ id, whoScored, time }, i) => (
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
            {x.secondHalfET.map(({ id, whoScored, time }, i) => (
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
          flex: 47 0 auto;
        }
        .second-half {
          flex: 51 0 auto;
        }
        .first-half-et {
          flex: 16 0 auto;
        }
        .second-half-et {
          flex: 16 0 auto;
        }

        .penalties {
          padding: 1px 4px;
          font-size: 75%;
        }

        .break {
          position: relative;
          border: dotted #333;
          border-width: 0 0 1px;
          width: 32px;
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
          width: 4px;
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
}: {
  home: Team;
  away: Team;
  len: number;
  i: number;
  x: StructuredMatchReport;
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
      } else if (x.aetScore) {
        resultMessage += ` after extra time`;
      } else {
        resultMessage += "s";
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
      <Card>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: "80%",
              marginBottom: 8,
            }}
          >
            {len === 1 ? null : `Match ${i + 1} - `}
            {home.stadium} ({home.location})
          </div>
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
            <TeamLogo {...home.logo} size={5} />
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
            <TeamLogo {...away.logo} size={5} />
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
      </Card>
    </div>
  );
};

const RandomFixtureReport = ({
  home = competitionsMap["animal-league"].home,
  away = competitionsMap["animal-league"].away,
  fixtureType,
  usesExtraTime,
  usesAwayGoalsInET,
  usesGoldenGoal,
  usesAwayGoals,
}: {
  home?: Team;
  away?: Team;
  fixtureType: FixtureType;
  usesExtraTime: boolean;
  usesAwayGoalsInET: boolean;
  usesGoldenGoal: boolean;
  usesAwayGoals: boolean;
}) => {
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
          }}
        >
          Example Match Report
        </h3>
        <div>
          <Button size="compact" onClick={() => setRegenerate(regenerate + 1)}>
            Regenerate
          </Button>
        </div>
      </div>
      <hr />
      {fixtureReport.map((x, i) => (
        <Match
          key={x.id}
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

const MatchDemo = () => {
  const [_competition, setCompetition] = useState<Competition | []>([]);
  const competitionId: string =
    _competition.length === 0 ? "" : _competition[0].id;

  const [fixtureType, setFixtureType] = useState<Fixture>([
    { label: "Single Match", id: "single-draw" },
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

  useEffect(() => {
    const _competitionId = competitionId || "animal-league";

    const {
      config: {
        fixtureType,
        usesExtraTime,
        usesGoldenGoal,
        usesAwayGoals,
        usesAwayGoalsInET,
      },
    } = competitionsMap[_competitionId];
    setFixtureType([
      {
        label: fixtureTypesMap[fixtureType],
        id: fixtureType,
      },
    ]);
    setUsesExtraTime(usesExtraTime);
    setUsesGoldenGoal(usesGoldenGoal);
    setUsesAwayGoals(usesAwayGoals);
    setUsesAwayGoalsInET(usesAwayGoalsInET);
  }, [competitionId]);

  return (
    <Card>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            flex: "1 1 200px",
          }}
        >
          <Select
            placeholder="Select competition"
            options={competitions.map(([id, { label }]) => ({
              label,
              id,
            }))}
            value={_competition}
            onChange={(params) => {
              setCompetition(params.value as Competition);
            }}
            getValueLabel={getCompetitionValue}
            getOptionLabel={getCompetitionLabel}
          />
        </div>
        <div
          style={{
            flex: "1 1 200px",
          }}
        >
          <Select
            searchable={false}
            clearable={false}
            options={fixtureTypes.map(([id, label]) => ({
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
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Card
          overrides={{
            Root: {
              style: {
                borderColor: "#000",
              },
            },
          }}
        >
          <RandomFixtureReport
            home={competitionsMap[competitionId || "animal-league"].home}
            away={competitionsMap[competitionId || "animal-league"].away}
            fixtureType={fixtureTypeId}
            usesExtraTime={usesExtraTime}
            usesAwayGoalsInET={usesAwayGoalsInET}
            usesGoldenGoal={usesGoldenGoal}
            usesAwayGoals={usesAwayGoals}
          />
        </Card>
      </div>
    </Card>
  );
};

export default MatchDemo;
