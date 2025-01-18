<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card flat>
    <v-card-title class="mt-3">{{ $t('new-team-creation') }}</v-card-title>
    <v-card-text>
      <v-form class="mt-4" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="teamName"
          clearable
          density="compact"
          :label="$t('team-name')"
          required
          :rules="[(val : string) => !!val || $t('team-name-required')]"
          validate-on="input"
          variant="outlined"
        />
        <v-text-field
          v-model="teamEmail"
          clearable
          density="compact"
          :label="$t('team-email')"
          required
          :rules="[
            (val : string) => !!val || $t('team-email-required'),
            (val: string) => /.+@.+\..+/.test(val) || $t('team-email-invalid')
          ]"
          type="email"
          validate-on="input"
          variant="outlined"
        />
        <v-checkbox
          v-model="emailIsUsername"
          :label="$t('email-is-username')"
        />
        <v-text-field
          v-model="username"
          clearable
          density="compact"
          :disabled="emailIsUsername"
          :label="$t('username')"
          required
          :rules="[(val : string) => !!val || $t('username-required')]"
          validate-on="input"
          variant="outlined"
        />
        <v-divider class="my-3" />
        <div v-for="(_player, index) in players" :key="index">
          <v-text-field
            v-model="players[index]"
            clearable
            density="compact"
            :label="`${$t('team-member-no')} ${index + 1}`"
            variant="outlined"
            @blur="handlePlayersBlur"
            @input="handlePlayersInput(index)"
          />
        </div>
        <v-row class="mr-1 my-3">
          <v-spacer />
          <v-btn
            color="primary"
            flat
            type="submit"
          >{{ $t('create-team') }}</v-btn>
        </v-row>
      </v-form>
    </v-card-text>
    <v-dialog v-model="dialog" @keydown.enter="handleWarningDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('new-team-creation-info') }}</v-card-text>
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleWarningDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            :disabled="inProcess"
            variant="flat"
            @click="handleWarningDialogConfirm"
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

<script setup lang="ts">
  import { ref, Ref, watch } from 'vue'
  import { isValidEmail } from '../utils'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useTeamStore } from '../stores'

  const i18n = useI18n()
  const router = useRouter()

  const teamStore = useTeamStore()
  const { createTeam, isTeamUsernameUnique } = teamStore

  const inProcess: Ref<boolean> = ref(false)
  const dialog: Ref<boolean> = ref(false)
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)

  const emailIsUsername: Ref<boolean> = ref(true)
  const teamName: Ref<string> = ref('')
  const teamEmail: Ref<string> = ref('')
  const username: Ref<string> = ref('')
  const players: Ref<string[]> = ref([''])

  const handlePlayersInput: (index: number) => void = (index: number) => {
    if (index + 1 !== players.value.length) {
      return
    }
    if (players.value[index] && players.value[index].trim() === '') {
      return
    }
    players.value.push('')
  }
  const handlePlayersBlur: () => void = () => {
    players.value.forEach((player: string | null | undefined, index: number) => {
      if (index + 1 === players.value.length) {
        return
      }
      if (!player || player.trim() === '') {
        players.value.splice(index, 1)
      }
    })
  }

  const validationRulesCheck = (): boolean => {
    return !!username.value && !!teamEmail.value && isValidEmail(teamEmail.value)
  }

  const handleSubmit = () => {
    // Check mandatory rules.
    if (!validationRulesCheck()) {
      return
    }
    dialog.value = true
  }

  const handleWarningDialogConfirm = async (): Promise<void> => {
    if (inProcess.value) {
      return
    }
    inProcess.value = true
    snackbarText.value = i18n.t('creating-team').toString()
    snackbarColor.value = 'info'
    snackbarTimeout.value = -1
    snackbar.value = true
    const isUnique = await isTeamUsernameUnique(username.value)
    if (!isUnique) {
      snackbarText.value = i18n.t('username-not-unique').toString()
      snackbarColor.value = 'warning'
      snackbarTimeout.value = 3000
      snackbar.value = true
      inProcess.value = false
      dialog.value = false
      return
    }
    const teamObj: {
      teamEmail: string,
      teamMembers?: string[],
      teamName: string,
      username: string,
    } = {
      teamEmail: teamEmail.value,
      teamName: teamName.value,
      username: username.value,
    }
    const playersArr = players.value
      .filter((player: string | null) => !!player)
      .filter((player: string) => !!player.trim())
    if (playersArr.length > 0) {
      teamObj.teamMembers = playersArr
    }
    const createResult = await createTeam(teamObj)
    inProcess.value = false
    if (!createResult) {
      snackbarText.value = i18n.t('creating-team-fail').toString()
      snackbarColor.value = 'warning'
      snackbarTimeout.value = 3000
      snackbar.value = true
      dialog.value = false
      return
    }
    snackbar.value = false
    snackbarColor.value = ''
    snackbarText.value = ''
    snackbarTimeout.value = -1
    dialog.value = false
    router.push('/team-list')
  }

  const handleWarningDialogCancel = (): void => {
    dialog.value = false
  }

  watch(() => teamEmail.value, () => {
    if (!emailIsUsername.value) {
      return
    }
    username.value = teamEmail.value
  })
</script>
