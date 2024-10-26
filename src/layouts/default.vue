<template>
  <v-app>
    <v-app-bar
      color="primary"
      density="compact"
      flat
    >
      <v-app-bar-nav-icon variant="text" @click.stop="onNavBarIconClick" />
      <v-toolbar-title
        v-if="isAuthenticated"
      >{{ `Fénix DC` }}
      </v-toolbar-title>
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
      <v-divider />
      <div class="pa-2">
        <v-btn
          v-if="isAuthenticated"
          block
          class="mt-3"
          color="primary"
          variant="tonal"
          @click="handleLogout"
        >{{ $t('logout') }}
        </v-btn>
        <v-btn
          v-else
          block
          class="mt-3"
          color="primary"
          variant="tonal"
          @click="handleLogin"
        >{{ $t('login') }}
        </v-btn>
      </div>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { computed, Ref, ref } from 'vue'
  import { useAuthStore, useMatchStore } from '../stores'
  import { storeToRefs } from 'pinia'
  import { useDisplay } from 'vuetify'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const i18n = useI18n()
  const router = useRouter()

  const authStore = useAuthStore()
  const { clearToken } = authStore
  const { isAuthenticated } = storeToRefs(authStore)

  const matchStore = useMatchStore()
  const { resetNewMatch } = matchStore

  const drawer: Ref<boolean> = ref(false)
  const onNavBarIconClick = (): void => {
    drawer.value = !drawer.value
  }
  const { mobile } = useDisplay()
  const isMobile: ComputedRef<boolean> = computed(() => mobile.value)
  const items: ComputedRef<{ title: string, to: string, action?: () => void}[]> = computed(() => {
    return isAuthenticated.value ? [
      { title: i18n.t('home'), to: '/' },
      { title: i18n.t('all-teams'), to: '/all-teams' },
      { title: i18n.t('new-match'), to: '/new-match' },
      { title: i18n.t('my-team'), to: '/my-team' },
    ] : [
      { title: i18n.t('home'), to: '/' },
      { title: i18n.t('all-teams'), to: '/all-teams' },
    ]
  })

  const handleLogin = (): void => {
    resetNewMatch()
    router.push('/login')
  }

  const handleLogout = (): void => {
    clearToken()
    resetNewMatch()
    router.push('/')
  }

  const onListItemClick = (to: string) => {
    if (to !== '/new-match') {
      resetNewMatch()
    }
  }
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
