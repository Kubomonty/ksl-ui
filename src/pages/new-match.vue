<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card flat>
    <v-card-title class="mt-3">{{ $t('new-match') }}</v-card-title>
    <v-card-text>
      <v-form class="mt-4" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="newMatch.matchLocation"
          density="compact"
          :label="$t('match-place')"
          required
          :rules="[(val : string) => !!val || $t('match-place-required')]"
          validate-on="input"
          variant="outlined"
        />
        <div class="mb-5">
          <VueDatePicker
            v-model="newMatch.matchDateTime"
            :cancel-text="$t('cancel')"
            :placeholder="$t('date-and-time-of-match')"
            required
            :rules="[(val : string) => !!val || $t('match-place-required')]"
            :select-text="$t('select')"
            style="height: 120%;"
            text-input
            validate-on="input"
          />
        </div>
        <div class="mb-5">
          <h3>{{ i18n.t('home-team') }}</h3>
        </div>
        <v-select
          v-model="newMatch.homeTeam"
          clearable
          density="compact"
          item-title="name"
          item-value="id"
          :items="homeTeams"
          :label="$t('home-team')"
          required
          :rules="[(sel : string) => !!sel || $t('home-team-required')]"
          validate-on="input"
          variant="outlined"
        />
        <TeamMembersSelection
          ref="homeTeamSelectionRef"
          :disabled="!newMatch.homeTeam"
          :is-home-team="true"
          :team-captain="newMatch.homeTeamCaptain"
          :team-members="homeTeamMembers"
          :team-members-selection="newMatch.homeTeamRoster"
          @update:team-captain-select="onHomeTeamCaptainSelection"
          @update:team-select="onHomeTeamRosteSelection"
        />
        <v-divider class="my-3" />
        <div class="mb-5">
          <h3>{{ i18n.t('guest-team') }}</h3>
        </div>
        <v-select
          v-model="newMatch.guestTeam"
          clearable
          density="compact"
          item-title="name"
          item-value="id"
          :items="guestTeams"
          :label="$t('guest-team')"
          required
          :rules="[(sel : string) => !!sel || $t('guest-team-required')]"
          validate-on="input"
          variant="outlined"
        />
        <TeamMembersSelection
          ref="guestTeamSelectionRef"
          :disabled="!newMatch.guestTeam"
          :is-home-team="false"
          :team-captain="newMatch.guestTeamCaptain"
          :team-members="guestTeamMembers"
          :team-members-selection="newMatch.guestTeamRoster"
          @update:team-captain-select="onGuestTeamCaptainSelection"
          @update:team-select="onGuestTeamRosteSelection"
        />
        <v-row class="mr-1 my-3">
          <v-spacer />
          <v-btn
            color="primary"
            flat
            type="submit"
          >{{ $t('create-match') }}</v-btn>
        </v-row>
      </v-form>
    </v-card-text>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-subtitle>{{ $t('are-you-sure') }}</v-card-subtitle>
        <v-card-text v-html="formattedValidationErrors" />
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleWarningDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleWarningDialogConfirm"
          >{{ $t('ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
  import { NewMatchDto, PlayerDto, TeamDto } from '@/models'
  import { useMatchStore, useTeamStore } from '../stores'
  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  const i18n = useI18n()
  const router = useRouter()

  const matchStore = useMatchStore()
  const { newMatch } = storeToRefs(matchStore)

  const teamStore = useTeamStore()
  const { teams } = storeToRefs(teamStore)
  const { fetchTeams } = teamStore
  fetchTeams()
  const dialog: Ref<boolean> = ref(false)

  const guestTeamSelectionRef: Ref = ref()
  const homeTeamSelectionRef: Ref = ref()
  const allTeams: TeamDto[] = teams.value
  const guestTeams: ComputedRef<TeamDto[]> = computed(() => allTeams
    .filter((team: TeamDto) => team.id !== newMatch.value?.homeTeam))
  const homeTeams: ComputedRef<TeamDto[]> = computed(() => allTeams
    .filter((team: TeamDto) => team.id !== newMatch.value?.guestTeam))
  const guestTeamMembers: ComputedRef<PlayerDto[]> = computed((): PlayerDto[] => {
    const selectedTeam = allTeams.find((team: TeamDto) => team.id === newMatch.value?.guestTeam)

    return selectedTeam ? selectedTeam.players : []
  })
  const homeTeamMembers: ComputedRef<PlayerDto[]> = computed((): PlayerDto[] => {
    const selectedTeam = allTeams.find((team: TeamDto) => team.id === newMatch.value?.homeTeam)

    return selectedTeam ? selectedTeam.players : []
  })

  const findDuplicates = (array: string[]): string[] => {
    const seen = new Set<string>()
    const duplicates = new Set<string>()
    for (const item of array) {
      if (seen.has(item)) {
        duplicates.add(item)
      }
      seen.add(item)
    }
    return Array.from(duplicates)
  }

  const validationErrors: Ref<string> = ref('')
  const checkCaptains = (): void => {
    if (!newMatch.value.homeTeamCaptain || !newMatch.value.guestTeamCaptain) {
      return
    }
    if (newMatch.value.homeTeamCaptain === newMatch.value.guestTeamCaptain) {
      validationErrors.value = validationErrors.value
        ? `${validationErrors.value}\n ${i18n.t('captains-should-be-different')}`
        : i18n.t('captains-should-be-different')
    }
  }
  const checkPlayers = (): void => {
    if ([...newMatch.value.guestTeamRoster].filter((player: { playerId: string | undefined, position: string }): boolean => !!player.playerId).length < 4) {
      validationErrors.value = validationErrors.value
        ? `${validationErrors.value}\n ${i18n.t('guest-team-less-players')}`
        : i18n.t('guest-team-less-players')
    }
    if ([...newMatch.value.homeTeamRoster].filter((player: { playerId: string | undefined, position: string }): boolean => !!player.playerId).length < 4) {
      validationErrors.value = validationErrors.value
        ? `${validationErrors.value}\n ${i18n.t('home-team-less-players')}`
        : i18n.t('home-team-less-players')
    }
    const players = [...newMatch.value.guestTeamRoster, ...newMatch.value.homeTeamRoster]
      .filter((player: { playerId: string | undefined, position: string }) => !!player.playerId)
      .map((player: { playerId: string | undefined, position: string }) => player.playerId as string)
    const duplicates = findDuplicates(players)
    if (duplicates.length > 0) {
      const duplicatedPlayersInfo = new Set([...guestTeamMembers.value, ...homeTeamMembers.value]
        .filter((player: PlayerDto) => duplicates.includes(player.id)))
      duplicatedPlayersInfo.forEach((player: PlayerDto) => {
        validationErrors.value = validationErrors.value
          ? `${validationErrors.value}\n ${i18n.t('player-selected-multiple-times')} - ${player.name}`
          : `${i18n.t('player-selected-multiple-times')} - ${player.name}`
      })
    }
  }
  const validationRulesCheck = (): boolean => {
    return !!newMatch.value.matchDateTime &&
      !!newMatch.value.matchLocation &&
      !!newMatch.value.guestTeam &&
      !!newMatch.value.homeTeam &&
      !!newMatch.value.guestTeamCaptain &&
      !!newMatch.value.homeTeamCaptain &&
      !!newMatch.value.guestTeamRoster[0].playerId &&
      !!newMatch.value.guestTeamRoster[1].playerId &&
      !!newMatch.value.guestTeamRoster[2].playerId &&
      !!newMatch.value.homeTeamRoster[0].playerId &&
      !!newMatch.value.homeTeamRoster[1].playerId &&
      !!newMatch.value.homeTeamRoster[2].playerId
  }
  const formattedValidationErrors: ComputedRef<string> = computed(() => {
    return validationErrors.value.replace(/\n/g, '<br>')
  })

  const onGuestTeamCaptainSelection = (captain: string): void => {
    newMatch.value.guestTeamCaptain = captain
  }
  const onGuestTeamRosteSelection = (roster: { playerId: string | undefined, position: string }[]): void => {
    newMatch.value.guestTeamRoster = roster
  }
  const onHomeTeamCaptainSelection = (captain: string): void => {
    newMatch.value.homeTeamCaptain = captain
  }
  const onHomeTeamRosteSelection = (roster: { playerId: string | undefined, position: string }[]): void => {
    newMatch.value.homeTeamRoster = roster
  }

  const handleSubmit = () => {
    validationErrors.value = ''
    checkCaptains()
    checkPlayers()
    // Check mandatory rules.
    if (!validationRulesCheck()) {
      return
    }

    const newMatchData: NewMatchDto = {
      guestTeam: newMatch.value.guestTeam,
      guestTeamCaptain: newMatch.value.guestTeamCaptain,
      guestTeamRoster: newMatch.value.guestTeamRoster,
      homeTeam: newMatch.value.homeTeam,
      homeTeamCaptain: newMatch.value.homeTeamCaptain,
      homeTeamRoster: newMatch.value.homeTeamRoster,
      matchLocation: newMatch.value!.matchLocation,
      matchDateTime: newMatch.value!.matchDateTime,
    }
    newMatch.value = newMatchData

    // Check optional rules and show warning dialog.
    if (validationErrors.value.length) {
      dialog.value = true

      return
    }
    router.push('/new-match-confirm')
  }

  const handleWarningDialogConfirm = (): void => {
    dialog.value = false
    router.push('/new-match-confirm')
  }

  const handleWarningDialogCancel = (): void => {
    dialog.value = false
  }

  watch(() => newMatch.value.guestTeam, () => {
    guestTeamSelectionRef.value.reset()
  })
  watch(() => newMatch.value.homeTeam, () => {
    homeTeamSelectionRef.value.reset()
  })
</script>
