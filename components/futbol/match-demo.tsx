import { Card } from "baseui/card";
import {
  Checkbox,
  LABEL_PLACEMENT
} from "baseui/checkbox";
import { Select } from "baseui/select";
import { useEffect, useMemo, useState } from "react";
import { Match } from "find-up";
import { match } from "assert";

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

const RandomMatchReport = ({
  fixtureType,
  usesExtraTime,
  usesAwayGoalsInET,
  usesGoldenGoal,
  usesAwayGoals
}: {
  fixtureType: FixtureType,
  usesExtraTime: boolean,
  usesAwayGoalsInET: boolean,
  usesGoldenGoal: boolean,
  usesAwayGoals: boolean
}) => {
  const fixtureReport = useMemo(() => {
    return generateFixtureReport({
      fixtureType,
      usesExtraTime,
      usesAwayGoalsInET,
      usesGoldenGoal,
      usesAwayGoals
    })
  }, [fixtureType, usesExtraTime, usesAwayGoalsInET, usesGoldenGoal, usesAwayGoals])

  return (
    <div>
      Example Match Report
      <hr />
      {
        fixtureReport.map((match, i) => <Card key={i}>
          {
            fixtureReport.length === 1 ? null : <div>Match {i + 1}</div>
          }
          <div>
            {match.ftScore.join(" - ")}
            {match.aetScore ? ` (${match.aetScore.join(" - ")} aet)` : null}
            {match.aggScore ? ` (${match.aggScore.join(" - ")} agg)` : null}
            {match.penalties ? ` (${match.penalties.join(" - ")} pens)` : null}
            {" "}<small style={{ fontSize: "80%" }}>(HT {match.htScore.join(" - ")})</small>
          </div>
          <div style={{ lineHeight: 1 }}>
            <div>
              {
                match.firstHalf.map(({ whoScored, time}, i) => <div style={{
                  display: 'inline-block',
                  width: 6,
                  height: 12,
                  background:  i >= 45 ? "#e60" : "#f80"
                }} />)
              }
            </div>
            <div>
              {
                match.secondHalf.map(({ whoScored, time}, i) => <div style={{
                  display: 'inline-block',
                  width: 6,
                  height: 12,
                  background:  i >= 45 ? "#e60" : "#f80"
                }} />)
              }
            </div>
            {
              match.firstHalfET ?
                <div>
                  {
                    match.firstHalfET.map(({ whoScored, time}, i) => <div style={{
                      display: 'inline-block',
                      width: 6,
                      height: 12,
                      background:  i >= 15 ? "#06e" : "#08f"
                    }} />)
                  }
                </div> : null
            }
            {
              match.secondHalfET ?
                <div>
                  {
                    match.secondHalfET.map(({ whoScored, time}, i) => <div style={{
                      display: 'inline-block',
                      width: 6,
                      height: 12,
                      background:  i >= 15 ? "#06e" : "#08f"
                    }} />)
                  }
                </div> : null
            }
          </div>
        </Card>)
      }
    </div>
  )
}


const MatchDemo = ({

}) => {
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
