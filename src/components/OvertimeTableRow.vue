<template>
  <tr>
    <td>
      <div
        class="d-flex"
        :class="{ 'not-allowed': !canSub.home }"
      >
        <div
          class="my-2 flex-grow-1"
          :style="{
            backgroundColor: canSub.home ? '#f5f5f5' : 'white',
            borderRadius: '5px',
            color: canSub.home ? 'black' : 'darkslategray',
          }"
        >
          <v-select
            v-model="currentHomeTeamPlayers[0]"
            class="pl-2 pb-2"
            :class="{ 'readonly-select': !canSub.home }"
            :clearable="canSub.home"
            density="compact"
            hide-details
            hide-no-data
            item-title="namePosition"
            :item-value="item => item"
            :items="availableHomePlayers"
            :label="currentHomeTeamPlayers[0] && currentHomeTeamPlayers[0].playerId ? undefined : $t('player-no', { no: gameNumber === 1 ? 1 : 3 })"
            :readonly="!canSub.home"
            style="min-width: max-content;"
            variant="plain"
          />
          <v-divider />
          <v-select
            v-model="currentHomeTeamPlayers[1]"
            class="pl-2 pb-2"
            :class="{ 'readonly-select': !canSub.home }"
            :clearable="canSub.home"
            density="compact"
            hide-details
            hide-no-data
            item-title="namePosition"
            :item-value="item => item"
            :items="availableHomePlayers"
            :label="currentHomeTeamPlayers[1] && currentHomeTeamPlayers[1].playerId ? undefined : $t('player-no', { no: gameNumber === 1 ? 2 : 4 })"
            :readonly="!canSub.home"
            style="min-width: max-content;"
            variant="plain"
          />
        </div>
      </div>
    </td>
    <td>
      <div
        class="d-flex"
        :class="{ 'not-allowed': !canSub.guest }"
      >
        <div
          class="my-2 flex-grow-1"
          :style="{
            backgroundColor: canSub.guest ? '#f5f5f5' : 'white',
            borderRadius: '5px',
            color: canSub.guest ? 'black' : 'darkslategray',
          }"
        >
          <v-select
            v-model="currentGuestTeamPlayers[0]"
            class="pl-2 pb-2"
            :class="{ 'readonly-select': !canSub.guest }"
            :clearable="canSub.guest"
            density="compact"
            hide-details
            hide-no-data
            item-title="namePosition"
            :item-value="item => item"
            :items="availableGuestPlayers"
            :label="currentGuestTeamPlayers[0] && currentGuestTeamPlayers[0].playerId ? undefined : $t('player-no', { no: gameNumber === 1 ? 1 : 3 })"
            :readonly="!canSub.guest"
            style="min-width: max-content;"
            variant="plain"
          />
          <v-divider />
          <v-select
            v-model="currentGuestTeamPlayers[1]"
            class="pl-2 pb-2"
            :class="{ 'readonly-select': !canSub.guest }"
            :clearable="canSub.guest"
            density="compact"
            hide-details
            hide-no-data
            item-title="namePosition"
            :item-value="item => item"
            :items="availableGuestPlayers"
            :label="currentGuestTeamPlayers[1] && currentGuestTeamPlayers[1].playerId ? undefined : $t('player-no', { no: gameNumber === 1 ? 2 : 4 })"
            :readonly="!canSub.guest"
            style="min-width: max-content;"
            variant="plain"
          />
        </div>
      </div>
    </td>
    <td>
      {{ score.home }}&nbsp;&colon;&nbsp;{{ score.guest }}
    </td>
    <td>
      <div class="d-flex">
        <div
          class="my-2"
          :class="{ 'not-allowed': !isLoggedIn || !isAlive || !canSetLegs }"
          :style="{
            backgroundColor: canSetLegs ? '#f5f5f5' : 'white',
            borderRadius: '5px',
            color: canSetLegs ? 'black' : 'darkslategray',
          }"
        >
          <v-select
            v-model="gameLegs.home"
            class="pl-2 pb-2"
            density="compact"
            :disabled="legOptions.home.length < 2"
            hide-details
            :items="legOptions.home"
            :readonly="!canSetLegs"
            style="width: 52px;"
            variant="plain"
          />
        </div>
        &nbsp;
        <div style="margin-top: auto; margin-bottom: auto;"><strong>&colon;</strong></div>
        &nbsp;
        <div
          class="my-2"
          :class="{ 'not-allowed': !isLoggedIn || !isAlive || !canSetLegs }"
          :style="{
            backgroundColor: canSetLegs ? '#f5f5f5' : 'white',
            borderRadius: '5px',
            color: canSetLegs ? 'black' : 'darkslategray',
          }"
        >
          <v-select
            v-model="gameLegs.guest"
            class="pl-2 pb-2"
            density="compact"
            :disabled="legOptions.guest.length < 2"
            hide-details
            :items="legOptions.guest"
            :readonly="!canSetLegs"
            style="width: 52px;"
            variant="plain"
          />
        </div>
      </div>
    </td>
    <td>{{ `${$t('501-do')} - ${$t('team-doubles')}` }}</td>
  </tr>
