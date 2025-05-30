<template>
  <v-card flat>
    <v-card-title class="mt-3">{{ $t(isAdmin ? 'team-administration' : 'my-team') }}</v-card-title>
    <v-card-text>
      <span v-if="loading">
        <v-skeleton-loader type="paragraph" />
        <v-skeleton-loader type="paragraph" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
      </span>
      <span v-else>
        <v-text-field
          v-model="teamName"
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
        <v-text-field
          v-model="username"
          density="compact"
          :label="$t('username')"
          :readonly="!isAdmin"
          required
          :rules="[(val : string) => !!val || $t('username-required')]"
          validate-on="input"
          variant="outlined"
        />
        <span v-if="players.length">
          <Sortable
            item-key="id"
            :list="players"
            tag="div"
            @end="handlePlayersOrderChange"
          >
            <template #item="{ element, index }">
              <div :key="element.id" class="d-flex mb-3">
                <v-icon class="align-self-center cursor-move" color="primary">mdi-drag-vertical</v-icon>
                <v-text-field
                  v-model="element.name"
                  density="compact"
                  :hide-details="true"
                  :readonly="!isAdmin"
                  variant="outlined"
                  @change="handlePlayerChange(index)"
                />
                <v-btn
                  v-if="isAdmin"
                  class="align-self-center ml-3"
                  color="error"
                  density="compact"
                  icon="mdi-close"
                  size="default"
                  variant="flat"
                  @click="handleRemoveClick(index)"
                />
              </div>
            </template>
          </Sortable>
        </span>
        <div v-if="isAdmin" class="d-flex">
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
            variant="flat"
            @click="handleAddPlayerClick"
          >{{ $t('add-player') }}</v-btn>
        </div>
        <v-divider v-if="isAdmin" class="my-3" />
        <v-btn
          v-if="isAdmin"
          block
          class="align-self-center mt-3"
          color="error"
          variant="flat"
          @click="handleCancelTeamClick"
        >{{ $t('cancel-team') }}</v-btn>
        <v-divider v-if="isAdmin" class="my-3" />
        <div v-if="isAdmin" class="d-flex">
          <v-spacer />
          <v-btn
            class="mr-3"
            color="warning"
            :disabled="!isTeamChanged"
            variant="flat"
            @click="handleResetClick"
          >{{ $t('reset-changes') }}</v-btn>
          <v-btn
            color="success"
            :disabled="!isTeamChanged"
            variant="flat"
            @click="handleSaveChangesClick"
          >{{ $t('save-changes') }}</v-btn>
        </div>
        <div v-if="!isAdmin" class="d-flex">
          <v-spacer />
          <v-btn
            class="mr-3"
            color="warning"
            :disabled="!isTeamChanged"
            variant="flat"
            @click="handleResetClick"
          >{{ $t('reset-changes') }}</v-btn>
          <v-btn
            color="success"
            :disabled="!isTeamChanged"
            variant="flat"
            @click="handleSaveChangedOrderClick"
          >{{ $t('save-changes') }}</v-btn>
        </div>
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
    <v-dialog v-model="saveChangedOrderDialog" @keydown.enter="handleSaveChangedOrderDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('save-changes-info') }}</v-card-text>
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleSaveChangedOrderDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleSaveChangedOrderDialogConfirm"
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
    <v-dialog v-if="isAdmin" v-model="cancelTeamDialog" @keydown.enter="handleCancelTeamDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('cancel-team-info') }}</v-card-text>
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleCancelTeamDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleCancelTeamDialogConfirm"
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
  import { Sortable } from 'sortablejs-vue3'
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
  const { cancelTeam, fetchActiveTeamById: fetchTeamById, fetchTeams, updateOrder, updateTeam } = teamStore

  const inProcess = ref(false)
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)

  const removePlayerDialog: Ref<boolean> = ref(false)
  const removingPlayerIndex: Ref<number> = ref(-1)
  const saveChangesDialog: Ref<boolean> = ref(false)
  const saveChangedOrderDialog: Ref<boolean> = ref(false)
  const resetChangesDialog: Ref<boolean> = ref(false)
  const cancelTeamDialog: Ref<boolean> = ref(false)

  const newPlayerName: Ref<string> = ref('')
  const team: Ref<TeamDto | null> = ref(null)

  const teamName: Ref<string> = ref('')
  const teamEmail: Ref<string> = ref('')
  const username: Ref<string> = ref('')
  const players: Ref<{id: string, name: string, playerOrder: number}[]> = ref([])

  const handlePlayerChange = (index: number): void => {
    players.value[index].name = players.value[index].name.trim()
    players.value = players.value.filter(player => player.name.trim())
  }
  const handlePlayersOrderChange = (event: { newIndex: number, oldIndex: number }): void => {
    const movedPlayer = players.value.splice(event.oldIndex, 1)[0]
    players.value.splice(event.newIndex, 0, movedPlayer)
    players.value.forEach((player, index) => {
      player.playerOrder = index
    })
  }

  const handleAddPlayerClick = (): void => {
    if (!newPlayerName.value.trim()) {
      newPlayerName.value = ''
      return
    }
    const newPlayerObj = { id: `NEW-${uuidv4()}`, name: newPlayerName.value, playerOrder: players.value.length }
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

  const handleSaveChangedOrderClick = (): void => {
    saveChangedOrderDialog.value = true
  }
  const handleSaveChangedOrderDialogCancel = (): void => {
    saveChangedOrderDialog.value = false
  }
  const handleSaveChangedOrderDialogConfirm = async (): Promise<void> => {
    if (inProcess.value) {
      return
    }
    inProcess.value = true
    progressSnackbar('saving-changes')
    const updateRes = await updateOrder(
      team.value!.id,
      players.value,
    )
    if (updateRes) {
      await fetchTeams()
      inProcess.value = false
      successSnackbar('save-changes-success')
      router.push('/team-list')
      return
    }
    inProcess.value = false
    failSnackbar('save-changes-fail')
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
    progressSnackbar('saving-changes')
    const updateRes = await updateTeam({
      teamId: team.value!.id,
      teamName: teamName.value,
      teamEmail: teamEmail.value,
      teamMembers: players.value,
      username: username.value,
    })
    if (updateRes) {
      inProcess.value = false
      successSnackbar('save-changes-success')
      router.push('/team-list')
      return
    }
    inProcess.value = false
    failSnackbar('save-changes-fail')
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

  const handleCancelTeamClick = (): void => {
    cancelTeamDialog.value = true
  }
  const handleCancelTeamDialogCancel = (): void => {
    cancelTeamDialog.value = false
  }
  const handleCancelTeamDialogConfirm = async (): Promise<void> => {
    if (inProcess.value) {
      return
    }
    inProcess.value = true
    progressSnackbar('canceling-team')
    const updateRes = await cancelTeam(team.value!.id)
    if (updateRes) {
      inProcess.value = false
      successSnackbar('cancel-team-success')
      router.push('/team-list')
      return
    }
    inProcess.value = false
    failSnackbar('cancel-team-fail')
  }

  const isTeamChanged = computed(() => {
    return (
      (
        !_.isEqual(team.value?.players, players.value) ||
        team.value?.teamName !== teamName.value ||
        team.value?.teamEmail !== teamEmail.value ||
        team.value?.username !== username.value
      ) &&
      !loading.value &&
      !inProcess.value &&
      !!teamName.value.trim().length &&
      !!teamEmail.value.trim().length &&
      !!username.value.trim().length
    )
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
    if (team.value!.username) {
      username.value = team.value!.username
    }
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

  watch(() => route.query.id, async () => {
    if (route.query.id) {
      loading.value = true
      team.value = await fetchTeamById(route.query.id as string)
      if (team.value) {
        populateTeam()
        loading.value = false
      }
    } else {
      router.push('/team-list')
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
      router.push('/team-list')
    }
  })
</script>
