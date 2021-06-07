import { Card } from "baseui/card";
import {
  Checkbox,
  LABEL_PLACEMENT
} from "baseui/checkbox";
import { Select } from "baseui/select";
import { StatefulTooltip } from "baseui/tooltip";
import React, { useMemo, useState } from "react";
import TeamLogo, { TeamLogoProps } from "./team-logo";

/**
 * Known bugs:
 * - for some reason away goals isn't working
 * - for some reason extra time always leads to penalties
 * - penalties is always 5-3
 *
 * - set up with dropdown to select competition
 *
 */

type FixtureType = "single-draw" | "single-no-draw" | "2-leg" | "replay-1" | "replay-inf"
type Fixture = [{ label: string, id: FixtureType }]

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
    [[5, 3], 0.02941176470588235 ]
  ] as [[number, number], number][]
}

type Minute = {
  type: "firstHalf" | "secondHalf" | "firstHalfET" | "secondHalfET",
  time: string,
  whoScored: "H" | "A" | null
}
type MatchReport = {
  winner: "H" | "A" | null,
  minutes: Minute[],
  htScore: [number, number] | null,
  ftScore: [number, number] | null,
  aetScore: [number, number] | null,
  aggScore: [number, number] | null,
  penalties: [number, number] | null,
}

function colorToBadge (color: string): {
  bg: string,
  fg: string,
  b: string
} {
  const sum = [color.slice(1, 3), color.slice(3, 5), color.slice(5, 7)].reduce((a, b) => a + parseInt(b, 16), 0)
  const fg = sum > 300 ? "#000000" : "#ffffff"
  const b = fg === "#ffffff" ? "1px solid transparent" : "1px solid #ffffff"

  return {
    bg: color,
    fg,
    b
  }
}

function Badge ({ team: { name, color }, margin = 0 }: { team: Team, margin?: number | string }) {
  const { bg, fg, b } = colorToBadge(color)
  return (
    <>
      <div className="badge" style={{
        background: bg,
        color: fg,
        border: b,
        margin
      }}>
        {name}
      </div>
      <style jsx>{`
        .badge {
          display: inline-block;
          padding: 4px 8px;
          font-weight: bold;
          border-radius: 8px;
          font-variation-settings: "wght" 700;
        }
      `}</style>
    </>
  )
}

