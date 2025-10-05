<template>
  <v-table density="compact">
    <thead>
      <tr>
        <th width="25%">{{ $t('home-team') }}</th>
        <th width="25%">{{ $t('guest-team') }}</th>
        <th>{{ $t('overtime-state') }}</th>
        <th>{{ $t('legs') }}</th>
        <th width="12%" />
      </tr>
    </thead>
    <tbody>
      <overtime-table-row
        :available-guest-players="availableGuestPlayers"
        :available-home-players="availableHomePlayers"
        :can-sub="canSubstitute"
        :game-number="1"
        :is-alive="isAlive"
        :ot-legs="otLegs.game1"
        :ot-players-selected="playersSelected"
        :score="overtimeState.game1"
        :selected-guest-players="selectedGuestPlayersParsed.otGame1"
        :selected-home-players="selectedHomePlayersParsed.otGame1"
        @update:guest-roster="emit('update:guestRoster')"
        @update:home-roster="emit('update:homeRoster')"
        @update:status="(status) => updateStatus(status, 'game1')"
      />
      <overtime-table-row
        :available-guest-players="availableGuestPlayers"
        :available-home-players="availableHomePlayers"
        :can-sub="canSubstitute"
        :game-number="2"
        :is-alive="isAlive"
        :ot-legs="otLegs.game2"
        :ot-players-selected="playersSelected"
        :score="overtimeState.game2"
        :selected-guest-players="selectedGuestPlayersParsed.otGame2"
        :selected-home-players="selectedHomePlayersParsed.otGame2"
        @update:guest-roster="emit('update:guestRoster')"
        @update:home-roster="emit('update:homeRoster')"
        @update:status="(status) => updateStatus(status, 'game2')"
      />
      <overtime-table-row
        v-if="overtimeState.game2.guest === 1 && overtimeState.game2.home === 1"
        :available-guest-players="availableGuestPlayers"
        :available-home-players="availableHomePlayers"
        :can-sub="{guest: false, home: false}"
        :game-number="3"
        :is-alive="isAlive"
        :ot-legs="otLegs.game3"
        :ot-players-selected="playersSelected"
        :score="overtimeState.game3"
        :selected-guest-players="selectedGuestPlayersParsed.otGame3"
        :selected-home-players="selectedHomePlayersParsed.otGame3"
        @update:status="(status) => updateStatus(status, 'game3')"
      />
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
  import { MatchGame, PlayerDto } from '../models'
  import { defineEmits, defineProps, type PropType } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '../stores'

  const props = defineProps({
    canSub: {
      required: true,
      type: Boolean,
    },
    guestPlayers: {
      required: true,
      type: Array as PropType<{ player: PlayerDto | null | undefined; position: string }[]>,
    },
    homePlayers: {
      required: true,
      type: Array as PropType<{ player: PlayerDto | null | undefined; position: string }[]>,
    },
    isAlive: {
      required: true,
      type: Boolean,
    },
    originalGuestPlayers: {
      required: true,
      type: Array as PropType<{ player: PlayerDto | null | undefined; position: string }[]>,
    },
    originalHomePlayers: {
      required: true,
      type: Array as PropType<{ player: PlayerDto | null | undefined; position: string }[]>,
    },
    otLegs: {
      required: true,
      type: Object as PropType<{ game1: MatchGame, game2: MatchGame, game3: MatchGame }>,
    },
    selectedGuestPlayers: {
      required: true,
      type: Array as PropType<{ player: PlayerDto | null | undefined; position: string }[]>,
    },
    selectedHomePlayers: {
      required: true,
      type: Array as PropType<{ player: PlayerDto | null | undefined; position: string }[]>,
    },
  })
  const emit = defineEmits([
    'update:guestRoster',
    'update:homeRoster',
    'update:status',
  ])

  const authStore = useAuthStore()
  const { isAdmin, isLoggedIn } = storeToRefs(authStore)

  const availableGuestPlayers = computed(() => {
    const filteredPlayers = props.guestPlayers
      .filter(player => player.player !== null && !props.selectedGuestPlayers.some(selected => selected.player?.id === player.player?.id))
      .filter(player => ['G1', 'G2', 'G3', 'G4'].includes(player.position) && !!player.player?.id)
    if (filteredPlayers.length === 0) {
      return []
    }

    return filteredPlayers.map(player => ({
      namePosition: getOriginalNamePosition('guest', player.player!.id) as string,
      playerId: player.player!.id,
    }))
  })
  const availableHomePlayers = computed(() => {
    const filteredPlayers = props.homePlayers
      .filter(player => player.player !== null && !props.selectedHomePlayers.some(selected => selected.player?.id === player.player?.id))
      .filter(player => ['H1', 'H2', 'H3', 'H4'].includes(player.position) && !!player.player?.id)
    if (filteredPlayers.length === 0) {
      return []
    }

    return filteredPlayers.map(player => ({
      namePosition: getOriginalNamePosition('home', player.player!.id) as string,
      playerId: player.player!.id,
    }))
  })
  const canSubstitute = computed(() => {
    return {
      guest: (props.canSub && isLoggedIn.value && props.isAlive) || isAdmin.value,
      home: (props.canSub && isLoggedIn.value && props.isAlive) || isAdmin.value,
    }
  })
  const selectedGuestPlayersParsed = computed(() => {
    const otGame1Players = [...props.selectedGuestPlayers.filter(player => ['G1', 'G2'].includes(player.position) && player.player)]
    const otGame2Players = [...props.selectedGuestPlayers.filter(player => ['G3', 'G4'].includes(player.position) && player.player)]
    const otGame3Players = [...props.selectedGuestPlayers.filter(player => ['G5', 'G6'].includes(player.position) && player.player)]
    return {
      otGame1: otGame1Players.length ? otGame1Players.map(player => ({
        namePosition: getOriginalNamePosition('guest', player.player!.id) as string,
        playerId: player.player!.id,
      }))
        : [],

      otGame2: otGame2Players.length ? otGame2Players.map(player => ({
        namePosition: getOriginalNamePosition('guest', player.player!.id) as string,
        playerId: player.player!.id,
      }))
        : [],
      otGame3: otGame3Players.length ? otGame3Players.map(player => ({
        namePosition: getOriginalNamePosition('guest', player.player!.id) as string,
        playerId: player.player!.id,
      }))
        : [],
    }
  })
  const selectedHomePlayersParsed = computed(() => {
    const otGame1Players = [...props.selectedHomePlayers.filter(player => ['H1', 'H2'].includes(player.position) && player.player)]
    const otGame2Players = [...props.selectedHomePlayers.filter(player => ['H3', 'H4'].includes(player.position) && player.player)]
    const otGame3Players = [...props.selectedHomePlayers.filter(player => ['H5', 'H6'].includes(player.position) && player.player)]
    return {
      otGame1: otGame1Players.length ? otGame1Players.map(player => ({
        namePosition: getOriginalNamePosition('home', player.player!.id) as string,
        playerId: player.player!.id,
      }))
        : [],

      otGame2: otGame2Players.length ? otGame2Players.map(player => ({
        namePosition: getOriginalNamePosition('home', player.player!.id) as string,
        playerId: player.player!.id,
      }))
        : [],
      otGame3: otGame3Players.length ? otGame3Players.map(player => ({
        namePosition: getOriginalNamePosition('home', player.player!.id) as string,
        playerId: player.player!.id,
      }))
        : [],
    }
  })

  const playersSelected = computed(() => {
    if (props.guestPlayers.filter(player => player.player?.id).length === 3 && props.selectedGuestPlayers.filter(player => player.player?.id).length < 3) {
      return false
    }
    if (props.guestPlayers.filter(player => player.player?.id).length >= 4 && props.selectedGuestPlayers.filter(player => player.player?.id).length < 4) {
      return false
    }

    if (props.homePlayers.filter(player => player.player?.id).length === 3 && props.selectedHomePlayers.filter(player => player.player?.id).length < 3) {
      return false
    }
    if (props.homePlayers.filter(player => player.player?.id).length >= 4 && props.selectedHomePlayers.filter(player => player.player?.id).length < 4) {
      return false
    }

    return true
  })

  const overtimeState = computed(() => {
    return {
      game1: { guest: +props.otLegs.game1.guest, home: +props.otLegs.game1.home },
      game2: { guest: +props.otLegs.game2.guest + +props.otLegs.game1.guest, home: +props.otLegs.game2.home + +props.otLegs.game1.home },
      game3: { guest: +props.otLegs.game3.guest + +props.otLegs.game2.guest + +props.otLegs.game1.guest, home: +props.otLegs.game3.home + +props.otLegs.game2.home + +props.otLegs.game1.home },
    }
  })

  const getOriginalNamePosition = (team: 'home' | 'guest', playerId: string | undefined) => {
    if (!playerId) {
      return null
    }
    let player: { player: PlayerDto | null | undefined, position: string }
    if (team === 'home') {
      player = props.originalHomePlayers.find(player => player.player?.id === playerId)!
    } else {
      player = props.originalGuestPlayers.find(player => player.player?.id === playerId)!
    }
    return team === 'home'
      ? `${player.position.replace('H', 'D')} - ${player.player?.name}`
      : `${player.position.replace('G', 'H')} - ${player.player?.name}`
  }

  const updateStatus = (newStatus: any, game: string) => {
    emit('update:status', { game, status: { ...newStatus } })
  }
</script>

<style scoped>
.not-allowed {
  cursor: not-allowed !important;
}

.not-allowed * {
  cursor: inherit !important;
}

.readonly-select .v-input__control {
  background-color: white !important;
  color: gray !important; /* Change text color */
}
</style>
