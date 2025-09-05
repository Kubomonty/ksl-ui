import { MatchGame, MatchLegs, MatchQuarter, MatchUpdateDto, NullableMatchGame, NullableMatchLegs, NullableMatchQuarter, PlayerDto, PlayersSubstitutionDto, TeamDto } from '../models'
import { useAuthStore, useMatchStore, useTeamStore } from '../stores'
import { MatchStatus } from '../enums'
import { EMPTY_MATCH_LEGS } from '../constants'
import { storeToRefs } from 'pinia'

const matchStore = useMatchStore()
const { selectedMatchDetails } = storeToRefs(matchStore)

const authStore = useAuthStore()
const { loggedInUser } = storeToRefs(authStore)

const teamStore = useTeamStore()
const { getTeamById } = teamStore

export const getPlayer = (team: TeamDto | undefined | null, playerId: string | undefined): PlayerDto | null => {
  if (!team || !playerId) {
    return null
  }

  return team.players.find(player => player.id === playerId) || null
}

const createGameState = (game: NullableMatchGame): MatchGame => ({
  guest: game.guest !== null && +game.guest === 2 ? 1 : 0,
  home: game.home !== null && +game.home === 2 ? 1 : 0,
})

const createQuarterState = (quarter: NullableMatchQuarter): MatchQuarter => ({
  game1: createGameState(quarter.game1),
  game2: createGameState(quarter.game2),
  game3: createGameState(quarter.game3),
  game4: createGameState(quarter.game4),
})

const sumGameScores = (nonSummedQuarter: MatchQuarter, previousQuarterLastGame: MatchGame): MatchQuarter => {
  let cumulativeGuest = previousQuarterLastGame.guest
  let cumulativeHome = previousQuarterLastGame.home

  return {
    game1: {
      guest: cumulativeGuest += nonSummedQuarter.game1.guest,
      home: cumulativeHome += nonSummedQuarter.game1.home,
    },
    game2: {
      guest: cumulativeGuest += nonSummedQuarter.game2.guest,
      home: cumulativeHome += nonSummedQuarter.game2.home,
    },
    game3: {
      guest: cumulativeGuest += nonSummedQuarter.game3.guest,
      home: cumulativeHome += nonSummedQuarter.game3.home,
    },
    game4: {
      guest: cumulativeGuest += nonSummedQuarter.game4.guest,
      home: cumulativeHome += nonSummedQuarter.game4.home,
    },
  }
}

export const getSubstititionSum: ComputedRef<MatchGame> = computed(() => {
  const quarters = selectedMatchDetails?.value?.quarters

  if (!quarters) {
    return { guest: 0, home: 0 }
  }

  const positions = ['pos1', 'pos2', 'pos3', 'pos4'] as const
  const teams = ['guest', 'home'] as const
  const calculateSubstitutions = (team: typeof teams[number]) => {
    return ['q1', 'q2', 'q3', 'q4']
      .slice(1) // Start from q2
      .reduce((sum, quarter, index) => {
        const prevQuarter = `q${index + 1}` as keyof typeof quarters
        const currentQuarter = quarter as keyof typeof quarters

        const substitutions = positions.filter(
          pos => quarters[currentQuarter][team][pos] !== quarters[prevQuarter][team][pos]
        ).length

        return sum + substitutions
      }, 0)
  }

  const guest = calculateSubstitutions('guest')
  const home = calculateSubstitutions('home')

  return { guest, home }
})

export const getMatchLegsQuarterSum = (quarter: NullableMatchQuarter): MatchGame => {
  return {
    home: +(quarter.game1.home ?? 0) + +(quarter.game2.home ?? 0) + +(quarter.game3.home ?? 0) + +(quarter.game4.home ?? 0),
    guest: +(quarter.game1.guest ?? 0) + +(quarter.game2.guest ?? 0) + +(quarter.game3.guest ?? 0) + +(quarter.game4.guest ?? 0),
  }
}

