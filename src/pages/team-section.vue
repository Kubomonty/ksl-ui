<template>
  <v-card flat>
    <v-card-title class="mt-3">{{ $t('team-administration') }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="teamName"
        :clearable="isAdmin"
        density="compact"
        :label="$t('team-name')"
        :readonly="!isAdmin"
        required
        :rules="[(val : string) => !!val || $t('team-name-required')]"
        validate-on="input"
        variant="outlined"
      />
      <v-text-field
        v-model="teamEmail"
        :clearable="isAdmin"
        density="compact"
        :label="$t('team-email')"
        :readonly="!isAdmin"
        required
        :rules="[
          (val : string) => !!val || $t('team-email-required'),
          (val: string) => /.+@.+\..+/.test(val) || $t('team-email-invalid')
        ]"
        type="email"
        validate-on="input"
        variant="outlined"
      />
      <span v-if="players.length">
        <div
          v-for="(player, i) in players"
          :key="player.id"
          class="d-flex mb-3"
        >
          <v-text-field
            v-model="players[i].name"
            density="compact"
            :hide-details="true"
            variant="outlined"
          />
          <v-btn
            class="align-self-center ml-3"
            color="error"
            density="compact"
            icon="mdi-close"
            size="default"
            variant="flat"
            @click="handleRemoveClick(i)"
          />
        </div>
      </span>
      <div class="d-flex">
        <v-text-field
          v-model="newPlayerName"
          density="compact"
          :hide-details="true"
          variant="outlined"
          @keydown.enter="handleAddPlayerClick"
        />
        <v-btn
          class="align-self-center ml-3"
          color="success"
          variant="outlined"
          @click="handleAddPlayerClick"
        >{{ $t('add-player') }}</v-btn>
      </div>
      <v-divider class="my-3" />
      <v-btn
        class="full-width-button mb-3"
        color="success"
        :disabled="!isTeamChanged"
        variant="outlined"
        @click="handleSaveChangesClick"
      >{{ $t('save-changes') }}</v-btn>
      <v-btn
        class="full-width-button"
        color="warning"
        :disabled="!isTeamChanged"
        variant="outlined"
        @click="handleResetClick"
      >{{ $t('reset-changes') }}</v-btn>
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

  const teamName: Ref<string> = ref('')
  const teamEmail: Ref<string> = ref('')
  const players: Ref<{id: string, name: string}[]> = ref([])

  const handleAddPlayerClick = (): void => {
    const newPlayerObj = { id: `NEW-${uuidv4()}`, name: newPlayerName.value }
    players.value.push(newPlayerObj)
    newPlayerName.value = ''
  }
  const handleRemoveClick = (index: number): void => {
    removingPlayerIndex.value = index
    removePlayerDialog.value = true
  }
  const handleRemovePlayerDialogConfirm = (): void => {
    players.value.splice(removingPlayerIndex.value, 1)
    removePlayerDialog.value = false
    removingPlayerIndex.value = -1
  }
  const handleRemovePlayerDialogCancel = (): void => {
    removePlayerDialog.value = false
    removingPlayerIndex.value = -1
  }

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
    if (team.value!.players.length) {
      team.value!.players.forEach(player => {
        players.value.push({ ...player })
      })
    } else {
      players.value = []
    }
  }

  watch(() => route.query.id, async () => {
    if (route.query.id) {
      team.value = await fetchTeamById(route.query.id as string)
      if (team.value) {
        populateTeam()
      }
    } else {
      router.push('/all-teams')
    }
  })

  onMounted(async () => {
    if (route.query.id) {
      team.value = await fetchTeamById(route.query.id as string)
      if (team.value) {
        populateTeam()
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
