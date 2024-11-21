<template>
  <v-card border flat>
    <v-container>
      <span v-if="loading">
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
      </span>
      <span v-else>
        <v-card-title>{{ `${ homeTeam?.teamName} vs. ${guestTeam?.teamName}` }}</v-card-title>
        <v-card-subtitle>{{ `${selectedMatchDetails?.matchLocation} - ${formattedMatchDateTime}` }}</v-card-subtitle>
        <v-card-text>
          <br>
          <span class="d-flex mb-2">
            <h4>{{ `${$t('game-no')} 1` }}</h4>
          </span>
          <match-table
            :guest-players="guestTeamPlayers.q1"
            :home-players="homeTeamPlayers.q1"
            :match-legs="matchLegs.qtr1"
            :match-state="matchState.qtr1"
            :qtr="1"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="handleGuestRosterUpdateQ1"
            @update:roster-home="handleHomeRosterUpdateQ1"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ `${$t('game-no')} 2` }}</h4>
          </span>
          <match-table
            :guest-players="guestTeamPlayers.q2"
            :home-players="homeTeamPlayers.q2"
            :match-legs="matchLegs.qtr2"
            :match-state="matchState.qtr2"
            :qtr="2"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="handleGuestRosterUpdateQ2"
            @update:roster-home="handleHomeRosterUpdateQ2"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ `${$t('game-no')} 3` }}</h4>
          </span>
          <match-table
            :guest-players="guestTeamPlayers.q3"
            :home-players="homeTeamPlayers.q3"
            :match-legs="matchLegs.qtr3"
            :match-state="matchState.qtr3"
            :qtr="3"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="handleGuestRosterUpdateQ3"
            @update:roster-home="handleHomeRosterUpdateQ3"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ `${$t('game-no')} 4` }}</h4>
          </span>
          <match-table
            :guest-players="guestTeamPlayers.q4"
            :home-players="homeTeamPlayers.q4"
            :match-legs="matchLegs.qtr4"
            :match-state="matchState.qtr4"
            :qtr="4"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="handleGuestRosterUpdateQ4"
            @update:roster-home="handleHomeRosterUpdateQ4"
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
      </span>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
  import { PlayerDto, PlayersSubstitutionDto, TeamDto } from '../models'
  import { useMatchStore, useTeamStore } from '../stores'
  import { useRoute, useRouter } from 'vue-router'
  import { computed } from 'vue'
  import { format } from 'date-fns'
  import { storeToRefs } from 'pinia'

  const loading = ref(false)

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
  const { selectedMatchDetails } = storeToRefs(matchStore)
  const { fetchMatchDetails, resetSelectedMatchDetails } = matchStore

  const teamStore = useTeamStore()
  const { fetchTeams, getTeamById } = teamStore

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
      game1: { home: 0, guest: 0 },
      game2: { home: 0, guest: 0 },
      game3: { home: 0, guest: 0 },
      game4: { home: 0, guest: 0 },
    },
    qtr2: {
      game1: { home: 0, guest: 0 },
      game2: { home: 0, guest: 0 },
      game3: { home: 0, guest: 0 },
      game4: { home: 0, guest: 0 },
    },
    qtr3: {
      game1: { home: 0, guest: 0 },
      game2: { home: 0, guest: 0 },
      game3: { home: 0, guest: 0 },
      game4: { home: 0, guest: 0 },
    },
    qtr4: {
      game1: { home: 0, guest: 0 },
      game2: { home: 0, guest: 0 },
      game3: { home: 0, guest: 0 },
      game4: { home: 0, guest: 0 },
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

  const handleGuestRosterUpdateQ4 = (newRoster: PlayersSubstitutionDto[]) => {
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
  const handleGuestRosterUpdateQ3 = (newRoster: PlayersSubstitutionDto[]) => {
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
  const handleGuestRosterUpdateQ2 = (newRoster: PlayersSubstitutionDto[]) => {
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
  const handleGuestRosterUpdateQ1 = (newRoster: PlayersSubstitutionDto[]) => {
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

  const handleHomeRosterUpdateQ4 = (newRoster: PlayersSubstitutionDto[]) => {
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
  const handleHomeRosterUpdateQ3 = (newRoster: PlayersSubstitutionDto[]) => {
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
  const handleHomeRosterUpdateQ2 = (newRoster: PlayersSubstitutionDto[]) => {
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
  const handleHomeRosterUpdateQ1 = (newRoster: PlayersSubstitutionDto[]) => {
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

  const getPlayer = (team: TeamDto | undefined | null, playerId: string | undefined): PlayerDto | null => {
    if (!team || !playerId) {
      return null
    }

    return team.players.find(player => player.id === playerId) || null
  }

  const homeTeam: ComputedRef<TeamDto | null | undefined> = computed((): TeamDto | null | undefined => {
    return selectedMatchDetails?.value?.homeTeam ? getTeamById(selectedMatchDetails?.value?.homeTeam) : null
  })

  const homeTeamPlayers: ComputedRef<{
    q1: { player: PlayerDto | null | undefined; position: string }[];
    q2: { player: PlayerDto | null | undefined; position: string }[];
    q3: { player: PlayerDto | null | undefined; position: string }[];
    q4: { player: PlayerDto | null | undefined; position: string }[];
  }> = computed(() => {
    if (!selectedMatchDetails?.value?.homeTeam) {
      return {
        q1: [],
        q2: [],
        q3: [],
        q4: [],
      }
    }
    const q1: { player: PlayerDto | null | undefined; position: string }[] = []
    q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q1.home.pos1), position: 'H1' })
    q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q1.home.pos2), position: 'H2' })
    q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q1.home.pos3), position: 'H3' })
    if (selectedMatchDetails.value.quarters.q1.home.pos4) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q1.home.pos4), position: 'H4' })
    }
    if (selectedMatchDetails.value.quarters.q1.home.pos5) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q1.home.pos5), position: 'H5' })
    }
    if (selectedMatchDetails.value.quarters.q1.home.pos6) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q1.home.pos6), position: 'H6' })
    }
    if (selectedMatchDetails.value.quarters.q1.home.pos7) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q1.home.pos7), position: 'H7' })
    }
    if (selectedMatchDetails.value.quarters.q1.home.pos8) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q1.home.pos8), position: 'H8' })
    }

    const q2: { player: PlayerDto | null | undefined; position: string }[] = []
    q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q2.home.pos1), position: 'H1' })
    q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q2.home.pos2), position: 'H2' })
    q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q2.home.pos3), position: 'H3' })
    if (selectedMatchDetails.value.quarters.q2.home.pos4) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q2.home.pos4), position: 'H4' })
    }
    if (selectedMatchDetails.value.quarters.q2.home.pos5) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q2.home.pos5), position: 'H5' })
    }
    if (selectedMatchDetails.value.quarters.q2.home.pos6) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q2.home.pos6), position: 'H6' })
    }
    if (selectedMatchDetails.value.quarters.q2.home.pos7) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q2.home.pos7), position: 'H7' })
    }
    if (selectedMatchDetails.value.quarters.q2.home.pos8) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q2.home.pos8), position: 'H8' })
    }

    const q3: { player: PlayerDto | null | undefined; position: string }[] = []
    q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q3.home.pos1), position: 'H1' })
    q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q3.home.pos2), position: 'H2' })
    q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q3.home.pos3), position: 'H3' })
    if (selectedMatchDetails.value.quarters.q3.home.pos4) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q3.home.pos4), position: 'H4' })
    }
    if (selectedMatchDetails.value.quarters.q3.home.pos5) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q3.home.pos5), position: 'H5' })
    }
    if (selectedMatchDetails.value.quarters.q3.home.pos6) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q3.home.pos6), position: 'H6' })
    }
    if (selectedMatchDetails.value.quarters.q3.home.pos7) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q3.home.pos7), position: 'H7' })
    }
    if (selectedMatchDetails.value.quarters.q3.home.pos8) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q3.home.pos8), position: 'H8' })
    }

    const q4: { player: PlayerDto | null | undefined; position: string }[] = []
    q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q4.home.pos1), position: 'H1' })
    q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q4.home.pos2), position: 'H2' })
    q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q4.home.pos3), position: 'H3' })
    if (selectedMatchDetails.value.quarters.q4.home.pos4) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q4.home.pos4), position: 'H4' })
    }
    if (selectedMatchDetails.value.quarters.q4.home.pos5) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q4.home.pos5), position: 'H5' })
    }
    if (selectedMatchDetails.value.quarters.q4.home.pos6) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q4.home.pos6), position: 'H6' })
    }
    if (selectedMatchDetails.value.quarters.q4.home.pos7) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q4.home.pos7), position: 'H7' })
    }
    if (selectedMatchDetails.value.quarters.q4.home.pos8) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.homeTeam), selectedMatchDetails.value.quarters.q4.home.pos8), position: 'H8' })
    }
    return { q1, q2, q3, q4 }
  })

  const guestTeam: ComputedRef<TeamDto | null | undefined> = computed((): TeamDto | null | undefined => {
    return selectedMatchDetails?.value?.guestTeam ? getTeamById(selectedMatchDetails.value.guestTeam) : null
  })
  const guestTeamPlayers: ComputedRef<{
    q1: { player: PlayerDto | null | undefined; position: string }[];
    q2: { player: PlayerDto | null | undefined; position: string }[];
    q3: { player: PlayerDto | null | undefined; position: string }[];
    q4: { player: PlayerDto | null | undefined; position: string }[];
  }> = computed(() => {
    if (!selectedMatchDetails?.value?.guestTeam) {
      return {
        q1: [],
        q2: [],
        q3: [],
        q4: [],
      }
    }
    const q1: { player: PlayerDto | null | undefined; position: string }[] = []
    q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q1.guest.pos1), position: 'G1' })
    q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q1.guest.pos2), position: 'G2' })
    q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q1.guest.pos3), position: 'G3' })
    if (selectedMatchDetails.value.quarters.q1.guest.pos4) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q1.guest.pos4), position: 'G4' })
    }
    if (selectedMatchDetails.value.quarters.q1.guest.pos5) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q1.guest.pos5), position: 'G5' })
    }
    if (selectedMatchDetails.value.quarters.q1.guest.pos6) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q1.guest.pos6), position: 'G6' })
    }
    if (selectedMatchDetails.value.quarters.q1.guest.pos7) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q1.guest.pos7), position: 'G7' })
    }
    if (selectedMatchDetails.value.quarters.q1.guest.pos8) {
      q1.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q1.guest.pos8), position: 'G8' })
    }

    const q2: { player: PlayerDto | null | undefined; position: string }[] = []
    q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q2.guest.pos1), position: 'G1' })
    q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q2.guest.pos2), position: 'G2' })
    q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q2.guest.pos3), position: 'G3' })
    if (selectedMatchDetails.value.quarters.q2.guest.pos4) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q2.guest.pos4), position: 'G4' })
    }
    if (selectedMatchDetails.value.quarters.q2.guest.pos5) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q2.guest.pos5), position: 'G5' })
    }
    if (selectedMatchDetails.value.quarters.q2.guest.pos6) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q2.guest.pos6), position: 'G6' })
    }
    if (selectedMatchDetails.value.quarters.q2.guest.pos7) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q2.guest.pos7), position: 'G7' })
    }
    if (selectedMatchDetails.value.quarters.q2.guest.pos8) {
      q2.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q2.guest.pos8), position: 'G8' })
    }

    const q3: { player: PlayerDto | null | undefined; position: string }[] = []
    q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q3.guest.pos1), position: 'G1' })
    q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q3.guest.pos2), position: 'G2' })
    q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q3.guest.pos3), position: 'G3' })
    if (selectedMatchDetails.value.quarters.q3.guest.pos4) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q3.guest.pos4), position: 'G4' })
    }
    if (selectedMatchDetails.value.quarters.q3.guest.pos5) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q3.guest.pos5), position: 'G5' })
    }
    if (selectedMatchDetails.value.quarters.q3.guest.pos6) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q3.guest.pos6), position: 'G6' })
    }
    if (selectedMatchDetails.value.quarters.q3.guest.pos7) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q3.guest.pos7), position: 'G7' })
    }
    if (selectedMatchDetails.value.quarters.q3.guest.pos8) {
      q3.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q3.guest.pos8), position: 'G8' })
    }

    const q4: { player: PlayerDto | null | undefined; position: string }[] = []
    q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q4.guest.pos1), position: 'G1' })
    q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q4.guest.pos2), position: 'G2' })
    q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q4.guest.pos3), position: 'G3' })
    if (selectedMatchDetails.value.quarters.q4.guest.pos4) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q4.guest.pos4), position: 'G4' })
    }
    if (selectedMatchDetails.value.quarters.q4.guest.pos5) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q4.guest.pos5), position: 'G5' })
    }
    if (selectedMatchDetails.value.quarters.q4.guest.pos6) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q4.guest.pos6), position: 'G6' })
    }
    if (selectedMatchDetails.value.quarters.q4.guest.pos7) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q4.guest.pos7), position: 'G7' })
    }
    if (selectedMatchDetails.value.quarters.q4.guest.pos8) {
      q4.push({ player: getPlayer(getTeamById(selectedMatchDetails.value.guestTeam), selectedMatchDetails.value.quarters.q4.guest.pos8), position: 'G8' })
    }
    return { q1, q2, q3, q4 }
  })

  const formattedMatchDateTime: ComputedRef<string> = computed((): string => {
    return selectedMatchDetails?.value?.matchDate ? format(new Date(selectedMatchDetails.value.matchDate), 'dd.MM.yyyy, HH:mm') : '-'
  })

  const handleReturn = (): void => {
    router.push('/')
  }

  const recalculateMachLegsQ1 = (): void => {
    matchLegs.value.qtr1 = {
      game1: {
        home: selectedMatchDetails?.value?.quarters.q1.home.legs.m1 || 0,
        guest: selectedMatchDetails?.value?.quarters.q1.guest.legs.m1 || 0,
      },
      game2: {
        home: selectedMatchDetails?.value?.quarters.q1.home.legs.m2 || 0,
        guest: selectedMatchDetails?.value?.quarters.q1.guest.legs.m2 || 0,
      },
      game3: {
        home: selectedMatchDetails?.value?.quarters.q1.home.legs.m3 || 0,
        guest: selectedMatchDetails?.value?.quarters.q1.guest.legs.m3 || 0,
      },
      game4: {
        home: selectedMatchDetails?.value?.quarters.q1.home.legs.m4 || 0,
        guest: selectedMatchDetails?.value?.quarters.q1.guest.legs.m4 || 0,
      },
    }
  }
  const recalculateMachLegsQ2 = (): void => {
    matchLegs.value.qtr2 = {
      game1: {
        home: selectedMatchDetails?.value?.quarters.q2.home.legs.m1 || 0,
        guest: selectedMatchDetails?.value?.quarters.q2.guest.legs.m1 || 0,
      },
      game2: {
        home: selectedMatchDetails?.value?.quarters.q2.home.legs.m2 || 0,
        guest: selectedMatchDetails?.value?.quarters.q2.guest.legs.m2 || 0,
      },
      game3: {
        home: selectedMatchDetails?.value?.quarters.q2.home.legs.m3 || 0,
        guest: selectedMatchDetails?.value?.quarters.q2.guest.legs.m3 || 0,
      },
      game4: {
        home: selectedMatchDetails?.value?.quarters.q2.home.legs.m4 || 0,
        guest: selectedMatchDetails?.value?.quarters.q2.guest.legs.m4 || 0,
      },
    }
  }
  const recalculateMachLegsQ3 = (): void => {
    matchLegs.value.qtr3 = {
      game1: {
        home: selectedMatchDetails?.value?.quarters.q3.home.legs.m1 || 0,
        guest: selectedMatchDetails?.value?.quarters.q3.guest.legs.m1 || 0,
      },
      game2: {
        home: selectedMatchDetails?.value?.quarters.q3.home.legs.m2 || 0,
        guest: selectedMatchDetails?.value?.quarters.q3.guest.legs.m2 || 0,
      },
      game3: {
        home: selectedMatchDetails?.value?.quarters.q3.home.legs.m3 || 0,
        guest: selectedMatchDetails?.value?.quarters.q3.guest.legs.m3 || 0,
      },
      game4: {
        home: selectedMatchDetails?.value?.quarters.q3.home.legs.m4 || 0,
        guest: selectedMatchDetails?.value?.quarters.q3.guest.legs.m4 || 0,
      },
    }
  }
  const recalculateMachLegsQ4 = (): void => {
    matchLegs.value.qtr4 = {
      game1: {
        home: selectedMatchDetails?.value?.quarters.q4.home.legs.m1 || 0,
        guest: selectedMatchDetails?.value?.quarters.q4.guest.legs.m1 || 0,
      },
      game2: {
        home: selectedMatchDetails?.value?.quarters.q4.home.legs.m2 || 0,
        guest: selectedMatchDetails?.value?.quarters.q4.guest.legs.m2 || 0,
      },
      game3: {
        home: selectedMatchDetails?.value?.quarters.q4.home.legs.m3 || 0,
        guest: selectedMatchDetails?.value?.quarters.q4.guest.legs.m3 || 0,
      },
      game4: {
        home: selectedMatchDetails?.value?.quarters.q4.home.legs.m4 || 0,
        guest: selectedMatchDetails?.value?.quarters.q4.guest.legs.m4 || 0,
      },
    }
  }

  watch(async () => route, async () => {
    loading.value = true
    resetSelectedMatchDetails()
    if (!route.query.id) {
      loading.value = false
      handleReturn()
    }
    await Promise.all([
      fetchTeams(),
      fetchMatchDetails(route.query.id as string),
    ])
    recalculateMachLegsQ1()
    recalculateMachLegsQ2()
    recalculateMachLegsQ3()
    recalculateMachLegsQ4()
    loading.value = false
  }, { deep: true })

  onMounted(async () => {
    loading.value = true
    resetSelectedMatchDetails()
    if (!route.query.id) {
      handleReturn()
    }
    await Promise.all([
      fetchTeams(),
      fetchMatchDetails(route.query.id as string),
    ])
    if (!selectedMatchDetails?.value || !selectedMatchDetails?.value?.homeTeam || !selectedMatchDetails?.value?.guestTeam) {
      loading.value = false
      handleReturn()
    }
    recalculateMachLegsQ1()
    recalculateMachLegsQ2()
    recalculateMachLegsQ3()
    recalculateMachLegsQ4()
    loading.value = false
  })
</script>
