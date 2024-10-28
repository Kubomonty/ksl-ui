<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card flat>
    <v-card-title class="mt-3">{{ $t('new-admin-creation') }}</v-card-title>
    <v-card-text>
      <v-form class="mt-4" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="email"
          density="compact"
          :label="$t('email')"
          required
          :rules="[
            (val : string) => !!val || $t('email-required'),
            (val: string) => /.+@.+\..+/.test(val) || $t('email-invalid')
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
          density="compact"
          :disabled="emailIsUsername"
          :label="$t('username')"
          required
          :rules="[(val : string) => !!val || $t('username-required')]"
          validate-on="input"
          variant="outlined"
        />
        <v-row class="mr-1 my-3">
          <v-spacer />
          <v-btn
            color="primary"
            flat
            type="submit"
          >{{ $t('create-admin') }}</v-btn>
        </v-row>
      </v-form>
    </v-card-text>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('new-admin-creation-info') }}</v-card-text>
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
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useAuthStore, useTeamStore } from '../stores'

  const i18n = useI18n()
  const router = useRouter()

  const teamStore = useTeamStore()
  const { isTeamUsernameUnique } = teamStore

  const authStore = useAuthStore()
  const { createAdmin } = authStore

  const inProcess: Ref<boolean> = ref(false)
  const dialog: Ref<boolean> = ref(false)
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)

  const emailIsUsername: Ref<boolean> = ref(true)
  const email: Ref<string> = ref('')
  const username: Ref<string> = ref('')

  const validationRulesCheck = (): boolean => !!username.value && !!email.value

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
    snackbarText.value = i18n.t('creating-admin').toString()
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
    const createResult = await createAdmin({
      email: email.value,
      username: username.value,
    })
    inProcess.value = false
    if (!createResult) {
      snackbarText.value = i18n.t('creating-admin-failed').toString()
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
    router.push('/admin-section')
  }

  const handleWarningDialogCancel = (): void => {
    dialog.value = false
  }

  watch(() => email.value, () => {
    if (!emailIsUsername.value) {
      return
    }
    username.value = email.value
  })
</script>
