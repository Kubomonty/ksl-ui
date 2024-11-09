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
            v-model="newMatch.matchDate"
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
          item-title="teamName"
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
          :position1="newMatch.homePos1"
          :position2="newMatch.homePos2"
          :position3="newMatch.homePos3"
          :position4="newMatch.homePos4"
          :position5="newMatch.homePos5"
          :position6="newMatch.homePos6"
          :position7="newMatch.homePos7"
          :position8="newMatch.homePos8"
          :team-captain="newMatch.homeCaptain"
          :team-members="homeTeamMembers"
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
          item-title="teamName"
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
          :pos1="newMatch.guestPos1"
          :pos2="newMatch.guestPos2"
          :pos3="newMatch.guestPos3"
          :pos4="newMatch.guestPos4"
          :pos5="newMatch.guestPos5"
          :pos6="newMatch.guestPos6"
          :pos7="newMatch.guestPos7"
          :pos8="newMatch.guestPos8"
          :team-captain="newMatch.guestCaptain"
          :team-members="guestTeamMembers"
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
    <v-dialog v-model="dialog" @keydown.enter="handleWarningDialogConfirm">
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
  import { useAuthStore, useMatchStore, useTeamStore } from '../stores'
  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  const i18n = useI18n()
  const router = useRouter()

  const matchStore = useMatchStore()
  const { newMatch } = storeToRefs(matchStore)
  const authStore = useAuthStore()
  const { loggedInUser } = storeToRefs(authStore)

  const teamStore = useTeamStore()
  const { teams } = storeToRefs(teamStore)
  const { fetchTeams } = teamStore

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
    if (!newMatch.value.homeCaptain || !newMatch.value.guestCaptain) {
      return
    }
    if (newMatch.value.homeCaptain === newMatch.value.guestCaptain) {
      validationErrors.value = validationErrors.value
        ? `${validationErrors.value}\n ${i18n.t('captains-should-be-different')}`
        : i18n.t('captains-should-be-different')
    }
  }
  const checkPlayers = (): void => {
    const guestPlayers: string[] = [
      newMatch.value.guestPos1.trim(),
      newMatch.value.guestPos2.trim(),
      newMatch.value.guestPos3.trim(),
    ]
    if (newMatch.value.guestPos4?.trim()) {
      guestPlayers.push(newMatch.value.guestPos4.trim())
    }
    if (newMatch.value.guestPos5?.trim()) {
      guestPlayers.push(newMatch.value.guestPos5.trim())
    }
    if (newMatch.value.guestPos6?.trim()) {
      guestPlayers.push(newMatch.value.guestPos6.trim())
    }
    if (newMatch.value.guestPos7?.trim()) {
      guestPlayers.push(newMatch.value.guestPos7.trim())
    }
    if (newMatch.value.guestPos8?.trim()) {
      guestPlayers.push(newMatch.value.guestPos8.trim())
    }
    if (guestPlayers.length < 4) {
      validationErrors.value = validationErrors.value
        ? `${validationErrors.value}\n ${i18n.t('guest-team-less-players')}`
        : i18n.t('guest-team-less-players')
    }
    const homePlayers: string[] = [
      newMatch.value.homePos1.trim(),
      newMatch.value.homePos2.trim(),
      newMatch.value.homePos3.trim(),
    ]
    if (newMatch.value.homePos4?.trim()) {
      homePlayers.push(newMatch.value.homePos4.trim())
    }
    if (newMatch.value.homePos5?.trim()) {
      homePlayers.push(newMatch.value.homePos5.trim())
    }
    if (newMatch.value.homePos6?.trim()) {
      homePlayers.push(newMatch.value.homePos6.trim())
    }
    if (newMatch.value.homePos7?.trim()) {
      homePlayers.push(newMatch.value.homePos7.trim())
    }
    if (newMatch.value.homePos8?.trim()) {
      homePlayers.push(newMatch.value.homePos8.trim())
    }
    if (homePlayers.length < 4) {
      validationErrors.value = validationErrors.value
        ? `${validationErrors.value}\n ${i18n.t('home-team-less-players')}`
        : i18n.t('home-team-less-players')
    }
    const players: string[] = [...guestPlayers, ...homePlayers]
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
    return !!newMatch.value.matchDate &&
      !!newMatch.value.matchLocation &&
      !!newMatch.value.guestTeam &&
      !!newMatch.value.homeTeam &&
      !!newMatch.value.guestCaptain &&
      !!newMatch.value.homeCaptain &&
      !!newMatch.value.guestPos1 &&
      !!newMatch.value.guestPos2 &&
      !!newMatch.value.guestPos3 &&
      !!newMatch.value.homePos1 &&
      !!newMatch.value.homePos2 &&
      !!newMatch.value.homePos3
  }
  const formattedValidationErrors: ComputedRef<string> = computed(() => {
    return validationErrors.value.replace(/\n/g, '<br>')
  })

  const onGuestTeamCaptainSelection = (captain: string): void => {
    newMatch.value.guestCaptain = captain
  }
  const onGuestTeamRosteSelection = (roster: {
    position1: string,
    position2: string,
    position3: string,
    position4: string,
    position5: string,
    position6: string,
    position7: string,
    position8: string,
  }): void => {
    newMatch.value.guestPos1 = roster.position1
    newMatch.value.guestPos2 = roster.position2
    newMatch.value.guestPos3 = roster.position3
    newMatch.value.guestPos4 = roster.position4
    newMatch.value.guestPos5 = roster.position5
    newMatch.value.guestPos6 = roster.position6
    newMatch.value.guestPos7 = roster.position7
    newMatch.value.guestPos8 = roster.position8
  }
  const onHomeTeamCaptainSelection = (captain: string): void => {
    newMatch.value.homeCaptain = captain
  }
  const onHomeTeamRosteSelection = (roster: {
    position1: string,
    position2: string,
    position3: string,
    position4: string,
    position5: string,
    position6: string,
    position7: string,
    position8: string,
  }): void => {
    newMatch.value.homePos1 = roster.position1
    newMatch.value.homePos2 = roster.position2
    newMatch.value.homePos3 = roster.position3
    newMatch.value.homePos4 = roster.position4
    newMatch.value.homePos5 = roster.position5
    newMatch.value.homePos6 = roster.position6
    newMatch.value.homePos7 = roster.position7
    newMatch.value.homePos8 = roster.position8
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
      createdAt: new Date(),
      createdBy: loggedInUser!.value!.id,
      guestTeam: newMatch.value.guestTeam,
      guestCaptain: newMatch.value.guestCaptain,
      guestPos1: newMatch.value.guestPos1,
      guestPos2: newMatch.value.guestPos2,
      guestPos3: newMatch.value.guestPos3,
      guestPos4: newMatch.value.guestPos4,
      guestPos5: newMatch.value.guestPos5,
      guestPos6: newMatch.value.guestPos6,
      guestPos7: newMatch.value.guestPos7,
      guestPos8: newMatch.value.guestPos8,
      homeTeam: newMatch.value.homeTeam,
      homeCaptain: newMatch.value.homeCaptain,
      homePos1: newMatch.value.homePos1,
      homePos2: newMatch.value.homePos2,
      homePos3: newMatch.value.homePos3,
      homePos4: newMatch.value.homePos4,
      homePos5: newMatch.value.homePos5,
      homePos6: newMatch.value.homePos6,
      homePos7: newMatch.value.homePos7,
      homePos8: newMatch.value.homePos8,
      matchLocation: newMatch.value!.matchLocation,
      matchDate: newMatch.value!.matchDate,
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

  onMounted(async () => {
    await fetchTeams()
  })

  watch(() => newMatch.value.guestTeam, () => {
    guestTeamSelectionRef.value.reset()
  })
  watch(() => newMatch.value.homeTeam, () => {
    homeTeamSelectionRef.value.reset()
  })
</script>
