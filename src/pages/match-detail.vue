<template>
  <v-card border flat>
    <v-container>
      <v-card-title>{{ `${ homeTeam!.teamName} vs. ${guestTeam!.teamName}` }}</v-card-title>
      <v-card-subtitle>{{ `${matchDetail!.matchLocation} - ${formattedMatchDateTime}` }}</v-card-subtitle>
      <v-card-text>
        <br>
        <span class="d-flex mb-2">
          <h4>{{ `${$t('game-no')} 1` }}</h4>
        </span>
        <match-table
          :guest-players="orderedGuestTeamPlayers"
          :home-players="orderedHomeTeamPlayers"
          :match-legs="matchLegs.qtr1"
          :match-state="matchState.qtr1"
          :qtr="1"
          @update:match-legs-guest="handleGuestLegsUpdate"
          @update:match-legs-home="handleHomeLegsUpdate"
        />
        <br>
        <match-table
          :guest-players="orderedGuestTeamPlayers"
          :home-players="orderedHomeTeamPlayers"
          :match-legs="matchLegs.qtr2"
          :match-state="matchState.qtr2"
          :qtr="2"
          @update:match-legs-guest="handleGuestLegsUpdate"
          @update:match-legs-home="handleHomeLegsUpdate"
        />
        <br>
        <match-table
          :guest-players="orderedGuestTeamPlayers"
          :home-players="orderedHomeTeamPlayers"
          :match-legs="matchLegs.qtr3"
          :match-state="matchState.qtr3"
          :qtr="3"
          @update:match-legs-guest="handleGuestLegsUpdate"
          @update:match-legs-home="handleHomeLegsUpdate"
        />
        <br>
        <match-table
          :guest-players="orderedGuestTeamPlayers"
          :home-players="orderedHomeTeamPlayers"
          :match-legs="matchLegs.qtr4"
          :match-state="matchState.qtr4"
          :qtr="4"
          @update:match-legs-guest="handleGuestLegsUpdate"
          @update:match-legs-home="handleHomeLegsUpdate"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="warning"
          variant="flat"
          @click="handleReturn"
        >{{ $t('back') }}</v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
  import { PlayerDto, TeamDto } from '../models'
  import { useMatchStore, useTeamStore } from '../stores'
  import { useRoute, useRouter } from 'vue-router'
  import { computed } from 'vue'
  import { format } from 'date-fns'
  import { storeToRefs } from 'pinia'

  type Game = { guest: number; home: number };
  type Quarter = {
    game1: Game;
    game2: Game;
    game3: Game;
    game4: Game;
  }
  const router = useRouter()
  const route = useRoute()

  const matchStore = useMatchStore()
  const { matches } = storeToRefs(matchStore)

  const teamStore = useTeamStore()
  const { getTeamById } = teamStore

  const matchDetail = computed(() => {
    return matches.value.find(match => match.id === route.query.id)
  })

  const createGameState = (game: Game): Game => ({
    guest: game.guest === 2 ? 1 : 0,
    home: game.home === 2 ? 1 : 0,
  })
  const createQuarterState = (quarter: Quarter): Quarter => ({
    game1: createGameState(quarter.game1),
    game2: createGameState(quarter.game2),
    game3: createGameState(quarter.game3),
    game4: createGameState(quarter.game4),
  })
  const sumGameScores = (nonSummedQuarter: Quarter, previousQuarterLastGame: Game): Quarter => {
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

  const matchLegs = ref({
    qtr1: {
      game1: {
        home: 0,
        guest: 2,
      },
      game2: {
        home: 1,
        guest: 2,
      },
      game3: {
        home: 0,
        guest: 2,
      },
      game4: {
        home: 0,
        guest: 2,
      },
    },
    qtr2: {
      game1: {
        home: 2,
        guest: 1,
      },
      game2: {
        home: 2,
        guest: 0,
      },
      game3: {
        home: 2,
        guest: 1,
      },
      game4: {
        home: 2,
        guest: 0,
      },
    },
    qtr3: {
      game1: {
        home: 2,
        guest: 0,
      },
      game2: {
        home: 2,
        guest: 0,
      },
      game3: {
        home: 2,
        guest: 0,
      },
      game4: {
        home: 2,
        guest: 0,
      },
    },
    qtr4: {
      game1: {
        home: 0,
        guest: 2,
      },
      game2: {
        home: 0,
        guest: 2,
      },
      game3: {
        home: 0,
        guest: 2,
      },
      game4: {
        home: 0,
        guest: 2,
      },
    },
  })
  const matchState = computed(() => {
    // Create initial quarter states without cumulative sums
    const nonSummedQtr1 = createQuarterState(matchLegs.value.qtr1)
    const nonSummedQtr2 = createQuarterState(matchLegs.value.qtr2)
    const nonSummedQtr3 = createQuarterState(matchLegs.value.qtr3)
    const nonSummedQtr4 = createQuarterState(matchLegs.value.qtr4)

    // Generate cumulative scores for each quarter
    const qtr1 = sumGameScores(nonSummedQtr1, { guest: 0, home: 0 })
    const qtr2 = sumGameScores(nonSummedQtr2, qtr1.game4)
    const qtr3 = sumGameScores(nonSummedQtr3, qtr2.game4)
    const qtr4 = sumGameScores(nonSummedQtr4, qtr3.game4)

    return { qtr1, qtr2, qtr3, qtr4 }
  })

  const handleHomeLegsUpdate = (values: {values: number[], qtr: number}) => {
    switch (values.qtr) {
      case 1:
        matchLegs.value.qtr1.game1.home = values.values[0]
        matchLegs.value.qtr1.game2.home = values.values[1]
        matchLegs.value.qtr1.game3.home = values.values[2]
        matchLegs.value.qtr1.game4.home = values.values[3]
        break
      case 2:
        matchLegs.value.qtr2.game1.home = values.values[0]
        matchLegs.value.qtr2.game2.home = values.values[1]
        matchLegs.value.qtr2.game3.home = values.values[2]
        matchLegs.value.qtr2.game4.home = values.values[3]
        break
      case 3:
        matchLegs.value.qtr3.game1.home = values.values[0]
        matchLegs.value.qtr3.game2.home = values.values[1]
        matchLegs.value.qtr3.game3.home = values.values[2]
        matchLegs.value.qtr3.game4.home = values.values[3]
        break
      case 4:
        matchLegs.value.qtr4.game1.home = values.values[0]
        matchLegs.value.qtr4.game2.home = values.values[1]
        matchLegs.value.qtr4.game3.home = values.values[2]
        matchLegs.value.qtr4.game4.home = values.values[3]
        break
    }
  }
  const handleGuestLegsUpdate = (values: {values: number[], qtr: number}) => {
    switch (values.qtr) {
      case 1:
        matchLegs.value.qtr1.game1.guest = values.values[0]
        matchLegs.value.qtr1.game2.guest = values.values[1]
        matchLegs.value.qtr1.game3.guest = values.values[2]
        matchLegs.value.qtr1.game4.guest = values.values[3]
        break
      case 2:
        matchLegs.value.qtr2.game1.guest = values.values[0]
        matchLegs.value.qtr2.game2.guest = values.values[1]
        matchLegs.value.qtr2.game3.guest = values.values[2]
        matchLegs.value.qtr2.game4.guest = values.values[3]
        break
      case 3:
        matchLegs.value.qtr3.game1.guest = values.values[0]
        matchLegs.value.qtr3.game2.guest = values.values[1]
        matchLegs.value.qtr3.game3.guest = values.values[2]
        matchLegs.value.qtr3.game4.guest = values.values[3]
        break
      case 4:
        matchLegs.value.qtr4.game1.guest = values.values[0]
        matchLegs.value.qtr4.game2.guest = values.values[1]
        matchLegs.value.qtr4.game3.guest = values.values[2]
        matchLegs.value.qtr4.game4.guest = values.values[3]
        break
    }
  }

  const getPlayer = (team: TeamDto | undefined | null, playerId: string | undefined): PlayerDto | null => {
    if (!team || !playerId) {
      return null
    }

    return team.players.find(player => player.id === playerId) || null
  }

  const homeTeam: ComputedRef<TeamDto | null | undefined> = computed((): TeamDto | null | undefined => {
    return matchDetail.value!.homeTeam ? getTeamById(matchDetail.value!.homeTeam) : null
  })
  const homeTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(
    (): { player: PlayerDto | null | undefined, position: string }[] => {
      const homePlayers: { player: PlayerDto | null | undefined, position: string }[] = [
        {
          player: getPlayer(homeTeam.value, matchDetail.value!.homePos1),
          position: 'H1',
        },
        {
          player: getPlayer(homeTeam.value, matchDetail.value!.homePos2),
          position: 'H2',
        },
        {
          player: getPlayer(homeTeam.value, matchDetail.value!.homePos3),
          position: 'H3',
        },
      ]
      if (matchDetail.value!.homePos4?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, matchDetail.value!.homePos4),
          position: 'H4',
        })
      }
      if (matchDetail.value!.homePos5?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, matchDetail.value!.homePos5),
          position: 'H5',
        })
      }
      if (matchDetail.value!.homePos6?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, matchDetail.value!.homePos6),
          position: 'H6',
        })
      }
      if (matchDetail.value!.homePos7?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, matchDetail.value!.homePos7),
          position: 'H7',
        })
      }
      if (matchDetail.value!.homePos8?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, matchDetail.value!.homePos8),
          position: 'H8',
        })
      }
      return homePlayers
    }
  )
  const orderedHomeTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(() => {
    return homeTeamPlayers.value.slice().sort((a, b) => a.position.localeCompare(b.position))
  })

  const guestTeam: ComputedRef<TeamDto | null | undefined> = computed((): TeamDto | null | undefined => {
    return matchDetail.value!.guestTeam ? getTeamById(matchDetail.value!.guestTeam) : null
  })
  const guestTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(
    (): { player: PlayerDto | null | undefined, position: string }[] => {
      const guestPlayers: { player: PlayerDto | null | undefined, position: string }[] = [
        {
          player: getPlayer(guestTeam.value, matchDetail.value!.guestPos1),
          position: 'G1',
        },
        {
          player: getPlayer(guestTeam.value, matchDetail.value!.guestPos2),
          position: 'G2',
        },
        {
          player: getPlayer(guestTeam.value, matchDetail.value!.guestPos3),
          position: 'G3',
        },
      ]
      if (matchDetail.value!.guestPos4?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, matchDetail.value!.guestPos4),
          position: 'G4',
        })
      }
      if (matchDetail.value!.guestPos5?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, matchDetail.value!.guestPos5),
          position: 'G5',
        })
      }
      if (matchDetail.value!.guestPos6?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, matchDetail.value!.guestPos6),
          position: 'G6',
        })
      }
      if (matchDetail.value!.guestPos7?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, matchDetail.value!.guestPos7),
          position: 'G7',
        })
      }
      if (matchDetail.value!.guestPos8?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, matchDetail.value!.guestPos8),
          position: 'G8',
        })
      }
      return guestPlayers
    }
  )
  const orderedGuestTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(() => {
    return guestTeamPlayers.value.slice().sort((a, b) => a.position.localeCompare(b.position))
  })

  const formattedMatchDateTime: ComputedRef<string> = computed((): string => {
    return matchDetail.value!.matchDate ? format(new Date(matchDetail.value!.matchDate), 'dd.MM.yyyy, HH:mm') : '-'
  })

  const handleReturn = (): void => {
    router.push('/')
  }

  onMounted(() => {
    if (!matchDetail.value! || !matchDetail.value!.homeTeam || !matchDetail.value!.guestTeam) {
      handleReturn()
    }
  })
</script>
