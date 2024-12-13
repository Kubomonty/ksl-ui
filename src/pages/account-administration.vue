<template>
  <v-card flat>
    <v-card-title class="mt-3">{{ $t('team-administration') }}</v-card-title>
    <v-card-text>
      <span v-if="loading">
        <v-skeleton-loader type="paragraph" />
        <v-skeleton-loader type="paragraph" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
      </span>
      <span v-else>
        <v-text-field
          v-model="teamEmail"
          density="compact"
          :label="$t('account-email')"
          readonly
          variant="outlined"
        />
        <v-text-field
          v-model="userName"
          density="compact"
          :hide-details="true"
          readonly
          variant="outlined"
        />
        <v-divider class="my-3" />
        <v-btn
          class="full-width-button mb-3"
          color="success"
          :disabled="!isTeamChanged"
          variant="flat"
          @click="handleSaveChangesClick"
        >{{ $t('save-changes') }}</v-btn>
      </span>
    </v-card-text>
    <v-dialog v-model="removePlayerDialog" @keydown.enter="handleRemovePlayerDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-subtitle>{{ `${$t('remove-player')} ${players[removingPlayerIndex]?.name}?` }}</v-card-subtitle>
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleRemovePlayerDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleRemovePlayerDialogConfirm"
          >{{ $t('ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="saveChangesDialog" @keydown.enter="handleSaveChangesDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('save-changes-info') }}</v-card-text>
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleSaveChangesDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleSaveChangesDialogConfirm"
          >{{ $t('ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="resetChangesDialog" @keydown.enter="handleResetChangesDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('reset-changes-info') }}</v-card-text>
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleResetChangesDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleResetChangesDialogConfirm"
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
  import { useAuthStore, useTeamStore } from '../stores'
  import { useRoute, useRouter } from 'vue-router'
  import { TeamDto } from '../models'
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { v4 as uuidv4 } from 'uuid'
  import _ from 'lodash'

  const i18n = useI18n()

  const loading: Ref<boolean> = ref(false)

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const { isAdmin } = storeToRefs(authStore)
  const teamStore = useTeamStore()
  const { fetchTeamById, updateTeam } = teamStore

  const inProcess = ref(false)
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)

  const removePlayerDialog: Ref<boolean> = ref(false)
  const removingPlayerIndex: Ref<number> = ref(-1)
  const saveChangesDialog: Ref<boolean> = ref(false)
  const resetChangesDialog: Ref<boolean> = ref(false)

  const newPlayerName: Ref<string> = ref('')
  const team: Ref<TeamDto | null> = ref(null)

  const userName: Ref<string> = ref('')
  const teamName: Ref<string> = ref('')
  const teamEmail: Ref<string> = ref('')

  const handleSaveChangesClick = (): void => {
    saveChangesDialog.value = true
  }
  const handleSaveChangesDialogCancel = (): void => {
    saveChangesDialog.value = false
  }
  const handleSaveChangesDialogConfirm = async (): Promise<void> => {
    if (inProcess.value) {
      return
    }
    inProcess.value = true
    snackbarColor.value = 'info'
    snackbarTimeout.value = -1
    snackbar.value = true
    snackbarText.value = i18n.t('saving-changes').toString()
    const updateRes = await updateTeam({
      teamId: team.value!.id,
      teamName: teamName.value,
      teamEmail: teamEmail.value,
      teamMembers: players.value,
    })
    if (updateRes) {
      inProcess.value = false
      snackbar.value = true
      snackbarColor.value = 'success'
      snackbarText.value = i18n.t('save-changes-success').toString()
      snackbarTimeout.value = 3000
      router.push('/all-teams')
      return
    }

    inProcess.value = false
    snackbar.value = true
    snackbarColor.value = 'error'
    snackbarText.value = i18n.t('save-changes-failed').toString()
    snackbarTimeout.value = 3000
  }

  const handleResetClick = (): void => {
    resetChangesDialog.value = true
  }
  const handleResetChangesDialogCancel = (): void => {
    resetChangesDialog.value = false
  }
  const handleResetChangesDialogConfirm = (): void => {
    populateTeam()
    resetChangesDialog.value = false
  }

  const isTeamChanged = computed(() => {
    return !_.isEqual(team.value?.players, players.value) ||
      team.value?.teamName !== teamName.value ||
      team.value?.teamEmail !== teamEmail.value
  })

  const populateTeam = (): void => {
    teamName.value = team.value!.teamName
    teamEmail.value = team.value!.teamEmail
    players.value = []
    if (team.value!.players.length) {
      team.value!.players.forEach(player => {
        players.value.push({ ...player })
      })
    }
  }

  watch(() => route.query.id, async () => {
    if (route.query.id) {
      loading.value = true
      team.value = await fetchTeamById(route.query.id as string)
      if (team.value) {
        populateTeam()
        loading.value = false
      }
    } else {
      router.push('/all-teams')
    }
  })

  onMounted(async () => {
    if (route.query.id) {
      loading.value = true
      team.value = await fetchTeamById(route.query.id as string)
      if (team.value) {
        populateTeam()
        loading.value = false
      }
    } else {
      router.push('/all-teams')
    }
  })
</script>

<style scoped>
.full-width-button {
  width: 100%;
}
.fill-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
