<template>
  <v-app>
    <v-app-bar
      color="primary"
      density="compact"
      flat
    >
      <v-app-bar-nav-icon variant="text" @click.stop="onNavBarIconClick" />
      <v-app-bar-title
        v-if="isLoggedIn"
      >{{ loggedInUser?.teamName || `${loggedInUser?.username} - ${loggedInUser?.userEmail}` }}
      </v-app-bar-title>
      <v-app-bar-title
        v-else
        class="text-overflow"
        :class="xs ? 'text-subtitle-2' : ''"
      >{{ $t('k-s-l') }}&nbsp;{{ $t('el-darts') }}
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :location="isMobile ? 'bottom' : 'left'"
      :sticky="isMobile"
      temporary
    >
      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.to"
          @click="onListItemClick(item.to)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <span v-if="showLoginButton">
        <v-divider />
        <div class="pa-2">
          <span v-if="isLoggedIn">
            <v-btn
              block
              class="mt-3"
              color="primary"
              variant="flat"
              @click="handleLogout"
            >{{ $t('logout') }}
            </v-btn>
            <v-btn
              block
              class="my-2"
              color="primary"
              size="small"
              variant="text"
              @click="() => router.push('/reset-password')"
            >{{ $t('change-password') }}</v-btn>
          </span>
          <v-btn
            v-else
            block
            class="mt-3"
            color="primary"
            variant="flat"
            @click="handleLogin"
          >{{ $t('login') }}
          </v-btn>
        </div>
      </span>
    </v-navigation-drawer>

    <v-main>
      <router-view />
      <v-snackbar
        v-model="snackbar"
        color="error"
        :timeout="5000"
      >
        {{ $t('you-need-to-login') }}
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
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { computed, Ref, ref } from 'vue'
  import { useAuthStore, useMatchStore } from '../stores'
  import { logout } from '../api/auth'
  import { storeToRefs } from 'pinia'
  import { useDisplay } from 'vuetify'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'

  const { xs } = useDisplay()

  const i18n = useI18n()
  const router = useRouter()
  const route = useRoute()

  const snackbar = ref(false)

  const showLoginButton = computed(() => !route.path.includes('login'))

  const authStore = useAuthStore()
  const { isAdmin, isLoggedIn, isUser, loggedInUser, logoutTimeOutTriggered } = storeToRefs(authStore)

  const matchStore = useMatchStore()
  const { resetNewMatch } = matchStore

  const drawer: Ref<boolean> = ref(false)
  const onNavBarIconClick = (): void => {
    drawer.value = !drawer.value
  }
  const { mobile } = useDisplay()
  const isMobile: ComputedRef<boolean> = computed(() => mobile.value)
  const items: ComputedRef<{ title: string, to: string, action?: () => void}[]> = computed(() => {
    if (isAdmin.value) {
      return [
        { title: i18n.t('home'), to: '/' },
        { title: i18n.t('all-teams'), to: '/all-teams' },
        { title: i18n.t('new-match'), to: '/new-match' },
        { title: i18n.t('admin-section'), to: '/admin-section' },
      ]
    } else if (isUser.value) {
      return [
        { title: i18n.t('home'), to: '/' },
        { title: i18n.t('all-teams'), to: '/all-teams' },
        { title: i18n.t('new-match'), to: '/new-match' },
        { title: i18n.t('team-administration'), to: `/team-administration?id=${loggedInUser?.value?.id}` },
      ]
    } else {
      return [
        { title: i18n.t('home'), to: '/' },
        { title: i18n.t('all-teams'), to: '/all-teams' },
      ]
    }
  })

  const handleLogin = (): void => {
    router.push('/login')
  }

  const handleLogout = (): void => {
    logout()
    router.push('/')
  }

  const onListItemClick = (to: string) => {
    if (to === '/new-match') {
      resetNewMatch()
    } else {
      router.push(to)
    }
  }

  watch(logoutTimeOutTriggered, value => {
    if (value) {
      logout()
      console.error('invalid login token')
      router.push('/login')
      snackbar.value = true
      logoutTimeOutTriggered.value = false
    }
  })
</script>

<style scoped>
/* Ensure the navigation drawer is fixed at the bottom on mobile */
.v-navigation-drawer--bottom {
  position: fixed !important;
  bottom: 0;
  width: 100%;
  height: auto;
}
</style>
