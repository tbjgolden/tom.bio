const standardTournament = (knockoutRounds = 4): RawRounds => {
  const parts: Array<string | [string]> = [
    ["Final"],
    ["Semifinal"],
    ["Quarterfinal"],
    ["Last 16"]
  ]
  return [
    {
      rules: "knockout",
      parts: parts.slice(0, knockoutRounds)
    },
    {
      rules: "league",
      parts: [
        ["Group Stage"]
      ]
    }
  ]
}
const twoLegTournament = (knockoutRounds = 4): RawRounds => [
  {
    rules: "knockout",
    parts: [
      ["Final"]
    ]
  },
  {
    rules: "2-leg",
    parts: [
      "Semifinal",
      "Quarterfinal",
      "Last 16"
    ].slice(0, knockoutRounds - 1)
  },
  {
    rules: "league",
    parts: [
      "Group Stage"
    ]
  }
]

export type Pattern = "plain" | "stripes"

export type Team = {
  id: string,
  name: string,
  stadium: string,
  colorA: string,
  colorB: string,
  pattern?: Pattern
  city?: string
}

const teamMap: Record<string, Omit<Team, 'id'>> = {
  arsenal: {
    name: "Arsenal",
    stadium: "Arsenal Stadium",
    colorA: "#EF0107",
    colorB: "#ffffff",
    city: "London"
  },
  spurs: {
    name: "Tottenham Hotspur",
    stadium: "Tottenham Hotspur Stadium",
    colorA: "#132257",
    colorB: "#ffffff",
    city: "London"
  },
  chelsea: {
    name: "Chelsea",
    stadium: "Stamford Bridge",
    colorA: "#034694",
    colorB: "#ffffff",
    city: "London"
  },
  barca: {
    name: "Barcelona",
    stadium: "Camp Nou",
    colorA: "#004d98",
    colorB: "#a50044",
    pattern: "stripes",
    city: "Barcelona"
  },
  real: {
    name: "Real Madrid",
    stadium: "Estadio Santiago Bernabéu",
    colorA: "#ffffff",
    colorB: "#000000",
    city: "Madrid"
  },
  city: {
    name: "Manchester City",
    stadium: "City of Manchester Stadium",
    colorA: "#6CABDD",
    colorB: "#1C2C5B",
    city: "Manchester"
  },
  galaxy: {
    name: "LA Galaxy",
    stadium: "Carson Stadium",
    colorA: "#00245D",
    colorB: "#FFD200",
    city: "Los Angeles"
  },
  lafc: {
    name: "LAFC",
    stadium: "LAFC Stadium",
    colorA: "#000000",
    colorB: "#c39e6d",
    city: "Los Angeles"
  },
  liverpool: {
    name: "Liverpool",
    stadium: "Anfield",
    colorA: "#c8102E",
    colorB: "#F6EB61",
    city: "Liverpool"
  },
  united: {
    name: "Manchester United",
    stadium: "Old Trafford",
    colorA: "#DA291C",
    colorB: "#000000",
    city: "Manchester"
  },
  ac: {
    name: "AC Milan",
    stadium: "San Siro",
    colorA: "#fb090b",
    colorB: "#000000",
    pattern: "stripes",
    city: "Milan"
  },
  inter: {
    name: "Internazionale",
    stadium: "San Siro",
    colorA: "#010E80",
    colorB: "#000000",
    pattern: "stripes",
    city: "Milan"
  },
  everton: {
    name: "Everton",
    stadium: "Goodison Park",
    colorA: "#003399",
    colorB: "#ffffff",
    city: "Liverpool"
  },
  bayern: {
    name: "Bayern München",
    stadium: "Fußball Arena München",
    colorA: "#dc052d",
    colorB: "#ffffff",
    city: "Munich"
  },
  dortmund: {
    name: "Borussia Dortmund",
    stadium: "BVB Stadion Dortmund",
    colorA: "#FDE100",
    colorB: "#000000",
    city: "Munich"
  },
  germany: {
    name: "Germany",
    stadium: "Olympiastadion Berlin",
    colorA: "#ffffff",
    colorB: "#000000",
  },
  portugal: {
    name: "Portugal",
    stadium: "Estádio Nacional",
    colorA: "#ca0014",
    colorB: "#0d6938",
  },
  france: {
    name: "France",
    stadium: "Stade de France",
    colorA: "#112855",
    colorB: "#f1030a",
  },
  spain: {
    name: "Spain",
    stadium: "Estadio Santiago Bernabéu",
    colorA: "#fc0000",
    colorB: "#020053",
  },
  england: {
    name: "England",
    stadium: "Wembley Stadium",
    colorA: "#ffffff",
    colorB: "#000040",
  },
  us: {
    name: "USA",
    stadium: "Rose Bowl",
    colorA: "#ffffff",
    colorB: "#182f87",
  },
  mexico: {
    name: "Mexico",
    stadium: "Estadio Azteca",
    colorA: "#1a4d3e",
    colorB: "#ffffff"
  },
  brazil: {
    name: "Brazil",
    stadium: "Estádio do Maracanã",
    colorA: "#ffe500",
    colorB: "#0000ff"
  },
  argentina: {
    name: "Argentina",
    stadium: "Estadio Monumental",
    colorA: "#8aa9dc",
    colorB: "#ffffff",
    pattern: "stripes"
  },
  uruguay: {
    name: "Uruguay",
    stadium: "Estadio Centenario",
    colorA: "#80b6ff",
    colorB: "#ffffff"
  },
  colombia: {
    name: "Colombia",
    stadium: "Estadio Metropolitano",
    colorA: "#ffff00",
    colorB: "#061c3d"
  },
  iran: {
    name: "Iran",
    stadium: "Azadi Stadium",
    colorA: "#ffffff",
    colorB: "#ff0000"
  },
  japan: {
    name: "Japan",
    stadium: "Japan National Stadium",
    colorA: "#000555",
    colorB: "#ffffff"
  },
  korea: {
    name: "Korea",
    stadium: "Seoul World Cup Stadium",
    colorA: "#ff0b23",
    colorB: "#0a0a0a"
  },
  australia: {
    name: "Australia",
    stadium: "Stadium Australia",
    colorA: "#ffbc00",
    colorB: "#004044"
  },
  egypt: {
    name: "Egypt",
    stadium: "Cairo International Stadium",
    colorA: "#f10000",
    colorB: "#ffffff"
  },
  nigeria: {
    name: "Nigeria",
    stadium: "National Stadium",
    colorA: "#1d7e12",
    colorB: "#ffffff"
  },
  morocco: {
    name: "Morocco",
    stadium: "Stade Mohammed V",
    colorA: "#ff0000",
    colorB: "#067540"
  }
}

