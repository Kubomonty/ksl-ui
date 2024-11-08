<template>
  <v-app>
    <v-app-bar
      color="primary"
      density="compact"
      flat
    >
      <v-app-bar-nav-icon variant="text" @click.stop="onNavBarIconClick" />
      <v-toolbar-title
        v-if="isLoggedIn"
      >{{ loggedInUser?.teamName || `${loggedInUser?.username} - ${loggedInUser?.userEmail}` }}
      </v-toolbar-title>
      <v-toolbar-title
        v-else
      >{{ $t('k-s-l') }}
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
          v-if="isLoggedIn"
          block
          class="mt-3"
          color="primary"
          variant="flat"
          @click="handleLogout"
        >{{ $t('logout') }}
        </v-btn>
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
    </v-navigation-drawer>

    <v-main>
      <router-view />
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
  import { useRouter } from 'vue-router'

  const i18n = useI18n()
  const router = useRouter()

  const authStore = useAuthStore()
  const { isAdmin, isLoggedIn, isUser, loggedInUser } = storeToRefs(authStore)

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
        { title: i18n.t('my-team'), to: `/team-section?id=${loggedInUser?.value?.id}` },
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
    if (to !== '/new-match') {
      resetNewMatch()
    } else {
      router.push(to)
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
