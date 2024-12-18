<template>
  <v-card border="flat">
    <br>
    <v-form class="mt-3" @submit.prevent="handleSubmit">
      <v-container>
        <v-text-field
          v-if="loggedInUser?.id"
          v-model="oldPassword"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          density="compact"
          :label="$t('old-password')"
          prepend-inner-icon="mdi-lock-outline"
          :rules="[(val: string) => !!val || $t('password-required')]"
          :type="passwordVisible ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="passwordVisible = !passwordVisible"
        />
        <v-text-field
          v-model="password"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          density="compact"
          :label="loggedInUser?.id ? $t('old-password') : $t('password')"
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
          :label="loggedInUser?.id ? $t('new-password-check') : $t('password-check')"
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
    <v-dialog v-model="dialog" @keydown.enter="handleWarningDialogConfirm">
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
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '../stores'
  import { useI18n } from 'vue-i18n'

  const route = useRoute()
  const router = useRouter()
  const token = route.query.token as string

  const authStore = useAuthStore()
  const { loggedInUser, token: loginToken } = storeToRefs(authStore)

  const i18n = useI18n()

  const oldPassword = ref('')
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
      return
    }
    inProcess.value = true
    snackbarColor.value = 'primary'
    snackbarText.value = i18n.t('resetting-password')
    snackbarTimeout.value = -1
    snackbar.value = true
    try {
      if (loggedInUser?.value?.id) {
        await axios.put(`${import.meta.env.VITE_KSL_API_URL}/auth/change-password`, {
          oldPassword: oldPassword.value,
          newPassword: password.value,
          userId: loggedInUser.value.id,
        }, {
          headers: {
            Authorization: `Bearer ${loginToken.value}`,
          },
        })
      } else {
        await axios.post(`${import.meta.env.VITE_KSL_API_URL}/auth/reset-password`, {
          token,
          newPassword: password.value,
        })
      }
      snackbarColor.value = 'success'
      snackbarText.value = i18n.t('reset-password-success')
      snackbarTimeout.value = 3000
      snackbar.value = true
      inProcess.value = false
      dialog.value = false
      router.push(loggedInUser?.value?.id ? '/' : '/login')
    } catch (error) {
      snackbarColor.value = 'error'
      snackbarText.value = i18n.t('reset-password-failed')
      snackbarTimeout.value = 3000
      snackbar.value = true
      console.error('Error resetting password:', error)
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
