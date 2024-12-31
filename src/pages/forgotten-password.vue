<template>
  <v-card border="flat">
    <br>
    <v-form class="mt-3" @submit.prevent="handleSubmit">
      <v-container>
        <p>{{ $t('initiate-reset-password') }}</p>
        <br>
        <v-text-field
          v-model="username"
          density="compact"
          :label="$t('username')"
          :rules="[(val: string) => !!val || $t('username-required')]"
          variant="outlined"
        />
        <v-text-field
          v-model="email"
          density="compact"
          :label="$t('email')"
          :rules="[(val: string) => !!val || $t('email-required')]"
          type="email"
          variant="outlined"
        />
        <v-btn
          class="submit-button"
          color="primary"
          :disabled="inProcess"
          flat
          type="submit"
        >{{ $t('submit') }}</v-btn>
      </v-container>
    </v-form>
    <v-dialog v-model="dialog" @keydown.enter="handleWarningDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('initiate-reset-password-info') }}</v-card-text>
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
  import { isValidEmail } from '../utils'
  import axios from 'axios'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const i18n = useI18n()

  const email = ref('')
  const username = ref('')
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)
  const dialog = ref(false)

  const inProcess = ref(false)

  const handleSubmit = (): void => {
    if (!username.value || !email.value || inProcess.value || !isValidEmail(email.value)) {
      return
    }
    dialog.value = true
  }

  const handleWarningDialogCancel = (): void => {
    dialog.value = false
  }

  const handleWarningDialogConfirm = async (): Promise<void> => {
    if (inProcess.value) {
      return
    }
    inProcess.value = true
    snackbarColor.value = 'primary'
    snackbarText.value = i18n.t('resetting-password')
    snackbarTimeout.value = -1
    snackbar.value = true
    try {
      await axios.post(`${import.meta.env.VITE_KSL_API_URL}/auth/request-password-reset`, {
        email: email.value,
        username: username.value,
      })
      snackbarColor.value = 'success'
      snackbarText.value = i18n.t('reset-password-success')
      snackbarTimeout.value = 3000
      snackbar.value = true
    } catch (error) {
      snackbarColor.value = 'error'
      snackbarText.value = i18n.t('reset-password-fail')
      snackbarTimeout.value = 3000
      snackbar.value = true
      console.error('Error resetting password:', error)
    } finally {
      inProcess.value = false
      dialog.value = false
      router.push('/')
    }
  }
</script>

<style scoped>
.submit-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