function generateMatchReport({
  requiresAWinner,
  prevScore,
  usesExtraTime = false,
  usesGoldenGoal = false,
  usesAwayGoals = false,
  usesAwayGoalsInET = false
}: {
  prevScore?: [number, number]
  requiresAWinner: boolean,
  usesExtraTime?: boolean,
  usesGoldenGoal?: boolean,
  usesAwayGoals?: boolean,
  usesAwayGoalsInET?: boolean
}): MatchReport {
  const minutes: Minute[] = []

  let aetScore: [number, number] | null = null
  let penalties: [number, number] | null = null
  let winner: "H" | "A" | null = null

  for (let i = 1; i <= 47; i++) {
    const time = i > 45 ? `45+${i - 45}` : `${i}`;
    const homeScored = Math.random() < RANDOMIZER_DATA.H1
    const awayScored = Math.random() < RANDOMIZER_DATA.A1
    const whoScored = (homeScored && awayScored) ? ((i % 2 === 1) ? "H" : "A") : (homeScored ? "H" : (awayScored ? "A" : null))
    minutes.push({
      type: "firstHalf",
      time,
      whoScored
    })
  }

  const htScore: [number, number] = minutes.reduce(([h, a], { whoScored }) => {
    return [h + (whoScored === "H" ? 1 : 0), a + (whoScored === "A" ? 1 : 0)]
  }, [0, 0])

  for (let i = 46; i <= 96; i++) {
    const time = i > 90 ? `90+${i - 90}` : `${i}`;
    const homeScored = Math.random() < RANDOMIZER_DATA.H2
    const awayScored = Math.random() < RANDOMIZER_DATA.A2
    const whoScored = (homeScored && awayScored) ? ((i % 2 === 1) ? "H" : "A") : (homeScored ? "H" : (awayScored ? "A" : null))
    minutes.push({
      type: "secondHalf",
      time,
      whoScored
    })
  }

  const ftScore: [number, number] = minutes.reduce(([h, a], { whoScored }) => {
    return [h + (whoScored === "H" ? 1 : 0), a + (whoScored === "A" ? 1 : 0)]
  }, [0, 0])

  let aggScore: [number, number] = [ftScore[0], ftScore[1]]
  if (prevScore !== undefined) {
    aggScore[0] += prevScore[0]
    aggScore[1] += prevScore[1]
  }

  continueIfNecessary: if (aggScore[0] !== aggScore[1]) {
    winner = aggScore[0] > aggScore[1] ? "H" : "A"
  } else if (requiresAWinner) {
    if (usesAwayGoals && prevScore[0] !== ftScore[1]) {
      // decided on away goals
      winner = prevScore[0] > ftScore[1] ? "A" : "H"
    } else {
      if (usesExtraTime) {
        for (let i = 91; i <= 106; i++) {
          const time = i > 105 ? `105+${i - 105}` : `${i}`;
          const homeScored = Math.random() < RANDOMIZER_DATA.H_ET
          const awayScored = Math.random() < RANDOMIZER_DATA.A_ET
          const whoScored = (homeScored && awayScored) ? ((i % 2 === 1) ? "H" : "A") : (homeScored ? "H" : (awayScored ? "A" : null))
          minutes.push({
            type: "firstHalfET",
            time,
            whoScored
          })
          if (usesGoldenGoal && whoScored !== null) {
            winner = whoScored
            break continueIfNecessary
          }
        }
        for (let i = 106; i <= 121; i++) {
          const time = i > 120 ? `120+${i - 120}` : `${i}`;
          const homeScored = Math.random() < RANDOMIZER_DATA.H_ET
          const awayScored = Math.random() < RANDOMIZER_DATA.A_ET
          const whoScored = (homeScored && awayScored) ? ((i % 2 === 1) ? "H" : "A") : (homeScored ? "H" : (awayScored ? "A" : null))
          minutes.push({
            type: "secondHalfET",
            time,
            whoScored
          })
          if (usesGoldenGoal && whoScored !== null) {
            winner = whoScored
            break continueIfNecessary
          }
        }

        aetScore = minutes.reduce(([h, a], { whoScored }) => {
          return [h + (whoScored === "H" ? 1 : 0), a + (whoScored === "A" ? 1 : 0)]
        }, [0, 0])

        aggScore = [aetScore[0], aetScore[1]]
        if (prevScore !== undefined) {
          aggScore[0] += prevScore[0]
          aggScore[1] += prevScore[1]
        }

        if (aggScore[0] === aggScore[1] && usesAwayGoalsInET && prevScore[0] !== aetScore[1]) {
          // decided on away goals
          winner = prevScore[0] > aetScore[1] ? "A" : "H"
        } else {
          // decided on penalties
          let rand = Math.random()
          let sum = 0

          for (const [score, p] of RANDOMIZER_DATA.P) {
            sum += p
            if (sum > rand) {
              penalties = score
            }
          }
        }
      }
    }
  }

  return {
    winner,
    minutes,
    htScore,
    ftScore,
    aetScore,
    aggScore: prevScore === undefined ? null : aggScore,
    penalties
  }
}

function invertHomeAndAway(matchReport: MatchReport): MatchReport {
  return {
    winner: matchReport.winner === "H" ? "A" : (matchReport.winner === "A" ? "H" : null),
    minutes: matchReport.minutes.map(({ type, time, whoScored }) => ({
      type,
      time,
      whoScored: whoScored === "H" ? "A" : (whoScored === "A" ? "H" : null)
    })),
    htScore: matchReport.htScore === null ? null : [matchReport.htScore[1], matchReport.htScore[0]],
    ftScore: matchReport.ftScore === null ? null : [matchReport.ftScore[1], matchReport.ftScore[0]],
    aetScore: matchReport.aetScore === null ? null : [matchReport.aetScore[1], matchReport.aetScore[0]],
    aggScore: matchReport.aggScore === null ? null : [matchReport.aggScore[1], matchReport.aggScore[0]],
    penalties:  matchReport.penalties === null ? null : [matchReport.penalties[1], matchReport.penalties[0]],
  }
}