export const getMatchLegsTotals: ComputedRef<MatchLegs> = computed((): MatchLegs => {
  const quarters = selectedMatchDetails?.value?.quarters
  const matchLegs: MatchLegs = { ...EMPTY_MATCH_LEGS }
  if (!quarters) {
    return matchLegs
  }
  matchLegs.qtr1.game1 = { home: +quarters.q1.home.legs.m1, guest: +quarters.q1.guest.legs.m1 }
  matchLegs.qtr1.game2 = { home: +quarters.q1.home.legs.m2 + matchLegs.qtr1.game1.home, guest: +quarters.q1.guest.legs.m2 + matchLegs.qtr1.game1.guest }
  matchLegs.qtr1.game3 = { home: +quarters.q1.home.legs.m3 + matchLegs.qtr1.game2.home, guest: +quarters.q1.guest.legs.m3 + matchLegs.qtr1.game2.guest }
  matchLegs.qtr1.game4 = { home: +quarters.q1.home.legs.m4 + matchLegs.qtr1.game3.home, guest: +quarters.q1.guest.legs.m4 + matchLegs.qtr1.game3.guest }

  matchLegs.qtr2.game1 = { home: +quarters.q2.home.legs.m1 + matchLegs.qtr1.game4.home, guest: +quarters.q2.guest.legs.m1 + matchLegs.qtr1.game4.guest }
  matchLegs.qtr2.game2 = { home: +quarters.q2.home.legs.m2 + matchLegs.qtr2.game1.home, guest: +quarters.q2.guest.legs.m2 + matchLegs.qtr2.game1.guest }
  matchLegs.qtr2.game3 = { home: +quarters.q2.home.legs.m3 + matchLegs.qtr2.game2.home, guest: +quarters.q2.guest.legs.m3 + matchLegs.qtr2.game2.guest }
  matchLegs.qtr2.game4 = { home: +quarters.q2.home.legs.m4 + matchLegs.qtr2.game3.home, guest: +quarters.q2.guest.legs.m4 + matchLegs.qtr2.game3.guest }

  matchLegs.qtr3.game1 = { home: +quarters.q3.home.legs.m1 + matchLegs.qtr2.game4.home, guest: +quarters.q3.guest.legs.m1 + matchLegs.qtr2.game4.guest }
  matchLegs.qtr3.game2 = { home: +quarters.q3.home.legs.m2 + matchLegs.qtr3.game1.home, guest: +quarters.q3.guest.legs.m2 + matchLegs.qtr3.game1.guest }
  matchLegs.qtr3.game3 = { home: +quarters.q3.home.legs.m3 + matchLegs.qtr3.game2.home, guest: +quarters.q3.guest.legs.m3 + matchLegs.qtr3.game2.guest }
  matchLegs.qtr3.game4 = { home: +quarters.q3.home.legs.m4 + matchLegs.qtr3.game3.home, guest: +quarters.q3.guest.legs.m4 + matchLegs.qtr3.game3.guest }

  matchLegs.qtr4.game1 = { home: +quarters.q4.home.legs.m1 + matchLegs.qtr3.game4.home, guest: +quarters.q4.guest.legs.m1 + matchLegs.qtr3.game4.guest }
  matchLegs.qtr4.game2 = { home: +quarters.q4.home.legs.m2 + matchLegs.qtr4.game1.home, guest: +quarters.q4.guest.legs.m2 + matchLegs.qtr4.game1.guest }
  matchLegs.qtr4.game3 = { home: +quarters.q4.home.legs.m3 + matchLegs.qtr4.game2.home, guest: +quarters.q4.guest.legs.m3 + matchLegs.qtr4.game2.guest }
  matchLegs.qtr4.game4 = { home: +quarters.q4.home.legs.m4 + matchLegs.qtr4.game3.home, guest: +quarters.q4.guest.legs.m4 + matchLegs.qtr4.game3.guest }

  return matchLegs
})

export const getMachLegsQ1: ComputedRef<NullableMatchQuarter> = computed((): NullableMatchQuarter => {
  return {
    game1: {
      home: selectedMatchDetails?.value?.quarters.q1.home.legs.m1 || null,
      guest: selectedMatchDetails?.value?.quarters.q1.guest.legs.m1 || null,
    },
    game2: {
      home: selectedMatchDetails?.value?.quarters.q1.home.legs.m2 || null,
      guest: selectedMatchDetails?.value?.quarters.q1.guest.legs.m2 || null,
    },
    game3: {
      home: selectedMatchDetails?.value?.quarters.q1.home.legs.m3 || null,
      guest: selectedMatchDetails?.value?.quarters.q1.guest.legs.m3 || null,
    },
    game4: {
      home: selectedMatchDetails?.value?.quarters.q1.home.legs.m4 || null,
      guest: selectedMatchDetails?.value?.quarters.q1.guest.legs.m4 || null,
    },
  }
})
export const getMachLegsQ2: ComputedRef<NullableMatchQuarter> = computed((): NullableMatchQuarter => {
  return {
    game1: {
      home: selectedMatchDetails?.value?.quarters.q2.home.legs.m1 || null,
      guest: selectedMatchDetails?.value?.quarters.q2.guest.legs.m1 || null,
    },
    game2: {
      home: selectedMatchDetails?.value?.quarters.q2.home.legs.m2 || null,
      guest: selectedMatchDetails?.value?.quarters.q2.guest.legs.m2 || null,
    },
    game3: {
      home: selectedMatchDetails?.value?.quarters.q2.home.legs.m3 || null,
      guest: selectedMatchDetails?.value?.quarters.q2.guest.legs.m3 || null,
    },
    game4: {
      home: selectedMatchDetails?.value?.quarters.q2.home.legs.m4 || null,
      guest: selectedMatchDetails?.value?.quarters.q2.guest.legs.m4 || null,
    },
  }
})
export const getMachLegsQ3: ComputedRef<NullableMatchQuarter> = computed((): NullableMatchQuarter => {
  return {
    game1: {
      home: selectedMatchDetails?.value?.quarters.q3.home.legs.m1 || null,
      guest: selectedMatchDetails?.value?.quarters.q3.guest.legs.m1 || null,
    },
    game2: {
      home: selectedMatchDetails?.value?.quarters.q3.home.legs.m2 || null,
      guest: selectedMatchDetails?.value?.quarters.q3.guest.legs.m2 || null,
    },
    game3: {
      home: selectedMatchDetails?.value?.quarters.q3.home.legs.m3 || null,
      guest: selectedMatchDetails?.value?.quarters.q3.guest.legs.m3 || null,
    },
    game4: {
      home: selectedMatchDetails?.value?.quarters.q3.home.legs.m4 || null,
      guest: selectedMatchDetails?.value?.quarters.q3.guest.legs.m4 || null,
    },
  }
})
export const getMachLegsQ4: ComputedRef<NullableMatchQuarter> = computed((): NullableMatchQuarter => {
  return {
    game1: {
      home: selectedMatchDetails?.value?.quarters.q4.home.legs.m1 || null,
      guest: selectedMatchDetails?.value?.quarters.q4.guest.legs.m1 || null,
    },
    game2: {
      home: selectedMatchDetails?.value?.quarters.q4.home.legs.m2 || null,
      guest: selectedMatchDetails?.value?.quarters.q4.guest.legs.m2 || null,
    },
    game3: {
      home: selectedMatchDetails?.value?.quarters.q4.home.legs.m3 || null,
      guest: selectedMatchDetails?.value?.quarters.q4.guest.legs.m3 || null,
    },
    game4: {
      home: selectedMatchDetails?.value?.quarters.q4.home.legs.m4 || null,
      guest: selectedMatchDetails?.value?.quarters.q4.guest.legs.m4 || null,
    },
  }
})
export const getMachLegsOT: ComputedRef<{
  game1: MatchGame, game2: MatchGame, game3: MatchGame
}> = computed((): { game1: MatchGame, game2: MatchGame, game3: MatchGame } => {
  return {
    game1: {
      home: selectedMatchDetails?.value?.overtime?.home.legs.m1 || 0,
      guest: selectedMatchDetails?.value?.overtime?.guest.legs.m1 || 0,
    },
    game2: {
      home: selectedMatchDetails?.value?.overtime?.home.legs.m2 || 0,
      guest: selectedMatchDetails?.value?.overtime?.guest.legs.m2 || 0,
    },
    game3: {
      home: selectedMatchDetails?.value?.overtime?.home.legs.m3 || 0,
      guest: selectedMatchDetails?.value?.overtime?.guest.legs.m3 || 0,
    },
  }
})