type RawRounds = string | Array<{
  rules: string,
  parts: Array<string | [string]>
}>

const competitionMap: Record<string, Omit<Competition, 'id' | 'rounds' | 'longDescription' | 'teams'> & {
  longDescription?: string
  rounds: RawRounds
}> = {
  "wc": {
    name: "FIFA World Cup",
    shortDescription: "World International Tournament",
    rounds: standardTournament()
  },
  "eu": {
    name: "UEFA European Championship",
    shortDescription: "European International Tournament",
    rounds: standardTournament()
  },
  "na": {
    name: "CONCACAF Gold Cup",
    shortDescription: "North American International Tournament",
    rounds: standardTournament(3)
  },
  "sa": {
    name: "CONMEBOL Copa América",
    shortDescription: "South American International Tournament",
    rounds: [
      {
        rules: "knockout",
        parts: [
          ["Final"],
          ["Semifinal"],
        ]
      },
      {
        rules: "knockout-no-et",
        parts: [
          ["Quarterfinal"],
        ]
      },
      {
        rules: "league",
        parts: [
          ["Group Stage"]
        ]
      }
    ]
  },
  "as": {
    name: "AFC Asian Cup",
    shortDescription: "Asian International Tournament",
    rounds: standardTournament()
  },
  "af": {
    name: "CAF Africa Cup of Nations",
    shortDescription: "African International Tournament",
    rounds: standardTournament()
  },
  "ucl": {
    name: "UEFA Champions League",
    shortDescription: "Primary European Tournament",
    rounds: twoLegTournament()
  },
  "europa": {
    name: "UEFA Europa League",
    shortDescription: "Secondary European Tournament",
    rounds: twoLegTournament()
  },
  "epl": {
    name: "Premier League",
    shortDescription: "Primary English League",
    rounds: "league"
  },
  "fa": {
    name: "FA Cup",
    shortDescription: "Primary English Cup",
    rounds: [
      {
        rules: "knockout",
        parts: [
          "Final",
          "Semifinal",
          "Quarterfinal",
          "5th Round (Last 16)"
        ]
      },
      {
        rules: "replay",
        parts: [
          "4th Round",
          "3rd Round",
          "2nd Round",
          "1st Round",
          "Qualifying"
        ]
      }
    ]
  },
  "elc": {
    name: "EFL Cup",
    shortDescription: "Secondary English Cup",
    rounds: [
      {
        rules: "knockout",
        parts: [
          "Final"
        ]
      },
      {
        rules: "knockout-no-et",
        parts: [
          "Semifinal",
          "5th Round (Quarterfinal)",
          "4th Round (Last 16)",
          "3rd Round",
          "2nd Round",
          "1st Round"
        ]
      }
    ]
  },
  "liga": {
    name: "La Liga",
    shortDescription: "Primary Spanish League",
    rounds: "league"
  },
  "delrey": {
    name: "Copa Del Rey",
    shortDescription: "Primary Spanish Cup",
    rounds: [
      {
        rules: "knockout",
        parts: [
          "Final",
        ]
      },
      {
        rules: "2-leg",
        parts: [
          "Semifinal"
        ]
      },
      {
        rules: "knockout",
        parts: [
          "Quarterfinal",
          "Last 16",
          "Last 32",
          "2nd Round",
          "1st Round",
          "Preliminary"
        ]
      }
    ]
  },
  "seriea": {
    name: "Serie A",
    shortDescription: "Primary Italian League",
    rounds: "league"
  },
  "coppa": {
    name: "Coppa Italia",
    shortDescription: "Primary Italian Cup",
    rounds: [
      {
        rules: "knockout",
        parts: [
          "Final",
        ]
      },
      {
        rules: "2-leg",
        parts: [
          "Semifinal"
        ]
      },
      {
        rules: "knockout",
        parts: [
          "Quarterfinal",
          "Last 16",
          "4th round",
          "3rd round",
          "2nd Round",
          "1st Round"
        ]
      }
    ]
  },
  "bundes": {
    name: "Bundesliga",
    shortDescription: "Primary German League",
    rounds: "league"
  },
  "german": {
    name: "DFB-Pokal/German Cup",
    shortDescription: "Primary German Cup",
    rounds: "knockout"
  },
  "concacaf": {
    name: "CONCACAF Champions League",
    shortDescription: "Primary North American Cup",
    rounds: [
      {
        rules: "2-leg-no-away",
        parts: [
          "Final"
        ]
      },
      {
        rules: "2-leg",
        parts: [
          "Semifinal",
          "Quarterfinal",
          "Last 16"
        ]
      },
    ]
  },
  "mls": {
    name: "Major League Soccer",
    shortDescription: "Primary United States League",
    rounds: [
      {
        rules: "knockout",
        parts: [
          "MLS Cup",
          "Conference Finals",
          "Conference Semifinals",
          "First round"
        ]
      },
      {
        rules: "league",
        parts: [
          "Regular Season"
        ]
      }
    ]
  },
  "usopen": {
    name: "U.S. Open Cup",
    shortDescription: "Primary United States Cup",
    rounds: "knockout"
  }
}

