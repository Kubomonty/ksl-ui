<template>
  <v-card border="flat">
    <br>
    <v-form class="mt-3" @submit.prevent="handleSubmit">
      <v-container>
        <p>{{ $t('initiate-reset-password') }}</p>
        <br>
        <v-text-field
          v-model="email"
          density="compact"
          :label="$t('email')"
          :rules="[(val: string) => !!val || $t('email-required')]"
          type="email"
          variant="outlined"
        />
        <v-select
          v-if="multipleAccountsForEmail"
          v-model="username"
          density="compact"
          item-text="username"
          item-value="id"
          :items="availableAccounts"
          :label="$t('select-account')"
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
  import axios, { AxiosResponse } from 'axios'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const i18n = useI18n()

  const email = ref('')
  const username = ref(null)
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)
  const dialog = ref(false)

  const inProcess = ref(false)
  const multipleAccountsForEmail = ref(false)
  const availableAccounts = ref([])

  const handleSubmit = (): void => {
    if (!email.value ||
      inProcess.value ||
      !isValidEmail(email.value) ||
      (multipleAccountsForEmail.value && !username.value)
    ) {
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
      let res: AxiosResponse<any, any>
      if (!multipleAccountsForEmail.value) {
        res = await axios.get(`${import.meta.env.VITE_KSL_API_URL}/auth/reset-password-precheck?email=${email.value}`)
        if (res.data.length > 1) {
          availableAccounts.value = res.data
          multipleAccountsForEmail.value = true
          snackbarColor.value = 'warning'
          snackbarText.value = i18n.t('reset-password-multiple-accounts')
          snackbarTimeout.value = 3000
          snackbar.value = true
          dialog.value = false
          inProcess.value = false
        } else if (res.data.length === 1) {
          snackbarColor.value = 'success'
          snackbarText.value = i18n.t('reset-password-success')
          snackbarTimeout.value = 3000
          snackbar.value = true
          await sleep(1000)
          inProcess.value = false
          router.push('/')
        } else {
          snackbarColor.value = 'error'
          snackbarText.value = i18n.t('reset-password-no-accounts')
          snackbarTimeout.value = 3000
          snackbar.value = true
          dialog.value = false
          inProcess.value = false
        }
      } else {
        res = await axios.post(`${import.meta.env.VITE_KSL_API_URL}/auth/request-password-reset`, {
          email: email.value,
          username: username.value,
        })
        snackbarColor.value = 'success'
        snackbarText.value = i18n.t('reset-password-success')
        snackbarTimeout.value = 3000
        snackbar.value = true
        await sleep(1000)
        inProcess.value = false
        router.push('/')
      }
    } catch (error) {
      snackbarColor.value = 'error'
      snackbarText.value = i18n.t('reset-password-fail')
      snackbarTimeout.value = 3000
      snackbar.value = true
      inProcess.value = false
      dialog.value = false
      console.error('Error resetting password:', error)
    }
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
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
