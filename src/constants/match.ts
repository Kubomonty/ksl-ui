import { MatchGame, MatchLegs, NullableMatchLegs } from '../models'
import { MatchType } from '../enums'

export const EMPTY_MATCH_LEGS_NULL: NullableMatchLegs = {
  qtr1: { game1: { home: null, guest: null }, game2: { home: null, guest: null }, game3: { home: null, guest: null }, game4: { home: null, guest: null } },
  qtr2: { game1: { home: null, guest: null }, game2: { home: null, guest: null }, game3: { home: null, guest: null }, game4: { home: null, guest: null } },
  qtr3: { game1: { home: null, guest: null }, game2: { home: null, guest: null }, game3: { home: null, guest: null }, game4: { home: null, guest: null } },
  qtr4: { game1: { home: null, guest: null }, game2: { home: null, guest: null }, game3: { home: null, guest: null }, game4: { home: null, guest: null } },
}
export const EMPTY_MATCH_LEGS: MatchLegs = {
  qtr1: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
  qtr2: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
  qtr3: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
  qtr4: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
}
export const EMPTY_OT_LEGS: { game1: MatchGame, game2: MatchGame, game3: MatchGame } = {
  game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 },
}
export const MATCH_OPPONENTS_STRUCTURE = [
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
export const MAX_SUBSTITUTIONS_COUNT = 4