function generateFixtureReport({
  fixtureType,
  usesExtraTime,
  usesGoldenGoal,
  usesAwayGoals,
  usesAwayGoalsInET
}: {
  fixtureType: FixtureType,
  usesExtraTime: boolean,
  usesGoldenGoal: boolean,
  usesAwayGoals: boolean,
  usesAwayGoalsInET: boolean
}) {
  // "single-draw" | "single-no-draw" | "2-leg" | "replay-1" | "replay-inf"
  const matches: MatchReport[] = []
  if (fixtureType === "single-draw") {
    matches.push(
      generateMatchReport({ requiresAWinner: false })
    )
  } else if (fixtureType === "single-no-draw") {
    matches.push(
      generateMatchReport({
        requiresAWinner: true,
        usesExtraTime,
        usesGoldenGoal,
      })
    )
  } else if (fixtureType === "replay-1") {
    const firstMatch = generateMatchReport({
      requiresAWinner: false,
    })
    matches.push(firstMatch)
    if (firstMatch.ftScore[0] === firstMatch.ftScore[1]) {
      matches.push(
        generateMatchReport({
          requiresAWinner: true,
          usesExtraTime,
          usesGoldenGoal,
        })
      )
    }
  } else if (fixtureType === "replay-inf") {
    let match: ReturnType<typeof generateMatchReport>
    do {
      match = generateMatchReport({
        requiresAWinner: false
      })
      matches.push(match)
    } while (match.ftScore[0] === match.ftScore[1]);
  } else { // 2-leg
    const firstMatch = generateMatchReport({
      requiresAWinner: false,
    })
    matches.push(firstMatch)
    matches.push(
      generateMatchReport({
        requiresAWinner: true,
        prevScore: [firstMatch.ftScore[1], firstMatch.ftScore[0]],
        usesExtraTime,
        usesGoldenGoal,
        usesAwayGoals,
        usesAwayGoalsInET
      })
    )
  }

  // invert every other scoreline to have home-away-home-etc
  for (let i = 1; i < matches.length; i += 2) {
    matches[i] = invertHomeAndAway(matches[i])
  }

  return matches.map(({ minutes, ...match }) => {
    const firstHalf = minutes.filter(({ type }) => type === "firstHalf")
    const secondHalf = minutes.filter(({ type }) => type === "secondHalf")
    const firstHalfET = minutes.filter(({ type }) => type === "firstHalfET")
    const secondHalfET = minutes.filter(({ type }) => type === "secondHalfET")

    return ({
      ...match,
      firstHalf,
      secondHalf,
      firstHalfET: firstHalfET.length === 0 ? null : firstHalfET,
      secondHalfET: secondHalfET.length === 0 ? null : secondHalfET,
    })
  })
}

type Team = {
  name: string,
  logo: TeamLogoProps,
  location: string,
  stadium: string,
  color: string
}

const Minute = React.memo(({
  time,
  whoScored,
  home,
  away
}: {
  time: string,
  whoScored: 'H' | 'A' | '',
  home: Team,
  away: Team
}) => {
  const minuteInt = time.split("+").reduce((total, next) => total + parseInt(next), 0)
  const isMultipleOf5 = minuteInt % 5 === 0
  const isMultipleOf10 = isMultipleOf5 && (minuteInt % 2 === 0)
  const topClass = isMultipleOf10 ? "ten" : (isMultipleOf5 ? "five" : "");
  const bottomClass = isMultipleOf10 ? "ten" : (isMultipleOf5 ? "five" : "");

  return (
    <>
      <StatefulTooltip
        showArrow
        onMouseEnterDelay={0}
        animateOutTime={40}
        onMouseLeaveDelay={40}
        placement="top"
        ignoreBoundary
        content={() => (
          <div style={{ textAlign: "center" }}>
            {whoScored && <div>Goal: {(whoScored === "H" ? home : away).name}</div>}
            <div>{time}'</div>
          </div>
        )}
      >
        <div key={time} className="minute" style={{
          background: time.includes("+") ? "#ccc" : "#fff"
        }}>
          <div className="top-half" style={{
            background: home.color,
            opacity: whoScored === "H" ? 1 : 0.3
          }} />
          <div className="bottom-half" style={{
            background: away.color,
            opacity: whoScored === "A" ? 1 : 0.3
          }} />
          <div className={`tick-top ${topClass}`} data-whoscored={whoScored} />
          <div className={`tick-bottom ${bottomClass}`} data-whoscored={whoScored} />
        </div>
      </StatefulTooltip>
      <style jsx>{`
        .minute {
          user-select: none;
          position: relative;
          width: 3px;
          height: 24px;
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
          right: 1px;
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
          transform: translate(0, 50%);
          width: 3px;
          height: 3px;
          left: 0;
        }
        .minute:hover .tick-bottom {
          top: 0;
          height: 100%;
          width: 0;
          position: relative;
        }
        .minute:hover .tick-bottom::before {
          content: "";
          top: 0;
          left: 1px;
          position: absolute;
          width: 2px;
          height: 100%;
          border: dotted #777;
          border-width: 0 1px 0 0
        }
      `}</style>
    </>
  )
})

