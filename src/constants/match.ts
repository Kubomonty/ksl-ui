import { MatchType } from '../enums'

export const emptyMatchLegs = {
  qtr1: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
  qtr2: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
  qtr3: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
  qtr4: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
}
export const maxSubstitutionNumber = 4
export const matchOpponentsStructure = [
  [
    {
      guest: 4,
      home: 1,
      type: MatchType.DO501,
    },
    {
      guest: 3,
      home: 2,
      type: MatchType.DO501,
    },
    {
      guest: 2,
      home: 3,
      type: MatchType.DO501,
    },
    {
      guest: 1,
      home: 4,
      type: MatchType.CRICKET,
    },
  ],
  [
    {
      guest: 3,
      home: 1,
      type: MatchType.DO501,
    },
    {
      guest: 4,
      home: 2,
      type: MatchType.CRICKET,
    },
    {
      guest: 1,
      home: 3,
      type: MatchType.DO501,
    },
    {
      guest: 2,
      home: 4,
      type: MatchType.DO501,
    },
  ],
  [
    {
      guest: 3,
      home: 4,
      type: MatchType.DO501,
    },
    {
      guest: 4,
      home: 3,
      type: MatchType.DO501,
    },
    {
      guest: 1,
      home: 2,
      type: MatchType.DO501,
    },
    {
      guest: 2,
      home: 1,
      type: MatchType.CRICKET,
    },
  ],
  [
    {
      guest: 4,
      home: 4,
      type: MatchType.DO501,
    },
    {
      guest: 3,
      home: 3,
      type: MatchType.CRICKET,
    },
    {
      guest: 2,
      home: 2,
      type: MatchType.DO501,
    },
    {
      guest: 1,
      home: 1,
      type: MatchType.DO501,
    },
  ],
]
