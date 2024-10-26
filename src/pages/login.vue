<template>
  <v-card border="flat">
    <br>
    <v-form class="mt-3" @submit.prevent="handleLogin">
      <v-container>
        <v-text-field
          v-model="username"
          density="compact"
          :label="$t('username')"
          validate-on="input"
          variant="outlined"
        />
        <v-text-field
          v-model="password"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          density="compact"
          :label="$t('password')"
          prepend-inner-icon="mdi-lock-outline"
          :type="passwordVisible ? 'text' : 'password'"
          variant="outlined"
          @click:append-inner="passwordVisible = !passwordVisible"
        />
        <v-btn
          class="login-button"
          color="primary"
          :disabled="performingLogin"
          flat
          type="submit"
        >{{ $t('login') }}</v-btn>
      </v-container>
    </v-form>
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
  import { ref } from 'vue'
  import { login } from '../api/auth'
  import { useAuthStore } from '../stores'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const i18n = useI18n()
  const router = useRouter()

  const authStore = useAuthStore()

  const username = ref('')
  const password = ref('')
  const passwordVisible = ref(false)
  const snackbar = ref(false)
  const snackbarColor = ref('')
  const snackbarText = ref('')
  const snackbarTimeout = ref(-1)

  const performingLogin = ref(false)

  const handleLogin = async (): Promise<void> => {
    if (performingLogin.value) {
      return
    }
    performingLogin.value = true
    snackbarText.value = i18n.t('logging-in').toString()
    snackbarColor.value = 'info'
    snackbarTimeout.value = -1
    snackbar.value = true
    try {
      const data = await login(username.value, password.value)
      authStore.setToken(data.token)
      performingLogin.value = false
      snackbar.value = false
      snackbarColor.value = 'success'
      snackbarText.value = i18n.t('login-success').toString()
      snackbarTimeout.value = 3000
      router.push('/')
    } catch (error) {
      console.error('Login failed:', error)
      snackbarText.value = i18n.t('login-failed').toString()
      snackbarColor.value = 'warning'
      snackbarTimeout.value = 3000
      snackbar.value = true
      performingLogin.value = false
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
