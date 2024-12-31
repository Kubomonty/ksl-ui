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
            <h4>{{ $t('game-no', { no: 1 }) }}</h4>
          </span>
          <match-table
            :can-sub="canSub.q1"
            :guest-players="guestTeamPlayers.q1"
            :home-players="homeTeamPlayers.q1"
            :is-alive="isMatchAlive"
            :match-legs="matchLegs.qtr1"
            :match-state="matchState.qtr1"
            :qtr="1"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="onGuestRosterUpdateQ1"
            @update:roster-home="onHomeRosterUpdateQ1"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ $t('game-no', { no: 2 }) }}</h4>
          </span>
          <match-table
            :can-sub="canSub.q2"
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
            <h4>{{ $t('game-no', { no: 3 }) }}</h4>
          </span>
          <match-table
            :can-sub="canSub.q3"
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
            <h4>{{ $t('game-no', { no: 4 }) }}</h4>
          </span>
          <match-table
            :can-sub="canSub.q4"
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
          <span v-if="matchState.qtr4.game4.home === 8 && matchState.qtr4.game4.guest === 8">
            <span class="d-flex mb-2 mt-6">
              <h4>{{ `${$t('overtime')} - ${$t('team-doubles')} - ${$t('2-displays')}` }}</h4>
            </span>
            <overtime-table
              :can-sub="canSubOT"
              :guest-players="guestTeamPlayers.q4"
              :home-players="homeTeamPlayers.q4"
              :is-alive="isMatchAlive"
              :ot-legs="otLegs"
              :selected-guest-players="selectedOTPlayers.guest"
              :selected-home-players="selectedOTPlayers.home"
              @update:match-legs="onOTgameLegsUpdate"
              @update:roster-guest="onOTGuestRosterUpdate"
              @update:roster-home="onOTHomeRosterUpdate"
            />
          </span>
        </v-card-text>
        <v-card-actions v-if="isMatchAlive">
          <v-spacer />
          <span v-if="isLoggedIn">
            <v-btn
              color="success"
              variant="flat"
              @click="handleEndMatchClick"
            >{{ $t('end-match') }}</v-btn>
            <v-btn
              class="ml-2"
              color="error"
              variant="flat"
              @click="handleCancelMatchClick"
            >{{ $t('cancel-match') }}</v-btn>
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
    <v-dialog v-model="cancelMatchDialog" @keydown.enter="handleCancelMatchDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('cancel-match-info') }}</v-card-text>
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleCancelMatchDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleCancelMatchDialogConfirm"
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
  import { MatchGame, MatchLegs, MatchUpdateDto, PlayerDto, PlayersSubstitutionDto } from '../models'
  import {
    getMachLegsOT,
    getMachLegsQ1,
    getMachLegsQ2,
    getMachLegsQ3,
    getMachLegsQ4,
    getMatchLegsQuarterSum,
    getMatchState,
    getMatchUpdateDto,
    guestOTPlayers,
    guestTeam,
    guestTeamPlayers,
    handleGuestRosterUpdateQ1,
    handleGuestRosterUpdateQ2,
    handleGuestRosterUpdateQ3,
    handleGuestRosterUpdateQ4,
    handleHomeRosterUpdateQ1,
    handleHomeRosterUpdateQ2,
    handleHomeRosterUpdateQ3,
    handleHomeRosterUpdateQ4,
    homeOtPlayers,
    homeTeam,
    homeTeamPlayers,
  } from '../utils'
  import { useAuthStore, useMatchStore, useTeamStore } from '../stores'
  import { useRoute, useRouter } from 'vue-router'
  import { MatchStatus } from '../enums'
  import { computed } from 'vue'
  import { EMPTY_MATCH_LEGS, EMPTY_OT_LEGS } from '../constants'
  import { format } from 'date-fns'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'

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
  const { fetchedMatchDetails, selectedMatchDetails } = storeToRefs(matchStore)
  const { createOvertime, fetchMatchDetails, resetSelectedMatchDetails, updateMatch, updateMatchOvertime } = matchStore

  const teamStore = useTeamStore()
  const { fetchTeams } = teamStore

  const endMatchDialog: Ref<boolean> = ref(false)
  const cancelMatchDialog: Ref<boolean> = ref(false)

  const inProcess = ref(false)
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)

  const matchLegs: Ref<MatchLegs> = ref({ ...EMPTY_MATCH_LEGS })
  const matchState: Ref<MatchLegs> = ref({ ...EMPTY_MATCH_LEGS })
  const otLegs: Ref<{ game1: MatchGame, game2: MatchGame, game3: MatchGame }> = ref({ ...EMPTY_OT_LEGS })
  const selectedOTPlayers: Ref<{
    guest: { player: PlayerDto | null | undefined, position: string }[],
    home: { player: PlayerDto | null | undefined, position: string }[]
  }> = ref({
    guest: [
      { player: undefined as PlayerDto | null | undefined, position: 'G1' },
      { player: undefined as PlayerDto | null | undefined, position: 'G2' },
      { player: undefined as PlayerDto | null | undefined, position: 'G3' },
      { player: undefined as PlayerDto | null | undefined, position: 'G4' },
      { player: undefined as PlayerDto | null | undefined, position: 'G5' },
      { player: undefined as PlayerDto | null | undefined, position: 'G6' },
    ],
    home: [
      { player: undefined as PlayerDto | null | undefined, position: 'H1' },
      { player: undefined as PlayerDto | null | undefined, position: 'H2' },
      { player: undefined as PlayerDto | null | undefined, position: 'H3' },
      { player: undefined as PlayerDto | null | undefined, position: 'H4' },
      { player: undefined as PlayerDto | null | undefined, position: 'H5' },
      { player: undefined as PlayerDto | null | undefined, position: 'H6' },
    ],
  })

  const onGuestRosterUpdateQ1 = (newRoster: PlayersSubstitutionDto[]) => {
    handleGuestRosterUpdateQ1(newRoster)
    saveChanges()
  }
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

  const onHomeRosterUpdateQ1 = (newRoster: PlayersSubstitutionDto[]) => {
    handleHomeRosterUpdateQ1(newRoster)
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

  const onOTgameLegsUpdate = (legs: { game1: MatchGame, game2: MatchGame, game3: MatchGame }) => {
    handleOTgameLegsUpdate(legs)
  }
  const handleOTgameLegsUpdate = (legs: { game1: MatchGame, game2: MatchGame, game3: MatchGame }): void => {
    if (
      selectedOTPlayers.value.guest.find(p => p.position === 'G1' && p.player?.id) &&
      selectedOTPlayers.value.guest.find(p => p.position === 'G2' && p.player?.id) &&
      selectedOTPlayers.value.guest.find(p => p.position === 'G3' && p.player?.id) &&
      selectedOTPlayers.value.guest.find(p => p.position === 'G4' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'H1' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'H2' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'H3' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'H4' && p.player?.id)
    ) {
      if (+legs.game2.home === 1 && +legs.game1.guest === 1) {
        selectedOTPlayers.value.guest[4] = { ...selectedOTPlayers.value.guest[0], position: 'G5' }
        selectedOTPlayers.value.guest[5] = { ...selectedOTPlayers.value.guest[1], position: 'G6' }
        selectedOTPlayers.value.home[4] = { ...selectedOTPlayers.value.home[2], position: 'H5' }
        selectedOTPlayers.value.home[5] = { ...selectedOTPlayers.value.home[3], position: 'H6' }
      } else if (+legs.game2.guest === 1 && +legs.game1.home === 1) {
        selectedOTPlayers.value.guest[4] = { ...selectedOTPlayers.value.guest[2], position: 'G5' }
        selectedOTPlayers.value.guest[5] = { ...selectedOTPlayers.value.guest[3], position: 'G6' }
        selectedOTPlayers.value.home[4] = { ...selectedOTPlayers.value.home[0], position: 'H5' }
        selectedOTPlayers.value.home[5] = { ...selectedOTPlayers.value.home[1], position: 'H6' }
      }
      const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value, legs, selectedOTPlayers.value)
      if (updatedMatchDto && !initialLoadInProgress.value) {
        saveOvertime(updatedMatchDto)
      }
    }
  }

  const onOTGuestRosterUpdate = (newRoster: PlayersSubstitutionDto[]) => {
    handleOTGuestRosterUpdate(newRoster)
  }
  const handleOTGuestRosterUpdate = (newRoster: PlayersSubstitutionDto[]): void => {
    selectedOTPlayers.value.guest = newRoster.map((r, i) => ({ player: r.player, position: `G${i + 1}` }))
    if (
      newRoster.find(p => p.position === 'G1' && p.player?.id) &&
      newRoster.find(p => p.position === 'G2' && p.player?.id) &&
      newRoster.find(p => p.position === 'G3' && p.player?.id) &&
      newRoster.find(p => p.position === 'G4' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'H1' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'H2' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'H3' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'H4' && p.player?.id)
    ) {
      const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value, otLegs.value, selectedOTPlayers.value)
      if (updatedMatchDto && !initialLoadInProgress.value) {
        saveOvertime(updatedMatchDto)
      }
    }
  }

  const onOTHomeRosterUpdate = (newRoster: PlayersSubstitutionDto[]) => {
    handleOTHomeRosterUpdate(newRoster)
  }
  const handleOTHomeRosterUpdate = (newRoster: PlayersSubstitutionDto[]): void => {
    selectedOTPlayers.value.home = newRoster.map((r, i) => ({ player: r.player, position: `H${i + 1}` }))
    if (
      selectedOTPlayers.value.home.find(p => p.position === 'G1' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'G2' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'G3' && p.player?.id) &&
      selectedOTPlayers.value.home.find(p => p.position === 'G4' && p.player?.id) &&
      newRoster.find(p => p.position === 'H1' && p.player?.id) &&
      newRoster.find(p => p.position === 'H2' && p.player?.id) &&
      newRoster.find(p => p.position === 'H3' && p.player?.id) &&
      newRoster.find(p => p.position === 'H4' && p.player?.id)
    ) {
      const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value, otLegs.value, selectedOTPlayers.value)
      if (updatedMatchDto && !initialLoadInProgress.value) {
        saveOvertime(updatedMatchDto)
      }
    }
  }

  const saveOvertime = async (updatedMatchDto: MatchUpdateDto) => {
    inProcess.value = true
    progressSnackbar('saving-changes')
    if (!fetchedMatchDetails?.value?.overtime) {
      const res = await createOvertime(updatedMatchDto)
      if (res) {
        await initiateData()
        inProcess.value = false
        successSnackbar('save-changes-success')
        return
      }
      inProcess.value = false
      failSnackbar('save-changes-fail')
      return
    }
    const res = await updateMatchOvertime(updatedMatchDto)
    if (res) {
      await initiateData()
      inProcess.value = false
      successSnackbar('save-changes-success')
      return
    }
    inProcess.value = false
    failSnackbar('save-changes-fail')
  }

  const progressSnackbar = (i18nText: string): void => {
    snackbarColor.value = 'info'
    snackbarTimeout.value = -1
    snackbar.value = true
    snackbarText.value = i18n.t(i18nText).toString()
  }
  const successSnackbar = (i18nText: string): void => {
    snackbar.value = true
    snackbarColor.value = 'success'
    snackbarText.value = i18n.t(i18nText).toString()
    snackbarTimeout.value = 3000
  }
  const failSnackbar = (i18nText: string): void => {
    snackbar.value = true
    snackbarColor.value = 'error'
    snackbarText.value = i18n.t(i18nText).toString()
    snackbarTimeout.value = 3000
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
    progressSnackbar('ending-match')
    const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value)
    if (!updatedMatchDto) {
      inProcess.value = false
      failSnackbar('end-match-fail')
      return
    }
    updatedMatchDto.status = MatchStatus.FINISHED
    const updateRes = await updateMatch(updatedMatchDto)
    if (updateRes) {
      await initiateData()
      endMatchDialog.value = false
      inProcess.value = false
      successSnackbar('end-match-success')
      return
    }
    inProcess.value = false
    failSnackbar('end-match-fail')
  }

  const handleCancelMatchClick = (): void => {
    cancelMatchDialog.value = true
  }
  const handleCancelMatchDialogCancel = (): void => {
    cancelMatchDialog.value = false
  }
  const handleCancelMatchDialogConfirm = async (): Promise<void> => {
    cancelMatchDialog.value = false
    if (inProcess.value || !selectedMatchDetails?.value || !loggedInUser?.value) {
      return
    }
    inProcess.value = true
    progressSnackbar('canceling-match')
    const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value)
    if (!updatedMatchDto) {
      inProcess.value = false
      failSnackbar('cancel-match-fail')
      return
    }
    updatedMatchDto.status = MatchStatus.CANCELED
    const updateRes = await updateMatch(updatedMatchDto)
    if (updateRes) {
      await initiateData()
      inProcess.value = false
      successSnackbar('cancel-match-success')
      return
    }
    inProcess.value = false
    failSnackbar('cancel-match-fail')
  }

  const saveChanges = async (): Promise<void> => {
    if (inProcess.value || !selectedMatchDetails?.value || !loggedInUser?.value) {
      return
    }
    inProcess.value = true
    progressSnackbar('saving-changes')
    const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value)
    if (!updatedMatchDto) {
      inProcess.value = false
      failSnackbar('save-changes-fail')
      return
    }
    const updateRes = await updateMatch(updatedMatchDto)
    if (updateRes) {
      await initiateData()
      inProcess.value = false
      successSnackbar('save-changes-success')
      return
    }

    inProcess.value = false
    failSnackbar('save-changes-fail')
  }

  const canSub: ComputedRef<{ q1: boolean, q2: boolean, q3: boolean, q4: boolean }> = computed(() => {
    // never allow substitution in the first quarter
    const q1 = false
    const legsQ2 = getMatchLegsQuarterSum(matchLegs.value.qtr2)
    const legsSumQ2 = legsQ2.home + legsQ2.guest
    const legsQ3 = getMatchLegsQuarterSum(matchLegs.value.qtr3)
    const legsSumQ3 = legsQ3.home + legsQ3.guest
    const legsQ4 = getMatchLegsQuarterSum(matchLegs.value.qtr4)
    const legsSumQ4 = legsQ4.home + legsQ4.guest
    const q2 = legsSumQ2 + legsSumQ3 + legsSumQ4 === 0
    const q3 = legsSumQ3 + legsSumQ4 === 0
    const q4 = legsSumQ4 === 0

    return { q1, q2, q3, q4 }
  })

  const canSubOT: ComputedRef<boolean> = computed(() => {
    return +otLegs.value.game1.home + +otLegs.value.game1.guest +
      +otLegs.value.game2.guest + +otLegs.value.game2.home +
      +otLegs.value.game3.guest + +otLegs.value.game3.home === 0
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
    otLegs.value = getMachLegsOT.value
    selectedOTPlayers.value.guest = guestOTPlayers.value
    selectedOTPlayers.value.home = homeOtPlayers.value
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