export const RIVALRY_MAP: Record<string, {
  teams: string[],
  competitions: string[],
  description?: string
}> = {
  "arsenal_spurs": {
    teams: ["arsenal", "spurs"],
    competitions: ["fa", "epl", "elc", "europa"],
    description: "These guys love each other"
  },
  "chelsea_spurs": {
    teams: ["chelsea", "spurs"],
    competitions: ["fa", "epl", "elc"],
    description: "These guys love each other"
  },
  "barca_real": {
    teams: ["barca", "real"],
    competitions: ["liga", "delrey", "ucl"],
    description: "These guys love each other"
  },
  "chelsea_city": {
    teams: ["chelsea", "city"],
    competitions: ["fa", "epl", "elc", "ucl"],
    description: "These guys love each other"
  },
  "galaxy_lafc": {
    teams: ["galaxy", "lafc"],
    competitions: ["mls", "usopen", "concacaf"],
    description: "These guys love each other"
  },
  "liverpool-united": {
    teams: ["liverpool", "united"],
    competitions: ["fa", "epl", "elc", "ucl"],
    description: "These guys love each other"
  },
  "ac_inter": {
    teams: ["ac", "inter"],
    competitions: ["seriea", "coppa", "ucl"],
    description: "These guys love each other"
  },
  "everton_liverpool": {
    teams: ["liverpool", "everton"],
    competitions: ["fa", "epl", "elc"],
    description: "These guys love each other"
  },
  "city_united": {
    teams: ["united", "city"],
    competitions: ["fa", "epl", "elc"],
    description: "These guys love each other"
  },
  "bayern_dortmund": {
    teams: ["bayern", "dortmund"],
    competitions: ["bundes", "german", "ucl"],
    description: "These guys love each other"
  },
  "eu": {
    teams: [
     "germany",
     "portugal",
     "france",
     "spain",
     "england"
    ],
    competitions: ["eu", "wc"]
  },
  "na": {
    teams: ["us", "mexico"],
    competitions: ["na", "wc"]
  },
  "sa": {
    teams: [
      "brazil",
      "argentina",
      "uruguay",
      "colombia"
    ],
    competitions: ["sa", "wc"]
  },
  "as": {
    teams: [
      "iran",
      "japan",
      "korea",
      "australia"
    ],
    competitions: ["as", "wc"]
  },
  "af": {
    teams: [
      "egypt",
      "nigeria",
      "morocco",
    ],
    competitions: ["af", "wc"]
  },
}