export const getMatchState = (matchLegs: NullableMatchLegs) => {
  const nonSummedQtr1 = createQuarterState(matchLegs.qtr1)
  const nonSummedQtr2 = createQuarterState(matchLegs.qtr2)
  const nonSummedQtr3 = createQuarterState(matchLegs.qtr3)
  const nonSummedQtr4 = createQuarterState(matchLegs.qtr4)

  const qtr1 = sumGameScores(nonSummedQtr1, { guest: 0, home: 0 })
  const qtr2 = sumGameScores(nonSummedQtr2, qtr1.game4)
  const qtr3 = sumGameScores(nonSummedQtr3, qtr2.game4)
  const qtr4 = sumGameScores(nonSummedQtr4, qtr3.game4)

  return { qtr1, qtr2, qtr3, qtr4 }
}

export const getMatchUpdateDto = (
  matchLegs: NullableMatchLegs,
  matchState: {
    qtr1: MatchQuarter;
    qtr2: MatchQuarter;
    qtr3: MatchQuarter;
    qtr4: MatchQuarter;
  },
  overtimeLegs?: { game1: MatchGame, game2: MatchGame, game3: MatchGame },
  overtimePlayers?: {
    guest: { player: PlayerDto | null | undefined, position: string }[],
    home: { player: PlayerDto | null | undefined, position: string }[]
  }
): MatchUpdateDto | null => {
  if (!selectedMatchDetails?.value || !loggedInUser?.value) {
    return null
  }
  const matchDto: MatchUpdateDto = {
    id: selectedMatchDetails.value.id!,
    status: MatchStatus.IN_PROGRESS,
    statusChangetAt: new Date(),
    statusChangedBy: loggedInUser.value.id,
    quarters: {
      q1: {
        guest: {
          pos1: selectedMatchDetails.value.quarters.q1.guest.pos1,
          pos2: selectedMatchDetails.value.quarters.q1.guest.pos2,
          pos3: selectedMatchDetails.value.quarters.q1.guest.pos3,
          pos4: selectedMatchDetails.value.quarters.q1.guest.pos4,
          pos5: selectedMatchDetails.value.quarters.q1.guest.pos5,
          pos6: selectedMatchDetails.value.quarters.q1.guest.pos6,
          pos7: selectedMatchDetails.value.quarters.q1.guest.pos7,
          pos8: selectedMatchDetails.value.quarters.q1.guest.pos8,
          legs: {
            m1: matchLegs.qtr1.game1.guest,
            m2: matchLegs.qtr1.game2.guest,
            m3: matchLegs.qtr1.game3.guest,
            m4: matchLegs.qtr1.game4.guest,
          },
          score: matchState.qtr1.game4.guest,
        },
        home: {
          pos1: selectedMatchDetails.value.quarters.q1.home.pos1,
          pos2: selectedMatchDetails.value.quarters.q1.home.pos2,
          pos3: selectedMatchDetails.value.quarters.q1.home.pos3,
          pos4: selectedMatchDetails.value.quarters.q1.home.pos4,
          pos5: selectedMatchDetails.value.quarters.q1.home.pos5,
          pos6: selectedMatchDetails.value.quarters.q1.home.pos6,
          pos7: selectedMatchDetails.value.quarters.q1.home.pos7,
          pos8: selectedMatchDetails.value.quarters.q1.home.pos8,
          legs: {
            m1: matchLegs.qtr1.game1.home,
            m2: matchLegs.qtr1.game2.home,
            m3: matchLegs.qtr1.game3.home,
            m4: matchLegs.qtr1.game4.home,
          },
          score: matchState.qtr1.game4.home,
        },
      },
      q2: {
        guest: {
          pos1: selectedMatchDetails.value.quarters.q2.guest.pos1,
          pos2: selectedMatchDetails.value.quarters.q2.guest.pos2,
          pos3: selectedMatchDetails.value.quarters.q2.guest.pos3,
          pos4: selectedMatchDetails.value.quarters.q2.guest.pos4,
          pos5: selectedMatchDetails.value.quarters.q2.guest.pos5,
          pos6: selectedMatchDetails.value.quarters.q2.guest.pos6,
          pos7: selectedMatchDetails.value.quarters.q2.guest.pos7,
          pos8: selectedMatchDetails.value.quarters.q2.guest.pos8,
          legs: {
            m1: matchLegs.qtr2.game1.guest,
            m2: matchLegs.qtr2.game2.guest,
            m3: matchLegs.qtr2.game3.guest,
            m4: matchLegs.qtr2.game4.guest,
          },
          score: matchState.qtr2.game4.guest,
        },
        home: {
          pos1: selectedMatchDetails.value.quarters.q2.home.pos1,
          pos2: selectedMatchDetails.value.quarters.q2.home.pos2,
          pos3: selectedMatchDetails.value.quarters.q2.home.pos3,
          pos4: selectedMatchDetails.value.quarters.q2.home.pos4,
          pos5: selectedMatchDetails.value.quarters.q2.home.pos5,
          pos6: selectedMatchDetails.value.quarters.q2.home.pos6,
          pos7: selectedMatchDetails.value.quarters.q2.home.pos7,
          pos8: selectedMatchDetails.value.quarters.q2.home.pos8,
          legs: {
            m1: matchLegs.qtr2.game1.home,
            m2: matchLegs.qtr2.game2.home,
            m3: matchLegs.qtr2.game3.home,
            m4: matchLegs.qtr2.game4.home,
          },
          score: matchState.qtr2.game4.home,
        },
      },
      q3: {
        guest: {
          pos1: selectedMatchDetails.value.quarters.q3.guest.pos1,
          pos2: selectedMatchDetails.value.quarters.q3.guest.pos2,
          pos3: selectedMatchDetails.value.quarters.q3.guest.pos3,
          pos4: selectedMatchDetails.value.quarters.q3.guest.pos4,
          pos5: selectedMatchDetails.value.quarters.q3.guest.pos5,
          pos6: selectedMatchDetails.value.quarters.q3.guest.pos6,
          pos7: selectedMatchDetails.value.quarters.q3.guest.pos7,
          pos8: selectedMatchDetails.value.quarters.q3.guest.pos8,
          legs: {
            m1: matchLegs.qtr3.game1.guest,
            m2: matchLegs.qtr3.game2.guest,
            m3: matchLegs.qtr3.game3.guest,
            m4: matchLegs.qtr3.game4.guest,
          },
          score: matchState.qtr3.game4.guest,
        },
        home: {
          pos1: selectedMatchDetails.value.quarters.q3.home.pos1,
          pos2: selectedMatchDetails.value.quarters.q3.home.pos2,
          pos3: selectedMatchDetails.value.quarters.q3.home.pos3,
          pos4: selectedMatchDetails.value.quarters.q3.home.pos4,
          pos5: selectedMatchDetails.value.quarters.q3.home.pos5,
          pos6: selectedMatchDetails.value.quarters.q3.home.pos6,
          pos7: selectedMatchDetails.value.quarters.q3.home.pos7,
          pos8: selectedMatchDetails.value.quarters.q3.home.pos8,
          legs: {
            m1: matchLegs.qtr3.game1.home,
            m2: matchLegs.qtr3.game2.home,
            m3: matchLegs.qtr3.game3.home,
            m4: matchLegs.qtr3.game4.home,
          },
          score: matchState.qtr3.game4.home,
        },
      },
      q4: {
        guest: {
          pos1: selectedMatchDetails.value.quarters.q4.guest.pos1,
          pos2: selectedMatchDetails.value.quarters.q4.guest.pos2,
          pos3: selectedMatchDetails.value.quarters.q4.guest.pos3,
          pos4: selectedMatchDetails.value.quarters.q4.guest.pos4,
          pos5: selectedMatchDetails.value.quarters.q4.guest.pos5,
          pos6: selectedMatchDetails.value.quarters.q4.guest.pos6,
          pos7: selectedMatchDetails.value.quarters.q4.guest.pos7,
          pos8: selectedMatchDetails.value.quarters.q4.guest.pos8,
          legs: {
            m1: matchLegs.qtr4.game1.guest,
            m2: matchLegs.qtr4.game2.guest,
            m3: matchLegs.qtr4.game3.guest,
            m4: matchLegs.qtr4.game4.guest,
          },
          score: matchState.qtr4.game4.guest,
        },
        home: {
          pos1: selectedMatchDetails.value.quarters.q4.home.pos1,
          pos2: selectedMatchDetails.value.quarters.q4.home.pos2,
          pos3: selectedMatchDetails.value.quarters.q4.home.pos3,
          pos4: selectedMatchDetails.value.quarters.q4.home.pos4,
          pos5: selectedMatchDetails.value.quarters.q4.home.pos5,
          pos6: selectedMatchDetails.value.quarters.q4.home.pos6,
          pos7: selectedMatchDetails.value.quarters.q4.home.pos7,
          pos8: selectedMatchDetails.value.quarters.q4.home.pos8,
          legs: {
            m1: matchLegs.qtr4.game1.home,
            m2: matchLegs.qtr4.game2.home,
            m3: matchLegs.qtr4.game3.home,
            m4: matchLegs.qtr4.game4.home,
          },
          score: matchState.qtr4.game4.home,
        },
      },
    },
  }
  if (overtimeLegs && overtimePlayers && matchState.qtr4.game4.guest === 8 && matchState.qtr4.game4.home === 8) {
    matchDto.overtime = {
      guest: {
        pos1: overtimePlayers.guest.find(player => player.position === 'G1')?.player?.id || null,
        pos2: overtimePlayers.guest.find(player => player.position === 'G2')?.player?.id || null,
        pos3: overtimePlayers.guest.find(player => player.position === 'G3')?.player?.id || null,
        pos4: overtimePlayers.guest.find(player => player.position === 'G4')?.player?.id || null,
        pos5: overtimePlayers.guest.find(player => player.position === 'G5')?.player?.id || null,
        pos6: overtimePlayers.guest.find(player => player.position === 'G6')?.player?.id || null,
        legs: {
          m1: +overtimeLegs.game1.guest,
          m2: +overtimeLegs.game2.guest,
          m3: +overtimeLegs.game3.guest,
        },
        score: +overtimeLegs.game3.guest + +overtimeLegs.game2.guest + +overtimeLegs.game1.guest,
      },
      home: {
        pos1: overtimePlayers.home.find(player => player.position === 'H1')?.player?.id || null,
        pos2: overtimePlayers.home.find(player => player.position === 'H2')?.player?.id || null,
        pos3: overtimePlayers.home.find(player => player.position === 'H3')?.player?.id || null,
        pos4: overtimePlayers.home.find(player => player.position === 'H4')?.player?.id || null,
        pos5: overtimePlayers.home.find(player => player.position === 'H5')?.player?.id || null,
        pos6: overtimePlayers.home.find(player => player.position === 'H6')?.player?.id || null,
        legs: {
          m1: +overtimeLegs.game1.home,
          m2: +overtimeLegs.game2.home,
          m3: +overtimeLegs.game3.home,
        },
        score: +overtimeLegs.game3.home + +overtimeLegs.game2.home + +overtimeLegs.game1.home,
      },
    }
  }

  return matchDto
}