const RandomMatchReport = ({
  home = {
    name: "FC Kangaroo",
    logo: { type: "kangaroo" },
    location: "Australia",
    stadium: "Outback Stadium",
    color: "#cb0707"
  },
  away = {
    name: "Penguin FC",
    logo: { type: "penguin" },
    location: "Antarctica",
    stadium: "Igloo Arena",
    color: "#1100a2"
  },
  fixtureType,
  usesExtraTime,
  usesAwayGoalsInET,
  usesGoldenGoal,
  usesAwayGoals
}: {
  home?: Team,
  away?: Team,
  fixtureType: FixtureType,
  usesExtraTime: boolean,
  usesAwayGoalsInET: boolean,
  usesGoldenGoal: boolean,
  usesAwayGoals: boolean
}) => {
  const [regenerate, setRegenerate] = useState(0)
  const fixtureReport = useMemo(() => {
    return generateFixtureReport({
      fixtureType,
      usesExtraTime,
      usesAwayGoalsInET,
      usesGoldenGoal,
      usesAwayGoals
    })
  }, [fixtureType, usesExtraTime, usesAwayGoalsInET, usesGoldenGoal, usesAwayGoals, regenerate])

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: "120%" }}>Example Match Report</h3>
        <div>
          <button
            style={{ border: "1px solid black", padding: 4, cursor: "pointer" }}
            onClick={() => setRegenerate(regenerate + 1)}
          >
            Regenerate
          </button>
        </div>
      </div>
      <hr />
      {
        fixtureReport.map((match, i) => <div key={i} style={{ marginTop: i === 0 ? 0 : 16 }}>
          <Card>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              {
                fixtureReport.length === 1 ? null : <div>Match {i + 1}</div>
              }
              <div style={{
                display: "flex",
                width: "100%",
                alignItems: "center"
              }}>
                <div style={{ flex: "1 1 1px", display: "flex", justifyContent: "flex-end" }}>
                  <Badge team={home} margin="0 8px 0 0" />
                </div>
                <TeamLogo {...home.logo} size={5} />
                <div style={{ margin: "0 8px", fontSize: "90%", minWidth: 64, textAlign: "center", lineHeight: 1.1 }}>
                  {match.aetScore ? <div>AET</div> : null}
                  <div style={{ fontSize: "180%" }}>{(match.aetScore || match.ftScore).join(" - ")}</div>
                  <div style={{ marginTop: 4 }}>HT {match.htScore.join(" - ")}</div>
                  {match.aetScore ? <div>FT {match.ftScore.join(" - ")}</div> : null}
                </div>
                <TeamLogo {...away.logo} size={5} />
                <div style={{ flex: "1 1 1px" }}>
                  <Badge team={away} margin="0 0 0 8px" />
                </div>
              </div>
              <div style={{ margin: "16px 0 0" }} />
              <div className="timeline">
                <div className="first-half">
                  {
                    match.firstHalf.map(({ whoScored, time}) => <Minute key={time} time={time} whoScored={whoScored} home={home} away={away} />)
                  }
                </div>
                <div className="break" data-before="HT" data-after={match.htScore.join(" - ")} />
                <div className="second-half">
                {
                  match.secondHalf.map(({ whoScored, time}, i) => <Minute key={time} time={time} whoScored={whoScored} home={home} away={away} />)
                }
                </div>
                {
                  match.firstHalfET ? <>
                    <div className="break" data-before="FT" data-after={match.ftScore.join(" - ")} />
                    <div className="first-half-et">
                      {match.firstHalfET.map(({ whoScored, time}, i) => <Minute key={time} time={time} whoScored={whoScored} home={home} away={away} />)}
                    </div>
                  </> : null
                }
                {
                  match.secondHalfET ? <>
                    <div className="break" />
                    <div className="second-half-et">
                      {match.secondHalfET.map(({ whoScored, time}, i) => <Minute key={time} time={time} whoScored={whoScored} home={home} away={away} />)}
                    </div>
                  </> : null
                }
                {
                  match.penalties ? <>
                    <div className="break" data-before="AET" data-after={match.aetScore.join(" - ")} />
                    <div className="penalties">
                      {match.penalties.join(" - ")}
                    </div>
                  </> : null
                }
              </div>
            </div>
          </Card>
        </div>)
      }
      <style jsx>{`
        .timeline {
          line-height: 1;
          display: flex;
          align-items: center;
        }
      
        .first-half,
        .second-half,
        .first-half-et,
        .second-half-et,
        .penalties {
          display: flex;
          border: 1px solid #777;
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
  )
}


const MatchDemo = () => {
  const [fixtureType, setFixtureType] = useState<Fixture>([
    { label: "Single Match", id: "single-draw" }
  ]);

  const [usesExtraTime, setUsesExtraTime] = useState(false);
  const [usesGoldenGoal, setUsesGoldenGoal] = useState(false);
  const [usesAwayGoals, setUsesAwayGoals] = useState(false);
  const [_usesAwayGoalsInET, setUsesAwayGoalsInET] = useState(false);
  const usesAwayGoalsInET = _usesAwayGoalsInET && usesExtraTime && usesAwayGoals

  const fixtureTypeId = fixtureType[0].id

  return (
    <Card>
      <Select
        searchable={false}
        clearable={false}
        options={[
          { label: "Single match", id: "single-draw" },
          { label: "Single match (no draw)", id: "single-no-draw" },
          { label: "2-legged fixture (2 matches with scores added)", id: "2-leg" },
          { label: "Replay once in case of a draw", id: "replay-1" },
          { label: "Replay until a team wins", id: "replay-inf" }
        ]}
        value={fixtureType}
        placeholder="Select color"
        onChange={params => {
          console.log(params.value)
          setFixtureType(params.value as Fixture)
        }}
      />
      <div style={{ marginTop: 16 }}>
        {
          (fixtureTypeId === "2-leg") ? <>
            <Checkbox
              checked={usesAwayGoals}
              onChange={event => {
                const target = event.target as HTMLInputElement & { checked: boolean }
                setUsesAwayGoals(target.checked)
              }}
              labelPlacement={LABEL_PLACEMENT.right}
            >
              Uses away goals rule
            </Checkbox>
            {
              (usesExtraTime && usesAwayGoals) ? <>
                <Checkbox
                  checked={usesAwayGoalsInET}
                  onChange={event => {
                    const target = event.target as HTMLInputElement & { checked: boolean }
                    setUsesAwayGoalsInET(target.checked)
                  }}
                  labelPlacement={LABEL_PLACEMENT.right}
                >
                  Uses away goals rule in extra time
                </Checkbox>
              </> : null
            }
          </> : null
        }
        {
          (fixtureTypeId === "single-draw" || fixtureTypeId === "replay-inf") ? null : <>
            <Checkbox
              checked={usesExtraTime}
              onChange={event => {
                const target = event.target as HTMLInputElement & { checked: boolean }
                setUsesExtraTime(target.checked)
              }}
              labelPlacement={LABEL_PLACEMENT.right}
            >
              Extra time (in event of a draw)
            </Checkbox>
            {
              usesExtraTime ? <>
                <Checkbox
                  checked={usesGoldenGoal}
                  onChange={event => {
                    const target = event.target as HTMLInputElement & { checked: boolean }
                    setUsesGoldenGoal(target.checked)
                  }}
                  labelPlacement={LABEL_PLACEMENT.right}
                >
                  Extra time uses golden goal rule
                </Checkbox>
              </> : null
            }
          </>
        }
      </div>

      <div style={{ marginTop: 16 }}>
        <Card>
          <RandomMatchReport
            fixtureType={fixtureTypeId}
            usesExtraTime={usesExtraTime}
            usesAwayGoalsInET={usesAwayGoalsInET}
            usesGoldenGoal={usesGoldenGoal}
            usesAwayGoals={usesAwayGoals}
          />
        </Card>
      </div>
    </Card>
  )
}

export default MatchDemo
