const xpList = [
  {
    title: 'willtheygo.com',
    beginMonth: 2,
    beginYear: 2017,
    headerLines: [
      'Founder'
    ],
    paragraphs: [
      'Creating an analytical engine to predict the likelihood of a player changing clubs in European football.',
      'This app is currently available as a web app but will eventually be released as a mobile app.'
    ],
    tags: ['ft', 'job', 'nomad']
  },
  {
    title: 'Shipt',
    beginMonth: 2,
    beginYear: 2017,
    endMonth: 5,
    endYear: 2018,
    headerLines: [
      'Web Developer (React, Angular)',
      'Mobile Developer (Ionic)'
    ],
    paragraphs: [
      'Developing Shipt’s front end through its Android, iOS and Web applications.',
      'Helped build out the web app’s team as its first member before transitioning to the mobile team working alongside five fantastic senior engineers.',
      'As the most design oriented member of the team, recent work has involved a full redesign, refactoring code with best practices, writing tests and building some exciting features.'
    ],
    tags: ['ft', 'job', 'us', 'sanfrancisco']
  },
  {
    title: 'UC Berkeley',
    beginMonth: 7,
    beginYear: 2017,
    endMonth: 1,
    endYear: 2018,
    headerLines: [
      'Full Stack Web Development',
      'Teaching Assistant'
    ],
    paragraphs: [
      'Taught and supported the students. The course taught common front-end languages in addition to Node, Python, Ruby, Java, Django, React, React Native and Firebase.'
    ],
    tags: ['pt', 'job', 'us', 'berkeley']
  },
  {
    title: 'Gobi',
    beginMonth: 9,
    beginYear: 2016,
    endMonth: 12,
    endYear: 2016,
    headerLines: [
      'Web Developer'
    ],
    paragraphs: [
      'Created JavaScript apps at a seed stage tech startup developing a consumer-facing social media app called Gobi.',
      'Made an admin interface and a feed for snaps written with Node, Redis and WebSockets.'
    ],
    tags: ['ft', 'job', 'us', 'paloalto']
  },
  {
    title: 'University of\nWarwick',
    beginMonth: 9,
    beginYear: 2013,
    endMonth: 5,
    endYear: 2016,
    headerLines: [
      'Discrete Mathematics BSc (Hons)'
    ],
    paragraphs: [
      'Education-speak can be ambiguous depending on where you are from, hopefully this will help:',
      '🇺🇸 Completed a double-major BS (Hons) degree in Computer Science and Math. Degrees are often shorter in the UK as we specialize at an earlier age.',
      '🇬🇧 Received a upper second class BSc (Hons) degree in Discrete Mathematics (i.e. Maths & Computer Science).',
      'Warwick has one of the most reputable mathematics departments in the world and I consider myself very lucky to have been able to have studied there.'
    ],
    tags: ['education', 'uk', 'warwick']
  },
  {
    title: 'Goldman Sachs',
    beginMonth: 6,
    beginYear: 2015,
    endMonth: 8,
    endYear: 2015,
    headerLines: [
      'Technology Analyst (Java, Scala)'
    ],
    paragraphs: [
      'Worked as a Java and Scala developer with the Fixed Income technology team, writing code for the back-end of key bond/insurance products.',
      'Also produced some internal front-end web products.'
    ],
    tags: ['ft', 'job', 'uk', 'intern', 'london']
  },
  {
    title: 'theboar.org',
    beginMonth: 10,
    beginYear: 2015,
    endMonth: 2,
    endYear: 2016,
    headerLines: [],
    paragraphs: [
      'Redesigned and rebuilt The Boar’s website.',
      'Won ‘Best Design’ award and nominated for ‘Best Website’ at the national student publication awards.'
    ],
    tags: ['contract', 'uk', 'warwick']
  }
];

export default xpList;

// generates tag list
//
// const freqMap = xpList
//   .map(item => item.tags)
//   .reduce((a, b) => a.concat(b))
//   .reduce((map, tag) => ({ ...map, [tag]: (map[tag] || 0) + 1 }), {});
//
// export const tags = Object.keys(freqMap)
//   .map(k => [k, freqMap[k]])
//   .sort(([a], [b]) => a.toLowerCase() - b.toLowerCase())
//   .sort(([, a], [, b]) => b - a)
//   .map(([tag]) => tag);

export const tags = [
  [
    'Type',
    [
      [
        'job',
        'Job',
        [
          ['ft', 'Full-time'],
          ['pt', 'Part-time'],
          ['intern', 'Internship']
        ]
      ],
      [
        'contract',
        'Contract'
      ],
      [
        'education',
        'Education'
      ]
    ]
  ],
  [
    'Location',
    [
      [
        'us',
        '🇺🇸',
        [
          ['sanfrancisco', 'San Francisco'],
          ['berkeley', 'Berkeley'],
          ['paloalto', 'Palo Alto']
        ]
      ],
      [
        'uk',
        '🇬🇧',
        [
          ['london', 'London'],
          ['warwick', 'Warwick']
        ]
      ],
      [
        'nomad',
        '🌍'
      ]
    ]
  ]
];