export const guestTeam: ComputedRef<TeamDto | null | undefined> = computed((): TeamDto | null | undefined => {
  return selectedMatchDetails?.value?.guestTeam ? getTeamById(selectedMatchDetails.value.guestTeam) : null
})
export const guestTeamPlayers: ComputedRef<{
  q1: { player: PlayerDto | null | undefined; position: string }[];
  q2: { player: PlayerDto | null | undefined; position: string }[];
  q3: { player: PlayerDto | null | undefined; position: string }[];
  q4: { player: PlayerDto | null | undefined; position: string }[];
}> = computed(() => {
  if (!selectedMatchDetails?.value?.guestTeam) {
    return { q1: [], q2: [], q3: [], q4: [] }
  }

  const guestTeamId = selectedMatchDetails.value.guestTeam
  const team = getTeamById(guestTeamId)

  const generateQuarterPlayers = (
    quarter: any
  ): { player: PlayerDto | null | undefined; position: string }[] => {
    const positions = Array.from({ length: 8 }, (_, i) => `pos${i + 1}`)
    return positions
      .map((pos, index) => {
        const player = quarter.guest[pos]
        return player
          ? { player: getPlayer(team, player), position: `G${index + 1}` }
          : null
      })
      .filter(Boolean) as { player: PlayerDto | null | undefined; position: string }[]
  }

  return {
    q1: generateQuarterPlayers(selectedMatchDetails.value.quarters.q1),
    q2: generateQuarterPlayers(selectedMatchDetails.value.quarters.q2),
    q3: generateQuarterPlayers(selectedMatchDetails.value.quarters.q3),
    q4: generateQuarterPlayers(selectedMatchDetails.value.quarters.q4),
  }
})
export const guestOTPlayers: ComputedRef<{ player: PlayerDto | null | undefined; position: string }[]> = computed(() => {
  if (!selectedMatchDetails?.value?.guestTeam ||
    [
      selectedMatchDetails?.value?.overtime?.guest.pos1,
      selectedMatchDetails?.value?.overtime?.guest.pos2,
      selectedMatchDetails?.value?.overtime?.guest.pos3,
      selectedMatchDetails?.value?.overtime?.guest.pos4,
    ].filter(position => !!position).length < 3
  ) {
    return [
      { player: undefined as PlayerDto | null | undefined, position: 'G1' },
      { player: undefined as PlayerDto | null | undefined, position: 'G2' },
      { player: undefined as PlayerDto | null | undefined, position: 'G3' },
      { player: undefined as PlayerDto | null | undefined, position: 'G4' },
      { player: undefined as PlayerDto | null | undefined, position: 'G5' },
      { player: undefined as PlayerDto | null | undefined, position: 'G6' },
    ]
  }
  const guestTeamId = selectedMatchDetails.value.guestTeam
  const team = getTeamById(guestTeamId)
  const positions = Array.from({ length: 6 }, (_, i) => `pos${i + 1}`)

  const returnPositions = positions
    .map((pos, index) => {
      const player = selectedMatchDetails.value?.overtime?.guest[pos as keyof typeof selectedMatchDetails.value.overtime.guest] as string | undefined
      return { player: getPlayer(team, player) || null, position: `G${index + 1}` }
    })
    .filter(Boolean) as { player: PlayerDto | null | undefined; position: string }[]

  return returnPositions
})