const MATCH_TYPES_MAP: Record<string, {
  fixtureType: FixtureType,
  usesExtraTime: boolean,
  usesGoldenGoal: boolean,
  usesAwayGoals: boolean,
  usesAwayGoalsInET: boolean
}> = {
  "knockout": {
    fixtureType: "single-no-draw",
    usesExtraTime: true,
    usesGoldenGoal: false,
    usesAwayGoals: false,
    usesAwayGoalsInET: false
  },
  "knockout-no-et": {
    fixtureType: "single-no-draw",
    usesExtraTime: false,
    usesGoldenGoal: false,
    usesAwayGoals: false,
    usesAwayGoalsInET: false
  },
  "league": {
    fixtureType: "single-draw",
    usesExtraTime: false,
    usesGoldenGoal: false,
    usesAwayGoals: false,
    usesAwayGoalsInET: false
  },
  "replay": {
    fixtureType: "replay-1",
    usesExtraTime: true,
    usesGoldenGoal: false,
    usesAwayGoals: false,
    usesAwayGoalsInET: false
  },
  "2-leg": {
    fixtureType: "2-leg",
    usesExtraTime: true,
    usesGoldenGoal: false,
    usesAwayGoals: true,
    usesAwayGoalsInET: true
  },
  "2-leg-no-away": {
    fixtureType: "2-leg",
    usesExtraTime: true,
    usesGoldenGoal: false,
    usesAwayGoals: false,
    usesAwayGoalsInET: false
  },
}

export type FixtureType =
  | "single-draw"
  | "single-no-draw"
  | "2-leg"
  | "replay-1"
  | "replay-inf";

export const RANDOMIZER_DATA = {
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
  ] as const,
};

export type Round = {
  id: string,
  round: string,
  usesNeutralVenue: boolean,
  rules: {
    fixtureType: FixtureType,
    usesExtraTime: boolean,
    usesGoldenGoal: boolean,
    usesAwayGoals: boolean,
    usesAwayGoalsInET: boolean
  }
}

export type Competition = {
  id: string,
  name: string,
  shortDescription: string,
  longDescription: string,
  rounds: Round[],
  teams: Team[]
}

export const COMPETITIONS_MAP: Record<string, Competition> = {}
for (const competition of Object.keys(competitionMap)) {
  const rawRounds = competitionMap[competition].rounds
  const rounds: Competition["rounds"] = (typeof rawRounds === "string")
    ? [
      {
        id: `${rawRounds}-${Math.random()}`,
        round: `-`,
        usesNeutralVenue: false,
        rules: MATCH_TYPES_MAP[rawRounds]
      }
    ]
    : rawRounds.flatMap(({ rules, parts }) => (
      parts.map(part => ({
        id: `${typeof part === "string" ? part : part[0]}-${Math.random()}`,
        round: typeof part === "string" ? part : part[0],
        usesNeutralVenue: typeof part !== "string",
        rules: MATCH_TYPES_MAP[rules]
      }))
    ))

  COMPETITIONS_MAP[competition] = {
    id: competition,
    name: competitionMap[competition].name,
    shortDescription: competitionMap[competition].shortDescription,
    longDescription: competitionMap[competition].longDescription ?? "",
    rounds,
    teams: []
  }
}
for (const { teams, competitions } of Object.values(RIVALRY_MAP)) {
  for (const competition of competitions) {
    for (const team of teams) {
      COMPETITIONS_MAP[competition].teams.push({
        id: team,
        ...teamMap[team]
      })
    }
  }
}

export const COMPETITIONS: Competition[] = Object.values(COMPETITIONS_MAP)

export const FIXTURE_TYPES_MAP = {
  "single-draw": "Single match",
  "single-no-draw": "Single match (no draw)",
  "2-leg": "2-legged fixture (2 matches with scores added)",
  "replay-1": "Replay once in case of a draw",
  "replay-inf": "Replay until a team wins",
};

export const FIXTURE_TYPES = Object.entries(FIXTURE_TYPES_MAP)
