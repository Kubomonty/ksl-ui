<template>
  <v-card border="flat">
    <br>
    <v-form class="mt-3" @submit.prevent="handleSubmit">
      <v-container>
        <v-text-field
          v-model="password"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          density="compact"
          :label="$t('password')"
          prepend-inner-icon="mdi-lock-outline"
          :rules="[(val: string) => !!val || $t('password-required')]"
          :type="passwordVisible ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="passwordVisible = !passwordVisible"
        />
        <v-text-field
          v-model="passwordCheck"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          density="compact"
          :label="$t('password-check')"
          prepend-inner-icon="mdi-lock-outline"
          :rules="[
            (val: string) => !!val || $t('password-required'),
            (val: string) => val === password || $t('passwords-dont-match')
          ]"
          :type="passwordVisible ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="passwordVisible = !passwordVisible"
        />
        <v-btn
          class="login-button"
          color="primary"
          :disabled="inProcess"
          flat
          type="submit"
        >{{ $t('set-new-password') }}</v-btn>
      </v-container>
    </v-form>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-text>{{ $t('reset-password-info') }}</v-card-text>
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
  import axios from 'axios'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const token = route.query.token as string

  const i18n = useI18n()

  const password = ref('')
  const passwordCheck = ref('')
  const passwordVisible = ref(false)
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)
  const dialog = ref(false)

  const inProcess = ref(false)

  const handleSubmit = (): void => {
    if (!password.value || (password.value !== passwordCheck.value)) {
      return
    }
    dialog.value = true
  }

  const handleWarningDialogCancel = (): void => {
    dialog.value = false
  }

  const handleWarningDialogConfirm = async (): Promise<void> => {
    if (inProcess.value) {
      console.log('Already in process')
      return
    }
    inProcess.value = true
    snackbarColor.value = 'primary'
    snackbarText.value = i18n.t('resetting-password')
    snackbarTimeout.value = -1
    snackbar.value = true
    try {
      await axios.post(`${import.meta.env.VITE_KSL_API_URL}/auth/reset-password`, {
        token,
        newPassword: password.value,
      })
      snackbarColor.value = 'success'
      snackbarText.value = i18n.t('reset-password-success')
      snackbarTimeout.value = 3000
      snackbar.value = true
    } catch (error) {
      snackbarColor.value = 'error'
      snackbarText.value = i18n.t('reset-password-failed')
      snackbarTimeout.value = 3000
      snackbar.value = true
      console.error('Error resetting password:', error)
    } finally {
      inProcess.value = false
      dialog.value = false
    }
  }
</script>

<style scoped>
.login-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