export const homeTeam: ComputedRef<TeamDto | null | undefined> = computed((): TeamDto | null | undefined => {
  return selectedMatchDetails?.value?.homeTeam ? getTeamById(selectedMatchDetails?.value?.homeTeam) : null
})
export const homeTeamPlayers: ComputedRef<{
  q1: { player: PlayerDto | null | undefined; position: string }[];
  q2: { player: PlayerDto | null | undefined; position: string }[];
  q3: { player: PlayerDto | null | undefined; position: string }[];
  q4: { player: PlayerDto | null | undefined; position: string }[];
}> = computed(() => {
  if (!selectedMatchDetails?.value?.homeTeam) {
    return { q1: [], q2: [], q3: [], q4: [] }
  }

  const homeTeamId = selectedMatchDetails.value.homeTeam
  const team = getTeamById(homeTeamId)

  const generateQuarterPlayers = (
    quarter: any
  ): { player: PlayerDto | null | undefined; position: string }[] => {
    const positions = Array.from({ length: 8 }, (_, i) => `pos${i + 1}`)
    return positions
      .map((pos, index) => {
        const player = quarter.home[pos]
        return player
          ? { player: getPlayer(team, player), position: `H${index + 1}` }
          : null
      })
      .filter(Boolean) as { player: PlayerDto | null | undefined; position: string }[]
  }

  return {
    q1: generateQuarterPlayers(selectedMatchDetails.value.quarters.q1),
    q2: generateQuarterPlayers(selectedMatchDetails.value.quarters.q2),
    q3: generateQuarterPlayers(selectedMatchDetails.value.quarters.q3),
    q4: generateQuarterPlayers(selectedMatchDetails.value.quarters.q4),
  }
})
export const homeOtPlayers: ComputedRef<{ player: PlayerDto | null | undefined; position: string }[]> = computed(() => {
  if (
    !selectedMatchDetails?.value?.homeTeam ||
    [
      selectedMatchDetails?.value?.overtime?.home.pos1,
      selectedMatchDetails?.value?.overtime?.home.pos2,
      selectedMatchDetails?.value?.overtime?.home.pos3,
      selectedMatchDetails?.value?.overtime?.home.pos4,
    ].filter(position => !!position).length < 3
  ) {
    return [
      { player: undefined as PlayerDto | null | undefined, position: 'H1' },
      { player: undefined as PlayerDto | null | undefined, position: 'H2' },
      { player: undefined as PlayerDto | null | undefined, position: 'H3' },
      { player: undefined as PlayerDto | null | undefined, position: 'H4' },
      { player: undefined as PlayerDto | null | undefined, position: 'H5' },
      { player: undefined as PlayerDto | null | undefined, position: 'H6' },
    ]
  }
  const homeTeamId = selectedMatchDetails.value.homeTeam
  const team = getTeamById(homeTeamId)
  const positions = Array.from({ length: 6 }, (_, i) => `pos${i + 1}`)

  const returnPositions = positions
    .map((pos, index) => {
      const player = selectedMatchDetails.value?.overtime?.home[pos as keyof typeof selectedMatchDetails.value.overtime.home] as string | undefined
      return { player: getPlayer(team, player) || null, position: `H${index + 1}` }
    })
    .filter(Boolean) as { player: PlayerDto | null | undefined; position: string }[]

  return returnPositions
})