</template>

<script lang="ts" setup>
  import { defineEmits, defineProps, type PropType } from 'vue'
  import { MatchGame } from '../models'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '../stores'

  const props = defineProps({
    availableGuestPlayers: {
      required: true,
      type: Array as PropType<{
        namePosition: string;
        playerId: string;
      }[]>,
    },
    availableHomePlayers: {
      required: true,
      type: Array as PropType<{
        namePosition: string;
        playerId: string;
      }[]>,
    },
    canSub: {
      required: true,
      type: Object as PropType<{ guest: boolean, home: boolean }>,
    },
    gameNumber: {
      required: true,
      type: Number,
    },
    isAlive: {
      required: true,
      type: Boolean,
    },
    otLegs: {
      required: true,
      type: Object as PropType<MatchGame>,
    },
    otPlayersSelected: {
      required: true,
      type: Boolean,
    },
    score: {
      required: true,
      type: Object as PropType<MatchGame>,
    },
    selectedGuestPlayers: {
      required: true,
      type: Array as PropType<{
        namePosition: string;
        playerId: string | undefined;
      }[]>,
    },
    selectedHomePlayers: {
      required: true,
      type: Array as PropType<{
        namePosition: string;
        playerId: string | undefined;
      }[]>,
    },
  })
  const emit = defineEmits([
    'update:guestRoster',
    'update:homeRoster',
    'update:status',
  ])

  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  const gameLegs: Ref<MatchGame> = ref({ guest: 0, home: 0 } as MatchGame)
  const currentGuestTeamPlayers: Ref<{
    namePosition: string;
    playerId: string | undefined;
  }[]> = ref([])
  const currentHomeTeamPlayers: Ref<{
    namePosition: string;
    playerId: string | undefined;
  }[]> = ref([])

  const legOptions = computed(() => {
    if (Number(gameLegs.value.home) === 1) {
      return { guest: [0], home: [0, 1] }
    } else if (Number(gameLegs.value.guest) === 1) {
      return { guest: [0, 1], home: [0] }
    }
    return { guest: [0, 1], home: [0, 1] }
  })

  const initiateData = (): void => {
    gameLegs.value.guest = props.otLegs.guest
    gameLegs.value.home = props.otLegs.home
    currentGuestTeamPlayers.value = [...props.selectedGuestPlayers]
    currentHomeTeamPlayers.value = [...props.selectedHomePlayers]
    if (!props.otPlayersSelected) {
      return
    }
    if (
      (!currentGuestTeamPlayers.value[0]?.playerId || !currentGuestTeamPlayers.value[1]?.playerId) &&
      (currentHomeTeamPlayers.value[0]?.playerId || currentHomeTeamPlayers.value[1]?.playerId)
    ) {
      gameLegs.value = { guest: 0, home: 1 }
    }
    if (
      (currentGuestTeamPlayers.value[0]?.playerId || currentGuestTeamPlayers.value[1]?.playerId) &&
      (!currentHomeTeamPlayers.value[0]?.playerId || !currentHomeTeamPlayers.value[1]?.playerId)
    ) {
      gameLegs.value = { guest: 1, home: 0 }
    }
  }

  const canSetLegs = computed(() => {
    return props.isAlive && isLoggedIn.value && props.otPlayersSelected &&
      (currentGuestTeamPlayers.value[0]?.playerId && currentGuestTeamPlayers.value[1]?.playerId) &&
      (currentHomeTeamPlayers.value[0]?.playerId && currentHomeTeamPlayers.value[1]?.playerId)
  })

  onMounted(() => {
    initiateData()
  })

  watch(currentGuestTeamPlayers, () => {
    emit('update:guestRoster', { currentGuestTeamPlayers: currentGuestTeamPlayers.value })
  }, { deep: true })

  watch(currentHomeTeamPlayers, () => {
    emit('update:homeRoster', { currentHomeTeamPlayers: currentHomeTeamPlayers.value })
  }, { deep: true })

  watch([gameLegs, currentGuestTeamPlayers, currentHomeTeamPlayers], () => {
    if (!currentGuestTeamPlayers.value[0]?.playerId || !currentGuestTeamPlayers.value[1]?.playerId) {
      gameLegs.value.guest = 0
    }
    if (!currentHomeTeamPlayers.value[0]?.playerId || !currentHomeTeamPlayers.value[1]?.playerId) {
      gameLegs.value.home = 0
    }
    emit('update:status', { gameLegs: gameLegs.value, currentGuestTeamPlayers: currentGuestTeamPlayers.value, currentHomeTeamPlayers: currentHomeTeamPlayers.value })
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
  color: gray !important;
}
</style>
