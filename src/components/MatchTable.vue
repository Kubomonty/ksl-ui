<template>
  <v-table density="compact">
    <thead>
      <tr>
        <th>{{ $t('home-team') }}</th>
        <th>{{ $t('guest-team') }}</th>
        <th>{{ $t('match-state') }}</th>
        <th>{{ $t('legs') }}</th>
        <th width="8%" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(match, index) in currentMatch" :key="index">
        <td>
          <div
            class="d-flex"
            :class="{ 'not-allowed': !canSubstitute }"
          >
            <div style="margin-top: auto; margin-bottom: auto;">
              <strong>{{ `H${match.home}` }}</strong>
            </div>
            &nbsp;
            <div style="margin-top: auto; margin-bottom: auto;">&ndash;</div>
            &nbsp;
            <div
              class="my-2"
              :style="{
                backgroundColor: canSubstitute ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: canSubstitute ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-if="currentHomeTeamPlayers[match.home - 1].player"
                v-model="currentHomeTeamPlayers[match.home - 1].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute }"
                density="compact"
                hide-details
                item-title="name"
                :item-value="item => item"
                :items="homeTeamPlayersSubstitutes"
                :readonly="!canSubstitute"
                style="min-width: 156px;"
                variant="plain"
                @update:model-value="handleHomeTeamUpdate(`H${match.home}`)"
              />
            </div>
          </div>
        </td>
        <td>
          <div
            class="d-flex"
            :class="{ 'not-allowed': !canSubstitute }"
          >
            <div style="margin-top: auto; margin-bottom: auto;">
              <strong>{{ `G${match.guest}` }}</strong>
            </div>
            &nbsp;
            <div style="margin-top: auto; margin-bottom: auto;">&ndash;</div>
            &nbsp;
            <div
              class="my-2"
              :style="{
                backgroundColor: canSubstitute ? '#f5f5f5' : 'white',
                borderRadius: '5px',
                color: canSubstitute ? 'black' : 'darkslategray',
              }"
            >
              <v-select
                v-if="currentGuestTeamPlayers[match.guest - 1].player"
                v-model="currentGuestTeamPlayers[match.guest - 1].player"
                class="pl-2 pb-2"
                :class="{ 'readonly-select': !canSubstitute }"
                density="compact"
                hide-details
                item-title="name"
                :item-value="item => item"
                :items="guestTeamPlayersSubstitutes"
                :readonly="!canSubstitute"
                style="min-width: 156px;"
                variant="plain"
                @update:model-value="handleGuestTeamUpdate(`G${match.guest}`)"
              />
            </div>
          </div>
        </td>
        <td>{{ matchState[`game${index + 1}` as keyof typeof matchState].home }} : {{ matchState[`game${index + 1}` as keyof typeof matchState].guest }}</td>
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
                v-model="hLegs[index]"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="hLegItems[index]"
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
                v-model="gLegs[index]"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="gLegItems[index]"
                :readonly="!isLoggedIn || !isAlive"
                style="width: 52px;"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>{{ $t(match.type) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
  import { defineEmits, defineProps, type PropType } from 'vue'
  import { matchOpponentsStructure } from '../constants'
  import { PlayerDto } from '../models'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '../stores'

  const props = defineProps({
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
    matchState: {
      required: true,
      type: Object as PropType< {
        game1: { guest: number, home: number },
        game2: { guest: number, home: number },
        game3: { guest: number, home: number },
        game4: { guest: number, home: number },
      }>,
    },
    matchLegs: {
      required: true,
      type: Object as PropType<{
        game1: { guest: number, home: number }
        game2: { guest: number, home: number }
        game3: { guest: number, home: number }
        game4: { guest: number, home: number }
      }>,
    },
    qtr: {
      required: true,
      type: Number,
    },
    canSub: {
      required: true,
      type: Boolean,
    },
  })
  const emits = defineEmits([
    'update:match-legs-guest',
    'update:match-legs-home',
    'update:roster-guest',
    'update:roster-home',
  ])

  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  const canSubstitute = computed(() => props.canSub && isLoggedIn.value && props.isAlive)

  const currentMatch = matchOpponentsStructure[props.qtr - 1]
  const previousHomeTeamPlayers = ref([
    { position: 'H1', player: props.homePlayers.filter(player => player.position === 'H1')[0]?.player },
    { position: 'H2', player: props.homePlayers.filter(player => player.position === 'H2')[0]?.player },
    { position: 'H3', player: props.homePlayers.filter(player => player.position === 'H3')[0]?.player },
    { position: 'H4', player: props.homePlayers.filter(player => player.position === 'H4')[0]?.player },
    { position: 'H5', player: props.homePlayers.filter(player => player.position === 'H5')[0]?.player },
    { position: 'H6', player: props.homePlayers.filter(player => player.position === 'H6')[0]?.player },
    { position: 'H7', player: props.homePlayers.filter(player => player.position === 'H7')[0]?.player },
    { position: 'H8', player: props.homePlayers.filter(player => player.position === 'H8')[0]?.player },
  ])
  const currentHomeTeamPlayers = ref([
    { position: 'H1', player: props.homePlayers.filter(player => player.position === 'H1')[0]?.player },
    { position: 'H2', player: props.homePlayers.filter(player => player.position === 'H2')[0]?.player },
    { position: 'H3', player: props.homePlayers.filter(player => player.position === 'H3')[0]?.player },
    { position: 'H4', player: props.homePlayers.filter(player => player.position === 'H4')[0]?.player },
    { position: 'H5', player: props.homePlayers.filter(player => player.position === 'H5')[0]?.player },
    { position: 'H6', player: props.homePlayers.filter(player => player.position === 'H6')[0]?.player },
    { position: 'H7', player: props.homePlayers.filter(player => player.position === 'H7')[0]?.player },
    { position: 'H8', player: props.homePlayers.filter(player => player.position === 'H8')[0]?.player },
  ])

  const setGuestPlayers = () => {
    currentGuestTeamPlayers.value = [
      { position: 'G1', player: props.guestPlayers.filter(player => player.position === 'G1')[0]?.player },
      { position: 'G2', player: props.guestPlayers.filter(player => player.position === 'G2')[0]?.player },
      { position: 'G3', player: props.guestPlayers.filter(player => player.position === 'G3')[0]?.player },
      { position: 'G4', player: props.guestPlayers.filter(player => player.position === 'G4')[0]?.player },
      { position: 'G5', player: props.guestPlayers.filter(player => player.position === 'G5')[0]?.player },
      { position: 'G6', player: props.guestPlayers.filter(player => player.position === 'G6')[0]?.player },
      { position: 'G7', player: props.guestPlayers.filter(player => player.position === 'G7')[0]?.player },
      { position: 'G8', player: props.guestPlayers.filter(player => player.position === 'G8')[0]?.player },
    ]
    previousGuestTeamPlayers.value = JSON.parse(JSON.stringify(currentGuestTeamPlayers.value))
  }

  const setHomePlayers = () => {
    currentHomeTeamPlayers.value = [
      { position: 'H1', player: props.homePlayers.filter(player => player.position === 'H1')[0]?.player },
      { position: 'H2', player: props.homePlayers.filter(player => player.position === 'H2')[0]?.player },
      { position: 'H3', player: props.homePlayers.filter(player => player.position === 'H3')[0]?.player },
      { position: 'H4', player: props.homePlayers.filter(player => player.position === 'H4')[0]?.player },
      { position: 'H5', player: props.homePlayers.filter(player => player.position === 'H5')[0]?.player },
      { position: 'H6', player: props.homePlayers.filter(player => player.position === 'H6')[0]?.player },
      { position: 'H7', player: props.homePlayers.filter(player => player.position === 'H7')[0]?.player },
      { position: 'H8', player: props.homePlayers.filter(player => player.position === 'H8')[0]?.player },
    ]
    previousHomeTeamPlayers.value = JSON.parse(JSON.stringify(currentHomeTeamPlayers.value))
  }

  const homeTeamPlayersSubstitutes = computed(() => currentHomeTeamPlayers.value
    .filter(player => ['H5', 'H6', 'H7', 'H8'].includes(player.position) && !!player.player?.id)
    .map(player => ({ ...player.player }))
  )
  const handleHomeTeamUpdate = (positionTo: string) => {
    const updatedPlayers = [...currentHomeTeamPlayers.value]
    const prevPlayer = previousHomeTeamPlayers.value.find(player => player.position === positionTo)
    const currPlayer = updatedPlayers.find(player => player.position === positionTo)
    const positionFrom = previousHomeTeamPlayers.value
      .filter(pos => ['H5', 'H6', 'H7', 'H8'].includes(pos.position))
      .find(pos => pos.player?.id === currPlayer?.player?.id)?.position
    updatedPlayers.find(pos => pos.position === positionFrom)!.player = prevPlayer?.player || null
    previousHomeTeamPlayers.value = JSON.parse(JSON.stringify(updatedPlayers))
    currentHomeTeamPlayers.value = JSON.parse(JSON.stringify(updatedPlayers))
    emits('update:roster-home', currentHomeTeamPlayers.value)
  }

  const previousGuestTeamPlayers = ref([
    { position: 'G1', player: props.guestPlayers.filter(player => player.position === 'G1')[0]?.player },
    { position: 'G2', player: props.guestPlayers.filter(player => player.position === 'G2')[0]?.player },
    { position: 'G3', player: props.guestPlayers.filter(player => player.position === 'G3')[0]?.player },
    { position: 'G4', player: props.guestPlayers.filter(player => player.position === 'G4')[0]?.player },
    { position: 'G5', player: props.guestPlayers.filter(player => player.position === 'G5')[0]?.player },
    { position: 'G6', player: props.guestPlayers.filter(player => player.position === 'G6')[0]?.player },
    { position: 'G7', player: props.guestPlayers.filter(player => player.position === 'G7')[0]?.player },
    { position: 'G8', player: props.guestPlayers.filter(player => player.position === 'G8')[0]?.player },
  ])
  const currentGuestTeamPlayers = ref([
    { position: 'G1', player: props.guestPlayers.filter(player => player.position === 'G1')[0]?.player },
    { position: 'G2', player: props.guestPlayers.filter(player => player.position === 'G2')[0]?.player },
    { position: 'G3', player: props.guestPlayers.filter(player => player.position === 'G3')[0]?.player },
    { position: 'G4', player: props.guestPlayers.filter(player => player.position === 'G4')[0]?.player },
    { position: 'G5', player: props.guestPlayers.filter(player => player.position === 'G5')[0]?.player },
    { position: 'G6', player: props.guestPlayers.filter(player => player.position === 'G6')[0]?.player },
    { position: 'G7', player: props.guestPlayers.filter(player => player.position === 'G7')[0]?.player },
    { position: 'G8', player: props.guestPlayers.filter(player => player.position === 'G8')[0]?.player },
  ])
  const guestTeamPlayersSubstitutes = computed(() => currentGuestTeamPlayers.value
    .filter(player => ['G5', 'G6', 'G7', 'G8'].includes(player.position) && !!player.player?.id)
    .map(player => ({ ...player.player }))
  )
  const handleGuestTeamUpdate = (positionTo: string) => {
    const updatedPlayers = [...currentGuestTeamPlayers.value]
    const prevPlayer = previousGuestTeamPlayers.value.find(player => player.position === positionTo)
    const currPlayer = updatedPlayers.find(player => player.position === positionTo)
    const positionFrom = previousGuestTeamPlayers.value
      .filter(pos => ['G5', 'G6', 'G7', 'G8'].includes(pos.position))
      .find(pos => pos.player?.id === currPlayer?.player?.id)?.position
    updatedPlayers.find(pos => pos.position === positionFrom)!.player = prevPlayer?.player || null
    previousGuestTeamPlayers.value = JSON.parse(JSON.stringify(updatedPlayers))
    currentGuestTeamPlayers.value = JSON.parse(JSON.stringify(updatedPlayers))
    emits('update:roster-guest', currentGuestTeamPlayers.value)
  }

  const hLegs = ref([props.matchLegs.game1.home, props.matchLegs.game2.home, props.matchLegs.game3.home, props.matchLegs.game4.home])
  const gLegs = ref([props.matchLegs.game1.guest, props.matchLegs.game2.guest, props.matchLegs.game3.guest, props.matchLegs.game4.guest])

  const hLegItems = computed(() =>
    hLegs.value.map((_, i) => +gLegs.value[i] === 0 ? [0, 1, 2] : [0, 1, 2].filter(item => item !== +gLegs.value[i]))
  )

  const gLegItems = computed(() =>
    gLegs.value.map((_, i) => +hLegs.value[i] === 0 ? [0, 1, 2] : [0, 1, 2].filter(item => item !== +hLegs.value[i]))
  )

  watch(hLegs, () => {
    emits('update:match-legs-home', { values: hLegs.value, qtr: props.qtr })
  }, { deep: true })
  watch(gLegs, () => {
    emits('update:match-legs-guest', { values: gLegs.value, qtr: props.qtr })
  }, { deep: true })
  watch(() => props.guestPlayers, () => {
    setGuestPlayers()
  }, { deep: true })
  watch(() => props.homePlayers, () => {
    setHomePlayers()
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
