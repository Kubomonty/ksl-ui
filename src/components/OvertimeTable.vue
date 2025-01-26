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
      <tr>
        <td>
          <div
            class="d-flex"
            :class="{ 'not-allowed': !canSubstitute.home }"
          >
            <div
              class="my-2 flex-grow-1"
              :style="{
                backgroundColor: canSubstitute.home ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: canSubstitute.home ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="currentHomeTeamPlayers[0].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute.home }"
                :clearable="canSubstitute.home"
                density="compact"
                hide-details
                hide-no-data
                item-title="namePosition"
                :item-value="(item: unknown) => item"
                :items="homeTeamPlayers"
                :label="currentHomeTeamPlayers[0].player ? undefined : $t('player-no', { no: 1 })"
                :readonly="!canSubstitute.home"
                style="min-width: max-content;"
                variant="plain"
              />
              <v-divider />
              <v-select
                v-model="currentHomeTeamPlayers[1].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute.home }"
                :clearable="canSubstitute.home"
                density="compact"
                hide-details
                hide-no-data
                item-title="namePosition"
                :item-value="(item: unknown) => item"
                :items="homeTeamPlayers"
                :label="currentHomeTeamPlayers[1].player ? undefined : $t('player-no', { no: 2 })"
                :readonly="!canSubstitute.home"
                style="min-width: max-content;"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>
          <div
            class="d-flex"
            :class="{ 'not-allowed': !canSubstitute.guest }"
          >
            <div
              class="my-2 flex-grow-1"
              :style="{
                backgroundColor: canSubstitute.guest ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: canSubstitute.guest ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="currentGuestTeamPlayers[0].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute.guest }"
                :clearable="canSubstitute.guest"
                density="compact"
                hide-details
                hide-no-data
                item-title="namePosition"
                :item-value="(item: unknown) => item"
                :items="guestTeamPlayers"
                :label="currentGuestTeamPlayers[0].player ? undefined : $t('player-no', { no: 1 })"
                :readonly="!canSubstitute.guest"
                style="min-width: max-content;"
                variant="plain"
              />
              <v-divider />
              <v-select
                v-model="currentGuestTeamPlayers[1].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute.guest }"
                :clearable="canSubstitute.guest"
                density="compact"
                hide-details
                hide-no-data
                item-title="namePosition"
                :item-value="(item: unknown) => item"
                :items="guestTeamPlayers"
                :label="currentGuestTeamPlayers[1].player ? undefined : $t('player-no', { no: 2 })"
                :readonly="!canSubstitute.guest"
                style="min-width: max-content;"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>
          {{ overtimeState.game1.home }}&nbsp;&colon;&nbsp;{{ overtimeState.game1.guest }}
        </td>
        <td>
          <div class="d-flex">
            <div
              class="my-2"
              :class="{ 'not-allowed': !isLoggedIn || !isAlive }"
              :style="{
                backgroundColor: isLoggedIn && isAlive && canSetG1Legs ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: isLoggedIn && isAlive && canSetG1Legs ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="gameLegs.game1.home"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="gameLeg1Options.home"
                :readonly="!isLoggedIn || !isAlive || !canSetG1Legs"
                style="width: 52px;"
                variant="plain"
              />
            </div>
            &nbsp;
            <div style="margin-top: auto; margin-bottom: auto;"><strong>&colon;</strong></div>
            &nbsp;
            <div
              class="my-2"
              :class="{ 'not-allowed': !isLoggedIn || !isAlive }"
              :style="{
                backgroundColor: isLoggedIn && isAlive && canSetG1Legs ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: isLoggedIn && isAlive && canSetG1Legs ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="gameLegs.game1.guest"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="gameLeg1Options.guest"
                :readonly="!isLoggedIn || !isAlive || !canSetG1Legs"
                style="width: 52px;"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>{{ `${$t('501-do')} - ${$t('team-doubles')}` }}</td>
      </tr>
      <tr>
        <td>
          <div
            class="d-flex"
            :class="{ 'not-allowed': !canSubstitute.home }"
          >
            <div
              class="my-2 flex-grow-1"
              :style="{
                backgroundColor: canSubstitute.home ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: canSubstitute.home ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="currentHomeTeamPlayers[2].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute.home }"
                :clearable="canSubstitute.home"
                density="compact"
                hide-details
                hide-no-data
                item-title="namePosition"
                :item-value="(item: unknown) => item"
                :items="homeTeamPlayers"
                :label="currentHomeTeamPlayers[2].player ? undefined : $t('player-no', { no: 3 })"
                :readonly="!canSubstitute.home"
                style="min-width: max-content;"
                variant="plain"
              />
              <v-divider />
              <v-select
                v-model="currentHomeTeamPlayers[3].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute.home }"
                :clearable="canSubstitute.home"
                density="compact"
                hide-details
                hide-no-data
                item-title="namePosition"
                :item-value="(item: unknown) => item"
                :items="homeTeamPlayers"
                :label="currentHomeTeamPlayers[3].player ? undefined : $t('player-no', { no: 4 })"
                :readonly="!canSubstitute.home"
                style="min-width: max-content;"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>
          <div
            class="d-flex"
            :class="{ 'not-allowed': !canSubstitute.guest }"
          >
            <div
              class="my-2 flex-grow-1"
              :style="{
                backgroundColor: canSubstitute.guest ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: canSubstitute.guest ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="currentGuestTeamPlayers[2].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute.guest }"
                :clearable="canSubstitute.guest"
                density="compact"
                hide-details
                hide-no-data
                item-title="namePosition"
                :item-value="(item: unknown) => item"
                :items="guestTeamPlayers"
                :label="currentGuestTeamPlayers[2].player ? undefined : $t('player-no', { no: 3 })"
                :readonly="!canSubstitute.guest"
                style="min-width: max-content;"
                variant="plain"
              />
              <v-divider />
              <v-select
                v-model="currentGuestTeamPlayers[3].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute.guest }"
                :clearable="canSubstitute.guest"
                density="compact"
                hide-details
                hide-no-data
                item-title="namePosition"
                :item-value="(item: unknown) => item"
                :items="guestTeamPlayers"
                :label="currentGuestTeamPlayers[3].player ? undefined : $t('player-no', { no: 4 })"
                :readonly="!canSubstitute.guest"
                style="min-width: max-content;"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>
          {{ overtimeState.game2.home }}&nbsp;&colon;&nbsp;{{ overtimeState.game2.guest }}
        </td>
        <td>
          <div class="d-flex">
            <div
              class="my-2"
              :class="{ 'not-allowed': !isLoggedIn || !isAlive }"
              :style="{
                backgroundColor: isLoggedIn && isAlive && canSetG2Legs ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: isLoggedIn && isAlive && canSetG2Legs ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="gameLegs.game2.home"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="gameLeg2Options.home"
                :readonly="!isLoggedIn || !isAlive || !canSetG2Legs"
                style="width: 52px;"
                variant="plain"
              />
            </div>
            &nbsp;
            <div style="margin-top: auto; margin-bottom: auto;"><strong>&colon;</strong></div>
            &nbsp;
            <div
              class="my-2"
              :class="{ 'not-allowed': !isLoggedIn || !isAlive }"
              :style="{
                backgroundColor: isLoggedIn && isAlive && canSetG2Legs ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: isLoggedIn && isAlive && canSetG2Legs ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="gameLegs.game2.guest"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="gameLeg2Options.guest"
                :readonly="!isLoggedIn || !isAlive || !canSetG2Legs"
                style="width: 52px;"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>{{ `${$t('501-do')} - ${$t('team-doubles')}` }}</td>
      </tr>
      <tr v-if="overtimeState.game2.home === 1 && overtimeState.game2.guest === 1">
        <td>
          <div
            class="d-flex not-allowed"
          >
            <div
              class="my-2 flex-grow-1"
              :style="{
                backgroundColor: 'white',
                borderRadius: '5px',
                color: 'darkslategray',
              }"
            >
              <v-select
                class="pl-2 pb-2 readonly-select"
                density="compact"
                hide-details
                hide-no-data
                readonly
                style="min-width: max-content;"
                :value="currentHomeTeamPlayers[4].player?.namePosition"
                variant="plain"
              />
              <v-divider />
              <v-select
                class="pl-2 pb-2 readonly-select"
                density="compact"
                hide-details
                hide-no-data
                readonly
                style="min-width: max-content;"
                :value="currentHomeTeamPlayers[5].player?.namePosition"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>
          <div
            class="d-flex not-allowed"
          >
            <div
              class="my-2 flex-grow-1"
              :style="{
                backgroundColor: 'white',
                borderRadius: '5px',
                color: 'darkslategray',
              }"
            >
              <v-select
                class="pl-2 pb-2 readonly-select"
                density="compact"
                hide-details
                hide-no-data
                readonly
                style="min-width: max-content;"
                :value="currentGuestTeamPlayers[4].player?.namePosition"
                variant="plain"
              />
              <v-divider />
              <v-select
                class="pl-2 pb-2 readonly-select"
                density="compact"
                hide-details
                hide-no-data
                readonly
                style="min-width: max-content;"
                :value="currentGuestTeamPlayers[5].player?.namePosition"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>
          {{ overtimeState.game3.home }}&nbsp;&colon;&nbsp;{{ overtimeState.game3.guest }}
        </td>
        <td>
          <div class="d-flex">
            <div
              class="my-2"
              :class="{ 'not-allowed': !isLoggedIn || !isAlive }"
              :style="{
                backgroundColor: isLoggedIn && isAlive ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: isLoggedIn && isAlive ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="gameLegs.game3.home"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="gameLeg3Options.home"
                :readonly="!isLoggedIn || !isAlive"
                style="width: 52px;"
                variant="plain"
              />
            </div>
            &nbsp;
            <div style="margin-top: auto; margin-bottom: auto;"><strong>&colon;</strong></div>
            &nbsp;
            <div
              class="my-2"
              :class="{ 'not-allowed': !isLoggedIn || !isAlive }"
              :style="{
                backgroundColor: isLoggedIn && isAlive ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: isLoggedIn && isAlive ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-model="gameLegs.game3.guest"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="gameLeg3Options.guest"
                :readonly="!isLoggedIn || !isAlive"
                style="width: 52px;"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>{{ `${$t('501-do')} - ${$t('team-doubles')}` }}</td>
      </tr>
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
  const emits = defineEmits([
    'update:match-legs',
    'update:match-legs',
    'update:roster-guest',
    'update:roster-home',
  ])

  const authStore = useAuthStore()
  const { isAdmin, isLoggedIn } = storeToRefs(authStore)

  const canSubstitute = computed(() => {
    return {
      guest: (props.canSub && isLoggedIn.value && props.isAlive) || isAdmin.value,
      home: (props.canSub && isLoggedIn.value && props.isAlive) || isAdmin.value,
    }
  })

  const defaultGameLegs: { game1: MatchGame, game2: MatchGame, game3: MatchGame } = {
    game1: { guest: 0, home: 0 },
    game2: { guest: 0, home: 0 },
    game3: { guest: 0, home: 0 },
  }
  const gameLegs: Ref<{ game1: MatchGame, game2: MatchGame, game3: MatchGame }> = ref({
    ...defaultGameLegs,
  })

  const overtimeState = computed(() => {
    return {
      game1: { guest: +gameLegs.value.game1.guest, home: +gameLegs.value.game1.home },
      game2: { guest: +gameLegs.value.game2.guest + +gameLegs.value.game1.guest, home: +gameLegs.value.game2.home + +gameLegs.value.game1.home },
      game3: { guest: +gameLegs.value.game3.guest + +gameLegs.value.game2.guest + +gameLegs.value.game1.guest, home: +gameLegs.value.game3.home + +gameLegs.value.game2.home + +gameLegs.value.game1.home },
    }
  })

  const gameLeg1Options = computed(() => {
    if (gameLegs.value.game1.home === 1) {
      return { guest: [0], home: [0, 1] }
    } else if (gameLegs.value.game1.guest === 1) {
      return { guest: [0, 1], home: [0] }
    }
    return { guest: [0, 1], home: [0, 1] }
  })

  const gameLeg2Options = computed(() => {
    if (gameLegs.value.game2.home === 1) {
      return { guest: [0], home: [0, 1] }
    } else if (gameLegs.value.game2.guest === 1) {
      return { guest: [0, 1], home: [0] }
    }
    return { guest: [0, 1], home: [0, 1] }
  })

  const gameLeg3Options = computed(() => {
    if (gameLegs.value.game3.home === 1) {
      return { guest: [0], home: [0, 1] }
    } else if (gameLegs.value.game3.guest === 1) {
      return { guest: [0, 1], home: [0] }
    }
    return { guest: [0, 1], home: [0, 1] }
  })

  const guestTeamPlayers = computed(() => {
    return props.guestPlayers
      .filter(player => ['G1', 'G2', 'G3', 'G4'].includes(player.position) && !!player.player?.id)
      .filter(player => !currentGuestTeamPlayers.value.some(p => p.player?.id === player.player?.id))
      .map(player => ({ ...player.player, namePosition: `${player.position.replace('G', 'H')} - ${player.player?.name}` }))
  })
  const homeTeamPlayers = computed(() => {
    return props.homePlayers
      .filter(player => ['H1', 'H2', 'H3', 'H4'].includes(player.position) && !!player.player?.id)
      .filter(player => !currentHomeTeamPlayers.value.some(p => p.player?.id === player.player?.id))
      .map(player => ({ ...player.player, namePosition: `${player.position.replace('H', 'D')} - ${player.player?.name}` }))
  })

  const defaultGuestTeamPlayers: { player: PlayerDto & { namePosition: string } | null | undefined, position: string }[] = [
    { player: undefined, position: 'G1' },
    { player: undefined, position: 'G2' },
    { player: undefined, position: 'G3' },
    { player: undefined, position: 'G4' },
    { player: undefined, position: 'G5' },
    { player: undefined, position: 'G6' },
  ]
  const currentGuestTeamPlayers: Ref<{ player: PlayerDto & { namePosition: string } | null | undefined, position: string }[]> = ref([
    ...defaultGuestTeamPlayers,
  ])
  const dafaultHomeTeamPlayers: { player: PlayerDto & { namePosition: string } | null | undefined, position: string }[] = [
    { player: undefined, position: 'H1' },
    { player: undefined, position: 'H2' },
    { player: undefined, position: 'H3' },
    { player: undefined, position: 'H4' },
    { player: undefined, position: 'H5' },
    { player: undefined, position: 'H6' },
  ]
  const currentHomeTeamPlayers: Ref<{ player: PlayerDto & { namePosition: string } | null | undefined, position: string }[]> = ref([
    ...dafaultHomeTeamPlayers,
  ])

  const transformPlayerDtoToOTPlayer = (
    player: { player: PlayerDto | null | undefined, position: string },
  ): {
    player: PlayerDto & { namePosition: string } | null | undefined,
    position: string,
  } | null => {
    if (!player.player) {
      return null
    }
    return {
      player: {
        ...player.player,
        namePosition: `${player.position.replace('H', 'D').replace('G', 'H')} - ${player.player?.name}`,
      },
      position: player.position,
    }
  }

  const setOTLegs = () => {
    gameLegs.value.game1 = props.otLegs.game1
    gameLegs.value.game2 = props.otLegs.game2
    if (overtimeState.value.game2.home === 1 && overtimeState.value.game2.guest === 1) {
      gameLegs.value.game3 = props.otLegs.game3
    } else {
      gameLegs.value.game3 = { guest: 0, home: 0 }
    }
  }
  const setSelectedGuestPlayers = () => {
    if (!props.selectedGuestPlayers.length) {
      return
    }
    const guestPlayers = props.selectedGuestPlayers.map(player => transformPlayerDtoToOTPlayer(player))
    const g1 = guestPlayers.find(player => player?.position === 'G1')
    const g2 = guestPlayers.find(player => player?.position === 'G2')
    const g3 = guestPlayers.find(player => player?.position === 'G3')
    const g4 = guestPlayers.find(player => player?.position === 'G4')
    const g5 = guestPlayers.find(player => player?.position === 'G5')
    const g6 = guestPlayers.find(player => player?.position === 'G6')
    if (g1) {
      currentGuestTeamPlayers.value[0] = g1
    }
    if (g2) {
      currentGuestTeamPlayers.value[1] = g2
    }
    if (g3) {
      currentGuestTeamPlayers.value[2] = g3
    }
    if (g4) {
      currentGuestTeamPlayers.value[3] = g4
    }
    if (g5) {
      currentGuestTeamPlayers.value[4] = g5
    }
    if (g6) {
      currentGuestTeamPlayers.value[5] = g6
    }
  }
  const setSelectedHomePlayers = () => {
    if (!props.selectedHomePlayers.length) {
      return
    }
    const homePlayers = props.selectedHomePlayers.map(player => transformPlayerDtoToOTPlayer(player))
    const h1 = homePlayers.find(player => player?.position === 'H1')
    const h2 = homePlayers.find(player => player?.position === 'H2')
    const h3 = homePlayers.find(player => player?.position === 'H3')
    const h4 = homePlayers.find(player => player?.position === 'H4')
    const h5 = homePlayers.find(player => player?.position === 'H5')
    const h6 = homePlayers.find(player => player?.position === 'H6')
    if (h1) {
      currentHomeTeamPlayers.value[0] = h1
    }
    if (h2) {
      currentHomeTeamPlayers.value[1] = h2
    }
    if (h3) {
      currentHomeTeamPlayers.value[2] = h3
    }
    if (h4) {
      currentHomeTeamPlayers.value[3] = h4
    }
    if (h5) {
      currentHomeTeamPlayers.value[4] = h5
    }
    if (h6) {
      currentHomeTeamPlayers.value[5] = h6
    }
  }

  const canSetG1Legs = computed(() => {
    return currentGuestTeamPlayers.value[0].player && currentHomeTeamPlayers.value[0].player &&
      currentGuestTeamPlayers.value[1].player && currentHomeTeamPlayers.value[1].player
  })
  const canSetG2Legs = computed(() => {
    return currentGuestTeamPlayers.value[2].player && currentHomeTeamPlayers.value[2].player &&
      currentGuestTeamPlayers.value[3].player && currentHomeTeamPlayers.value[3].player
  })

  watch(props.otLegs, () => {
    setOTLegs()
  }, { deep: true, immediate: true })

  watch(props.selectedGuestPlayers, () => {
    setSelectedGuestPlayers()
  }, { deep: true, immediate: true })

  watch(props.selectedHomePlayers, () => {
    setSelectedHomePlayers()
  }, { deep: true, immediate: true })

  watch(gameLegs.value, () => {
    emits('update:match-legs', gameLegs.value)
  }, { deep: true })

  watch(currentGuestTeamPlayers.value, () => {
    emits('update:roster-guest', currentGuestTeamPlayers.value)
  }, { deep: true })

  watch(currentHomeTeamPlayers.value, () => {
    emits('update:roster-home', currentHomeTeamPlayers.value)
  }, { deep: true })
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
