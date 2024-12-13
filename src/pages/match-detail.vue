<template>
  <v-card border flat>
    <v-container>
      <span v-if="loading && initialLoadInProgress">
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
            :can-sub="false"
            :guest-players="guestTeamPlayers.q1"
            :home-players="homeTeamPlayers.q1"
            :is-alive="isMatchAlive"
            :match-legs="matchLegs.qtr1"
            :match-state="matchState.qtr1"
            :qtr="1"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ `${$t('game-no')} 2` }}</h4>
          </span>
          <match-table
            :can-sub="true"
            :guest-players="guestTeamPlayers.q2"
            :home-players="homeTeamPlayers.q2"
            :is-alive="isMatchAlive"
            :match-legs="matchLegs.qtr2"
            :match-state="matchState.qtr2"
            :qtr="2"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="onGuestRosterUpdateQ2"
            @update:roster-home="onHomeRosterUpdateQ2"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ `${$t('game-no')} 3` }}</h4>
          </span>
          <match-table
            :can-sub="true"
            :guest-players="guestTeamPlayers.q3"
            :home-players="homeTeamPlayers.q3"
            :is-alive="isMatchAlive"
            :match-legs="matchLegs.qtr3"
            :match-state="matchState.qtr3"
            :qtr="3"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="onGuestRosterUpdateQ3"
            @update:roster-home="onHomeRosterUpdateQ3"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ `${$t('game-no')} 4` }}</h4>
          </span>
          <match-table
            :can-sub="true"
            :guest-players="guestTeamPlayers.q4"
            :home-players="homeTeamPlayers.q4"
            :is-alive="isMatchAlive"
            :match-legs="matchLegs.qtr4"
            :match-state="matchState.qtr4"
            :qtr="4"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="onGuestRosterUpdateQ4"
            @update:roster-home="onHomeRosterUpdateQ4"
          />
        </v-card-text>
        <v-card-actions v-if="isMatchAlive">
          <v-spacer />
          <span v-if="isLoggedIn">
            <v-btn
              color="success"
              variant="flat"
              @click="handleEndMatchClick"
            >{{ $t('end-match') }}</v-btn>
          </span>
        </v-card-actions>
      </span>
    </v-container>
    <v-dialog v-model="endMatchDialog" @keydown.enter="handleEndMatchDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('end-match-info') }}</v-card-text>
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleEndMatchDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleEndMatchDialogConfirm"
          >{{ $t('ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="snackbarTimeout"
    >
      {{ snackbarText }}
      <template #actions>
        <v-btn
          color="white"
          density="compact"
          icon="mdi-close"
          variant="text"
          @click="snackbar = false"
        />
      </template>
    </v-snackbar>
  </v-card>
</template>

<script lang="ts" setup>
  import { MatchLegs, PlayersSubstitutionDto } from '../models'
  import { useAuthStore, useMatchStore, useTeamStore } from '../stores'
  import { useRoute, useRouter } from 'vue-router'
  import { computed } from 'vue'
  import { format } from 'date-fns'
  import { MatchStatus } from '../enums'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import {
    getMachLegsQ1,
    getMachLegsQ2,
    getMachLegsQ3,
    getMachLegsQ4,
    getMatchState,
    getMatchUpdateDto,
    guestTeam,
    guestTeamPlayers,
    handleGuestRosterUpdateQ2,
    handleGuestRosterUpdateQ3,
    handleGuestRosterUpdateQ4,
    handleHomeRosterUpdateQ2,
    handleHomeRosterUpdateQ3,
    handleHomeRosterUpdateQ4,
    homeTeam,
    homeTeamPlayers,
    Quarter,
  } from '../utils'

  const i18n = useI18n()
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { isLoggedIn, loggedInUser } = storeToRefs(authStore)

  const loading = ref(false)

  const isMatchChanged = ref(false)

  const isMatchAlive = computed(() => {
    if (!selectedMatchDetails?.value?.status) {
      return false
    }
    return [MatchStatus.IN_PROGRESS, MatchStatus.NEW].includes(selectedMatchDetails.value.status as MatchStatus)
  })

  const handleReturn = (): void => {
    router.push('/')
  }

  const matchStore = useMatchStore()
  const { selectedMatchDetails } = storeToRefs(matchStore)
  const { fetchMatchDetails, resetSelectedMatchDetails, updateMatch } = matchStore

  const teamStore = useTeamStore()
  const { fetchTeams } = teamStore

  const endMatchDialog: Ref<boolean> = ref(false)

  const inProcess = ref(false)
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)

  const onGuestRosterUpdateQ2 = (newRoster: PlayersSubstitutionDto[]) => {
    handleGuestRosterUpdateQ2(newRoster)
    saveChanges()
  }
  const onGuestRosterUpdateQ3 = (newRoster: PlayersSubstitutionDto[]) => {
    handleGuestRosterUpdateQ3(newRoster)
    saveChanges()
  }
  const onGuestRosterUpdateQ4 = (newRoster: PlayersSubstitutionDto[]) => {
    handleGuestRosterUpdateQ4(newRoster)
    saveChanges()
  }

  const onHomeRosterUpdateQ2 = (newRoster: PlayersSubstitutionDto[]) => {
    handleHomeRosterUpdateQ2(newRoster)
    saveChanges()
  }
  const onHomeRosterUpdateQ3 = (newRoster: PlayersSubstitutionDto[]) => {
    handleHomeRosterUpdateQ3(newRoster)
    saveChanges()
  }
  const onHomeRosterUpdateQ4 = (newRoster: PlayersSubstitutionDto[]) => {
    handleHomeRosterUpdateQ4(newRoster)
    saveChanges()
  }

  const handleEndMatchClick = (): void => {
    endMatchDialog.value = true
  }
  const handleEndMatchDialogCancel = (): void => {
    endMatchDialog.value = false
  }
  const handleEndMatchDialogConfirm = async (): Promise<void> => {
    if (inProcess.value || !selectedMatchDetails?.value || !loggedInUser?.value) {
      return
    }
    inProcess.value = true
    snackbarColor.value = 'info'
    snackbarTimeout.value = -1
    snackbar.value = true
    snackbarText.value = i18n.t('ending-match').toString()
    const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value)
    if (!updatedMatchDto) {
      inProcess.value = false
      snackbar.value = true
      snackbarColor.value = 'error'
      snackbarText.value = i18n.t('end-match-failed').toString()
      snackbarTimeout.value = 3000
      return
    }
    updatedMatchDto.status = MatchStatus.FINISHED
    const updateRes = await updateMatch(updatedMatchDto)
    if (updateRes) {
      await initiateData()
      endMatchDialog.value = false
      inProcess.value = false
      snackbar.value = true
      snackbarColor.value = 'success'
      snackbarText.value = i18n.t('end-match-success').toString()
      snackbarTimeout.value = 3000
      return
    }

    inProcess.value = false
    snackbar.value = true
    snackbarColor.value = 'error'
    snackbarText.value = i18n.t('save-changes-failed').toString()
    snackbarTimeout.value = 3000
  }
  const saveChanges = async (): Promise<void> => {
    if (inProcess.value || !selectedMatchDetails?.value || !loggedInUser?.value) {
      return
    }
    inProcess.value = true
    snackbarColor.value = 'info'
    snackbarTimeout.value = -1
    snackbar.value = true
    snackbarText.value = i18n.t('saving-changes').toString()
    const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value)
    if (!updatedMatchDto) {
      inProcess.value = false
      snackbar.value = true
      snackbarColor.value = 'error'
      snackbarText.value = i18n.t('save-changes-failed').toString()
      snackbarTimeout.value = 3000
      return
    }
    const updateRes = await updateMatch(updatedMatchDto)
    if (updateRes) {
      await initiateData()
      inProcess.value = false
      snackbar.value = true
      snackbarColor.value = 'success'
      snackbarText.value = i18n.t('save-changes-success').toString()
      snackbarTimeout.value = 3000
      return
    }

    inProcess.value = false
    snackbar.value = true
    snackbarColor.value = 'error'
    snackbarText.value = i18n.t('save-changes-failed').toString()
    snackbarTimeout.value = 3000
  }
  const matchLegs: Ref<MatchLegs> = ref({
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

  const matchState: Ref<{
    qtr1: Quarter;
    qtr2: Quarter;
    qtr3: Quarter;
    qtr4: Quarter;
  }> = ref({
    qtr1: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
    qtr2: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
    qtr3: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
    qtr4: { game1: { home: 0, guest: 0 }, game2: { home: 0, guest: 0 }, game3: { home: 0, guest: 0 }, game4: { home: 0, guest: 0 } },
  })

  const handleHomeLegsUpdate = (values: {values: number[], qtr: number}) => {
    isMatchChanged.value = true
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
    isMatchChanged.value = true
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

  const formattedMatchDateTime: ComputedRef<string> = computed((): string => {
    return selectedMatchDetails?.value?.matchDate ? format(new Date(selectedMatchDetails.value.matchDate), 'dd.MM.yyyy, HH:mm') : '-'
  })

  const initiateData = async (): Promise<void> => {
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
    if (!selectedMatchDetails?.value || !selectedMatchDetails?.value?.homeTeam || !selectedMatchDetails?.value?.guestTeam) {
      loading.value = false
      handleReturn()
    }
    matchLegs.value.qtr1 = getMachLegsQ1.value
    matchLegs.value.qtr2 = getMachLegsQ2.value
    matchLegs.value.qtr3 = getMachLegsQ3.value
    matchLegs.value.qtr4 = getMachLegsQ4.value
    matchState.value = getMatchState(matchLegs.value)
    loading.value = false
  }

  const initialLoadInProgress = ref(true)

  watch(async () => route, async () => {
    await initiateData()
  }, { deep: true })

  watch(matchLegs, () => {
    matchState.value = getMatchState(matchLegs.value)
    if (!initialLoadInProgress.value) {
      saveChanges()
    }
  }, { deep: true })

  onMounted(async () => {
    await initiateData()
    initialLoadInProgress.value = false
  })
</script>
