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
            <h4>{{ $t('game-qt', { no: 1 }) }}</h4>
          </span>
          <match-table
            :can-sub="canSub.q1"
            :guest-players="guestTeamPlayers.q1"
            :home-players="homeTeamPlayers.q1"
            :is-alive="isMatchAlive"
            :match-legs="matchLegs.qtr1"
            :match-state="matchState.qtr1"
            :original-guest-players="guestTeamPlayers.q1"
            :original-home-players="homeTeamPlayers.q1"
            :qtr="1"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="onGuestRosterUpdateQ1"
            @update:roster-home="onHomeRosterUpdateQ1"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ $t('game-qt', { no: 2 }) }}</h4>
          </span>
          <match-table
            :can-sub="canSub.q2"
            :guest-players="guestTeamPlayers.q2"
            :home-players="homeTeamPlayers.q2"
            :is-alive="isMatchAlive"
            :match-legs="matchLegs.qtr2"
            :match-state="matchState.qtr2"
            :original-guest-players="guestTeamPlayers.q1"
            :original-home-players="homeTeamPlayers.q1"
            :qtr="2"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="onGuestRosterUpdateQ2"
            @update:roster-home="onHomeRosterUpdateQ2"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ $t('game-qt', { no: 3 }) }}</h4>
          </span>
          <match-table
            :can-sub="canSub.q3"
            :guest-players="guestTeamPlayers.q3"
            :home-players="homeTeamPlayers.q3"
            :is-alive="isMatchAlive"
            :match-legs="matchLegs.qtr3"
            :match-state="matchState.qtr3"
            :original-guest-players="guestTeamPlayers.q1"
            :original-home-players="homeTeamPlayers.q1"
            :qtr="3"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="onGuestRosterUpdateQ3"
            @update:roster-home="onHomeRosterUpdateQ3"
          />
          <br>
          <span class="d-flex mb-2">
            <h4>{{ $t('game-qt', { no: 4 }) }}</h4>
          </span>
          <match-table
            :can-sub="canSub.q4"
            :guest-players="guestTeamPlayers.q4"
            :home-players="homeTeamPlayers.q4"
            :is-alive="isMatchAlive"
            :match-legs="matchLegs.qtr4"
            :match-state="matchState.qtr4"
            :original-guest-players="guestTeamPlayers.q1"
            :original-home-players="homeTeamPlayers.q1"
            :qtr="4"
            @update:match-legs-guest="handleGuestLegsUpdate"
            @update:match-legs-home="handleHomeLegsUpdate"
            @update:roster-guest="onGuestRosterUpdateQ4"
            @update:roster-home="onHomeRosterUpdateQ4"
          />
          <span v-if="matchState.qtr4.game4.home === 8 && matchState.qtr4.game4.guest === 8">
            <span class="d-flex mb-2 mt-6">
              <h4>{{ `${$t('overtime')} - ${$t('team-doubles')} (${$t('1-team-2-displays')})` }}</h4>
            </span>
            <overtime-table
              :can-sub="canSubOT"
              :guest-players="guestTeamPlayers.q4"
              :home-players="homeTeamPlayers.q4"
              :is-alive="isMatchAlive"
              :original-guest-players="guestTeamPlayers.q1"
              :original-home-players="homeTeamPlayers.q1"
              :ot-legs="otLegs"
              :selected-guest-players="selectedOTPlayers.guest"
              :selected-home-players="selectedOTPlayers.home"
              @update:guest-roster="recalculateGuestOT3"
              @update:home-roster="recalculateHomeOT3"
              @update:status="(status: unknown) => onOTUpdateStatus(status)"
            />
          </span>
        </v-card-text>
        <v-card-actions v-if="isMatchAlive">
          <v-spacer />
          <span v-if="isLoggedIn">
            <v-btn
              color="success"
              :disabled="!isMatchEndable"
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
  import { MatchGame, MatchLegs, MatchUpdateDto, NullableMatchGame, NullableMatchLegs, NullableMatchQuarter, PlayerDto, PlayersSubstitutionDto } from '../models'
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
  import { EMPTY_MATCH_LEGS, EMPTY_MATCH_LEGS_NULL, EMPTY_OT_LEGS } from '../constants'
  import { format } from 'date-fns'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'

  const i18n = useI18n()
  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { isAdmin, isLoggedIn, loggedInUser } = storeToRefs(authStore)

  const loading = ref(false)

  const isMatchAlive = computed(() => {
    if (
      !selectedMatchDetails?.value?.status ||
      !loggedInUser?.value?.id ||
      (
        ![selectedMatchDetails.value.createdBy].includes(loggedInUser.value.id) &&
        !isAdmin.value
      )
    ) {
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

  const matchLegs: Ref<NullableMatchLegs> = ref({ ...EMPTY_MATCH_LEGS_NULL })
  const matchState: Ref<MatchLegs> = ref({ ...EMPTY_MATCH_LEGS })
  const otLegs: Ref<{ game1: MatchGame, game2: MatchGame, game3: MatchGame }> = ref({ ...EMPTY_OT_LEGS })
  const defaultOTPlayers: {
    guest: { player: PlayerDto | null | undefined, position: string }[],
    home: { player: PlayerDto | null | undefined, position: string }[]
  } = {
    guest: [
      { player: undefined, position: 'G1' },
      { player: undefined, position: 'G2' },
      { player: undefined, position: 'G3' },
      { player: undefined, position: 'G4' },
      { player: undefined, position: 'G5' },
      { player: undefined, position: 'G6' },
    ],
    home: [
      { player: undefined, position: 'H1' },
      { player: undefined, position: 'H2' },
      { player: undefined, position: 'H3' },
      { player: undefined, position: 'H4' },
      { player: undefined, position: 'H5' },
      { player: undefined, position: 'H6' },
    ],
  }
  const selectedOTPlayers: Ref<{
    guest: { player: PlayerDto | null | undefined, position: string }[],
    home: { player: PlayerDto | null | undefined, position: string }[]
  }> = ref({
    ...defaultOTPlayers,
  })
  const isMatchEndable = computed((): boolean => {
    if (!selectedMatchDetails?.value) {
      return false
    }
    if (isAnyLegNull()) {
      return false
    }
    if (
      !isAnyGuestPlayerNull.value &&
      !isAnyHomePlayerNull.value &&
      +matchState.value.qtr4.game4.guest + +matchState.value.qtr4.game4.home !== 16
    ) {
      return false
    }
    if (+matchState.value.qtr4.game4.guest + +matchState.value.qtr4.game4.home === 16 &&
      +matchState.value.qtr4.game4.guest === +matchState.value.qtr4.game4.home &&
      +otLegs.value.game1.guest + +otLegs.value.game2.guest + +otLegs.value.game3.guest !== 2 &&
      +otLegs.value.game1.home + +otLegs.value.game2.home + +otLegs.value.game3.home !== 2
    ) {
      return false
    }
    if (
      isAnyGuestPlayerNull.value &&
      isAnyHomePlayerNull.value &&
      +matchState.value.qtr4.game4.guest + +matchState.value.qtr4.game4.home !== 15
    ) {
      return false
    }
    return true
  })

  const isAnyGuestPlayerNull = computed((): boolean => {
    const players = guestTeamPlayers.value.q1.slice(0, 4)
    return players.some(player => !player.player?.id) || players.length !== 4
  })

  const isAnyHomePlayerNull = computed((): boolean => {
    const players = homeTeamPlayers.value.q1.slice(0, 4)
    return players.some(player => !player.player?.id) || players.length !== 4
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

  const onOTUpdateStatus = async (status: any) => {
    const guestPlayer1 = guestTeamPlayers.value.q4.find(player => player.player?.id === status.status.currentGuestTeamPlayers[0]?.playerId)
    const guestPlayer2 = guestTeamPlayers.value.q4.find(player => player.player?.id === status.status.currentGuestTeamPlayers[1]?.playerId)
    const homePlayer1 = homeTeamPlayers.value.q4.find(player => player.player?.id === status.status.currentHomeTeamPlayers[0]?.playerId)
    const homePlayer2 = homeTeamPlayers.value.q4.find(player => player.player?.id === status.status.currentHomeTeamPlayers[1]?.playerId)
    let firstPosition: number
    switch (status.game) {
      case 'game1':
        firstPosition = 0
        break
      case 'game2':
        firstPosition = 2
        break
      case 'game3':
        firstPosition = 4
        break
      default:
        firstPosition = 0
    }
    selectedOTPlayers.value.guest[firstPosition] = { player: guestPlayer1?.player, position: `G${firstPosition + 1}` }
    selectedOTPlayers.value.guest[firstPosition + 1] = { player: guestPlayer2?.player, position: `G${firstPosition + 2}` }
    selectedOTPlayers.value.home[firstPosition] = { player: homePlayer1?.player, position: `H${firstPosition + 1}` }
    selectedOTPlayers.value.home[firstPosition + 1] = { player: homePlayer2?.player, position: `H${firstPosition + 2}` }

    otLegs.value[status.game as keyof typeof otLegs.value] = status.status.gameLegs

    const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value, otLegs.value, selectedOTPlayers.value)
    if (updatedMatchDto && !initialLoadInProgress.value) {
      await nextTick()
      saveOvertime(updatedMatchDto)
    }
  }
  const recalculateGuestOT3 = () => {
    recalculateOT3Players()
  }
  const recalculateHomeOT3 = () => {
    recalculateOT3Players()
  }

  const recalculateOT3Players = () => {
    if (
      (
        homeTeamPlayers.value.q4.filter(filterPlayer => filterPlayer?.player?.id).length >= 4 &&
        selectedOTPlayers.value.home.filter(filterPlayer => filterPlayer?.player?.id && !['H5', 'H6'].includes(filterPlayer.position)).length < 4
      ) ||
      (
        homeTeamPlayers.value.q4.filter(filterPlayer => filterPlayer?.player?.id).length === 3 &&
        selectedOTPlayers.value.home.filter(filterPlayer => filterPlayer?.player?.id && !['H5', 'H6'].includes(filterPlayer.position)).length < 3
      ) ||
      (
        guestTeamPlayers.value.q4.filter(filterPlayer => filterPlayer?.player?.id).length >= 4 &&
        selectedOTPlayers.value.guest.filter(filterPlayer => filterPlayer?.player?.id && !['G5', 'G6'].includes(filterPlayer.position)).length < 4
      ) ||
      (
        guestTeamPlayers.value.q4.filter(filterPlayer => filterPlayer?.player?.id).length === 3 &&
        selectedOTPlayers.value.guest.filter(filterPlayer => filterPlayer?.player?.id && !['G5', 'G6'].includes(filterPlayer.position)).length < 3
      )
    ) {
      selectedOTPlayers.value.guest[4] = { player: null, position: 'G5' }
      selectedOTPlayers.value.guest[5] = { player: null, position: 'G6' }
      selectedOTPlayers.value.home[4] = { player: null, position: 'H5' }
      selectedOTPlayers.value.home[5] = { player: null, position: 'H6' }

      return
    }
    if (+otLegs.value.game2.home === 1 && +otLegs.value.game1.guest === 1) {
      selectedOTPlayers.value.guest[4] = { ...selectedOTPlayers.value.guest[0], position: 'G5' }
      selectedOTPlayers.value.guest[5] = { ...selectedOTPlayers.value.guest[1], position: 'G6' }
      selectedOTPlayers.value.home[4] = { ...selectedOTPlayers.value.home[2], position: 'H5' }
      selectedOTPlayers.value.home[5] = { ...selectedOTPlayers.value.home[3], position: 'H6' }
    } else if (+otLegs.value.game2.guest === 1 && +otLegs.value.game1.home === 1) {
      selectedOTPlayers.value.guest[4] = { ...selectedOTPlayers.value.guest[2], position: 'G5' }
      selectedOTPlayers.value.guest[5] = { ...selectedOTPlayers.value.guest[3], position: 'G6' }
      selectedOTPlayers.value.home[4] = { ...selectedOTPlayers.value.home[0], position: 'H5' }
      selectedOTPlayers.value.home[5] = { ...selectedOTPlayers.value.home[1], position: 'H6' }
    }
  }

  const oTPlayersSelected = computed(() => {
    if (guestTeamPlayers.value.q4.filter(player => player.player?.id).length === 3 && selectedOTPlayers.value.guest.filter(player => player.player?.id).length < 3) {
      return false
    }
    if (guestTeamPlayers.value.q4.filter(player => player.player?.id).length >= 4 && selectedOTPlayers.value.guest.filter(player => player.player?.id).length < 4) {
      return false
    }

    if (homeTeamPlayers.value.q4.filter(player => player.player?.id).length === 3 && selectedOTPlayers.value.home.filter(player => player.player?.id).length < 3) {
      return false
    }
    if (homeTeamPlayers.value.q4.filter(player => player.player?.id).length >= 4 && selectedOTPlayers.value.home.filter(player => player.player?.id).length < 4) {
      return false
    }

    return true
  })

  const saveOvertime = async (updatedMatchDto: MatchUpdateDto) => {
    if (!oTPlayersSelected.value) {
      return
    }
    inProcess.value = true
    initialLoadInProgress.value = true
    progressSnackbar('saving-changes')
    if (!fetchedMatchDetails?.value?.overtime) {
      const res = await createOvertime(updatedMatchDto)
      if (res) {
        await initiateData()
        inProcess.value = false
        initialLoadInProgress.value = false
        successSnackbar('save-changes-success')
        return
      }
      inProcess.value = false
      initialLoadInProgress.value = false
      failSnackbar('save-changes-fail')
      return
    }
    const res = await updateMatchOvertime(updatedMatchDto)
    if (res) {
      await initiateData()
      inProcess.value = false
      initialLoadInProgress.value = false
      successSnackbar('save-changes-success')
      return
    }
    inProcess.value = false
    initialLoadInProgress.value = false
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
    if (inProcess.value || !selectedMatchDetails?.value || !isMatchAlive.value) {
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
    if (inProcess.value || !selectedMatchDetails?.value || !isMatchAlive.value) {
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
    if (inProcess.value || !selectedMatchDetails?.value || !isMatchAlive?.value) {
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

  const isLegsNull = () => {
    return matchLegs.value.qtr1.game1.guest === null && matchLegs.value.qtr1.game1.home === null &&
      matchLegs.value.qtr1.game2.guest === null && matchLegs.value.qtr1.game2.home === null &&
      matchLegs.value.qtr1.game3.guest === null && matchLegs.value.qtr1.game3.home === null &&
      matchLegs.value.qtr1.game4.guest === null && matchLegs.value.qtr1.game4.home === null &&
      matchLegs.value.qtr2.game1.guest === null && matchLegs.value.qtr2.game1.home === null &&
      matchLegs.value.qtr2.game2.guest === null && matchLegs.value.qtr2.game2.home === null &&
      matchLegs.value.qtr2.game3.guest === null && matchLegs.value.qtr2.game3.home === null &&
      matchLegs.value.qtr2.game4.guest === null && matchLegs.value.qtr2.game4.home === null &&
      matchLegs.value.qtr3.game1.guest === null && matchLegs.value.qtr3.game1.home === null &&
      matchLegs.value.qtr3.game2.guest === null && matchLegs.value.qtr3.game2.home === null &&
      matchLegs.value.qtr3.game3.guest === null && matchLegs.value.qtr3.game3.home === null &&
      matchLegs.value.qtr3.game4.guest === null && matchLegs.value.qtr3.game4.home === null &&
      matchLegs.value.qtr4.game1.guest === null && matchLegs.value.qtr4.game1.home === null &&
      matchLegs.value.qtr4.game2.guest === null && matchLegs.value.qtr4.game2.home === null &&
      matchLegs.value.qtr4.game3.guest === null && matchLegs.value.qtr4.game3.home === null &&
      matchLegs.value.qtr4.game4.guest === null && matchLegs.value.qtr4.game4.home === null
  }

  const isAnyLegNull = () => {
    return matchLegs.value.qtr1.game1.guest === null || matchLegs.value.qtr1.game1.home === null ||
      matchLegs.value.qtr1.game2.guest === null || matchLegs.value.qtr1.game2.home === null ||
      matchLegs.value.qtr1.game3.guest === null || matchLegs.value.qtr1.game3.home === null ||
      matchLegs.value.qtr1.game4.guest === null || matchLegs.value.qtr1.game4.home === null ||
      matchLegs.value.qtr2.game1.guest === null || matchLegs.value.qtr2.game1.home === null ||
      matchLegs.value.qtr2.game2.guest === null || matchLegs.value.qtr2.game2.home === null ||
      matchLegs.value.qtr2.game3.guest === null || matchLegs.value.qtr2.game3.home === null ||
      matchLegs.value.qtr2.game4.guest === null || matchLegs.value.qtr2.game4.home === null ||
      matchLegs.value.qtr3.game1.guest === null || matchLegs.value.qtr3.game1.home === null ||
      matchLegs.value.qtr3.game2.guest === null || matchLegs.value.qtr3.game2.home === null ||
      matchLegs.value.qtr3.game3.guest === null || matchLegs.value.qtr3.game3.home === null ||
      matchLegs.value.qtr3.game4.guest === null || matchLegs.value.qtr3.game4.home === null ||
      matchLegs.value.qtr4.game1.guest === null || matchLegs.value.qtr4.game1.home === null ||
      matchLegs.value.qtr4.game2.guest === null || matchLegs.value.qtr4.game2.home === null ||
      matchLegs.value.qtr4.game3.guest === null || matchLegs.value.qtr4.game3.home === null ||
      matchLegs.value.qtr4.game4.guest === null || matchLegs.value.qtr4.game4.home === null
  }

  const isMatchGameSaveable = (game: NullableMatchGame): boolean => {
    return (game.guest !== null && game.home !== null) || (game.guest === null && game.home === null)
  }
  const isQuarterSaveable = (quarter: NullableMatchQuarter): boolean => {
    return isMatchGameSaveable(quarter.game1) && isMatchGameSaveable(quarter.game2) && isMatchGameSaveable(quarter.game3) && isMatchGameSaveable(quarter.game4)
  }
  const isMatchLegsSaveable = (legs: NullableMatchLegs): boolean => {
    return isQuarterSaveable(legs.qtr1) && isQuarterSaveable(legs.qtr2) && isQuarterSaveable(legs.qtr3) && isQuarterSaveable(legs.qtr4)
  }

  const initialLoadInProgress = ref(true)

  watch(async () => route, async () => {
    await initiateData()
  }, { deep: true })

  watch(matchLegs, () => {
    matchState.value = getMatchState(matchLegs.value)
    if (isLegsNull()) {
      return
    }
    if (!initialLoadInProgress.value && isMatchLegsSaveable(matchLegs.value)) {
      saveChanges()
    }
  }, { deep: true })

  watch(otLegs, () => {
    if (isLegsNull()) {
      return
    }
    recalculateOT3Players()
    if (!initialLoadInProgress.value && isMatchLegsSaveable(matchLegs.value)) {
      const updatedMatchDto = getMatchUpdateDto(matchLegs.value, matchState.value, otLegs.value, selectedOTPlayers.value)
      if (updatedMatchDto) {
        saveOvertime(updatedMatchDto)
      }
    }
  }, { deep: true })

  onMounted(async () => {
    await initiateData()
    initialLoadInProgress.value = false
  })
</script>