export const handleGuestRosterUpdateQ4 = (newRoster: PlayersSubstitutionDto[]) => {
  if (!selectedMatchDetails?.value) {
    return
  }
  selectedMatchDetails.value.quarters.q4.guest.pos1 = newRoster.find(player => player.position === 'G1')?.player!.id!
  selectedMatchDetails.value.quarters.q4.guest.pos2 = newRoster.find(player => player.position === 'G2')?.player!.id!
  selectedMatchDetails.value.quarters.q4.guest.pos3 = newRoster.find(player => player.position === 'G3')?.player!.id!
  selectedMatchDetails.value.quarters.q4.guest.pos4 = newRoster.find(player => player.position === 'G4')?.player?.id || ''
  selectedMatchDetails.value.quarters.q4.guest.pos5 = newRoster.find(player => player.position === 'G5')?.player?.id || ''
  selectedMatchDetails.value.quarters.q4.guest.pos6 = newRoster.find(player => player.position === 'G6')?.player?.id || ''
  selectedMatchDetails.value.quarters.q4.guest.pos7 = newRoster.find(player => player.position === 'G7')?.player?.id || ''
  selectedMatchDetails.value.quarters.q4.guest.pos8 = newRoster.find(player => player.position === 'G8')?.player?.id || ''
}
export const handleGuestRosterUpdateQ3 = (newRoster: PlayersSubstitutionDto[]) => {
  if (!selectedMatchDetails?.value) {
    return
  }
  selectedMatchDetails.value.quarters.q3.guest.pos1 = newRoster.find(player => player.position === 'G1')?.player!.id!
  selectedMatchDetails.value.quarters.q3.guest.pos2 = newRoster.find(player => player.position === 'G2')?.player!.id!
  selectedMatchDetails.value.quarters.q3.guest.pos3 = newRoster.find(player => player.position === 'G3')?.player!.id!
  selectedMatchDetails.value.quarters.q3.guest.pos4 = newRoster.find(player => player.position === 'G4')?.player?.id || ''
  selectedMatchDetails.value.quarters.q3.guest.pos5 = newRoster.find(player => player.position === 'G5')?.player?.id || ''
  selectedMatchDetails.value.quarters.q3.guest.pos6 = newRoster.find(player => player.position === 'G6')?.player?.id || ''
  selectedMatchDetails.value.quarters.q3.guest.pos7 = newRoster.find(player => player.position === 'G7')?.player?.id || ''
  selectedMatchDetails.value.quarters.q3.guest.pos8 = newRoster.find(player => player.position === 'G8')?.player?.id || ''
  handleGuestRosterUpdateQ4(newRoster)
}
export const handleGuestRosterUpdateQ2 = (newRoster: PlayersSubstitutionDto[]) => {
  if (!selectedMatchDetails?.value) {
    return
  }
  selectedMatchDetails.value.quarters.q2.guest.pos1 = newRoster.find(player => player.position === 'G1')?.player!.id!
  selectedMatchDetails.value.quarters.q2.guest.pos2 = newRoster.find(player => player.position === 'G2')?.player!.id!
  selectedMatchDetails.value.quarters.q2.guest.pos3 = newRoster.find(player => player.position === 'G3')?.player!.id!
  selectedMatchDetails.value.quarters.q2.guest.pos4 = newRoster.find(player => player.position === 'G4')?.player?.id || ''
  selectedMatchDetails.value.quarters.q2.guest.pos5 = newRoster.find(player => player.position === 'G5')?.player?.id || ''
  selectedMatchDetails.value.quarters.q2.guest.pos6 = newRoster.find(player => player.position === 'G6')?.player?.id || ''
  selectedMatchDetails.value.quarters.q2.guest.pos7 = newRoster.find(player => player.position === 'G7')?.player?.id || ''
  selectedMatchDetails.value.quarters.q2.guest.pos8 = newRoster.find(player => player.position === 'G8')?.player?.id || ''
  handleGuestRosterUpdateQ3(newRoster)
}
export const handleGuestRosterUpdateQ1 = (newRoster: PlayersSubstitutionDto[]) => {
  if (!selectedMatchDetails?.value) {
    return
  }
  selectedMatchDetails.value.quarters.q1.guest.pos1 = newRoster.find(player => player.position === 'G1')?.player!.id!
  selectedMatchDetails.value.quarters.q1.guest.pos2 = newRoster.find(player => player.position === 'G2')?.player!.id!
  selectedMatchDetails.value.quarters.q1.guest.pos3 = newRoster.find(player => player.position === 'G3')?.player!.id!
  selectedMatchDetails.value.quarters.q1.guest.pos4 = newRoster.find(player => player.position === 'G4')?.player?.id || ''
  selectedMatchDetails.value.quarters.q1.guest.pos5 = newRoster.find(player => player.position === 'G5')?.player?.id || ''
  selectedMatchDetails.value.quarters.q1.guest.pos6 = newRoster.find(player => player.position === 'G6')?.player?.id || ''
  selectedMatchDetails.value.quarters.q1.guest.pos7 = newRoster.find(player => player.position === 'G7')?.player?.id || ''
  selectedMatchDetails.value.quarters.q1.guest.pos8 = newRoster.find(player => player.position === 'G8')?.player?.id || ''
  handleGuestRosterUpdateQ2(newRoster)
}

export const handleHomeRosterUpdateQ4 = (newRoster: PlayersSubstitutionDto[]) => {
  if (!selectedMatchDetails?.value) {
    return
  }
  selectedMatchDetails.value.quarters.q4.home.pos1 = newRoster.find(player => player.position === 'H1')?.player!.id!
  selectedMatchDetails.value.quarters.q4.home.pos2 = newRoster.find(player => player.position === 'H2')?.player!.id!
  selectedMatchDetails.value.quarters.q4.home.pos3 = newRoster.find(player => player.position === 'H3')?.player!.id!
  selectedMatchDetails.value.quarters.q4.home.pos4 = newRoster.find(player => player.position === 'H4')?.player?.id || ''
  selectedMatchDetails.value.quarters.q4.home.pos5 = newRoster.find(player => player.position === 'H5')?.player?.id || ''
  selectedMatchDetails.value.quarters.q4.home.pos6 = newRoster.find(player => player.position === 'H6')?.player?.id || ''
  selectedMatchDetails.value.quarters.q4.home.pos7 = newRoster.find(player => player.position === 'H7')?.player?.id || ''
  selectedMatchDetails.value.quarters.q4.home.pos8 = newRoster.find(player => player.position === 'H8')?.player?.id || ''
}
export const handleHomeRosterUpdateQ3 = (newRoster: PlayersSubstitutionDto[]) => {
  if (!selectedMatchDetails?.value) {
    return
  }
  selectedMatchDetails.value.quarters.q3.home.pos1 = newRoster.find(player => player.position === 'H1')?.player!.id!
  selectedMatchDetails.value.quarters.q3.home.pos2 = newRoster.find(player => player.position === 'H2')?.player!.id!
  selectedMatchDetails.value.quarters.q3.home.pos3 = newRoster.find(player => player.position === 'H3')?.player!.id!
  selectedMatchDetails.value.quarters.q3.home.pos4 = newRoster.find(player => player.position === 'H4')?.player?.id || ''
  selectedMatchDetails.value.quarters.q3.home.pos5 = newRoster.find(player => player.position === 'H5')?.player?.id || ''
  selectedMatchDetails.value.quarters.q3.home.pos6 = newRoster.find(player => player.position === 'H6')?.player?.id || ''
  selectedMatchDetails.value.quarters.q3.home.pos7 = newRoster.find(player => player.position === 'H7')?.player?.id || ''
  selectedMatchDetails.value.quarters.q3.home.pos8 = newRoster.find(player => player.position === 'H8')?.player?.id || ''
  handleHomeRosterUpdateQ4(newRoster)
}
export const handleHomeRosterUpdateQ2 = (newRoster: PlayersSubstitutionDto[]) => {
  if (!selectedMatchDetails?.value) {
    return
  }
  selectedMatchDetails.value.quarters.q2.home.pos1 = newRoster.find(player => player.position === 'H1')?.player!.id!
  selectedMatchDetails.value.quarters.q2.home.pos2 = newRoster.find(player => player.position === 'H2')?.player!.id!
  selectedMatchDetails.value.quarters.q2.home.pos3 = newRoster.find(player => player.position === 'H3')?.player!.id!
  selectedMatchDetails.value.quarters.q2.home.pos4 = newRoster.find(player => player.position === 'H4')?.player?.id || ''
  selectedMatchDetails.value.quarters.q2.home.pos5 = newRoster.find(player => player.position === 'H5')?.player?.id || ''
  selectedMatchDetails.value.quarters.q2.home.pos6 = newRoster.find(player => player.position === 'H6')?.player?.id || ''
  selectedMatchDetails.value.quarters.q2.home.pos7 = newRoster.find(player => player.position === 'H7')?.player?.id || ''
  selectedMatchDetails.value.quarters.q2.home.pos8 = newRoster.find(player => player.position === 'H8')?.player?.id || ''
  handleHomeRosterUpdateQ3(newRoster)
}
export const handleHomeRosterUpdateQ1 = (newRoster: PlayersSubstitutionDto[]) => {
  if (!selectedMatchDetails?.value) {
    return
  }
  selectedMatchDetails.value.quarters.q1.home.pos1 = newRoster.find(player => player.position === 'H1')?.player!.id!
  selectedMatchDetails.value.quarters.q1.home.pos2 = newRoster.find(player => player.position === 'H2')?.player!.id!
  selectedMatchDetails.value.quarters.q1.home.pos3 = newRoster.find(player => player.position === 'H3')?.player!.id!
  selectedMatchDetails.value.quarters.q1.home.pos4 = newRoster.find(player => player.position === 'H4')?.player?.id || ''
  selectedMatchDetails.value.quarters.q1.home.pos5 = newRoster.find(player => player.position === 'H5')?.player?.id || ''
  selectedMatchDetails.value.quarters.q1.home.pos6 = newRoster.find(player => player.position === 'H6')?.player?.id || ''
  selectedMatchDetails.value.quarters.q1.home.pos7 = newRoster.find(player => player.position === 'H7')?.player?.id || ''
  selectedMatchDetails.value.quarters.q1.home.pos8 = newRoster.find(player => player.position === 'H8')?.player?.id || ''
  handleHomeRosterUpdateQ2(newRoster)
}
