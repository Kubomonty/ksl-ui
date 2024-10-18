<template>
  <v-app>
    <v-app-bar
      color="primary"
      density="compact"
    >
      <v-app-bar-nav-icon variant="text" @click.stop="onNavBarIconClick" />
      <v-toolbar-title>{{ `Fénixove vajcia` }}</v-toolbar-title>
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
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { useDisplay } from 'vuetify'
  import { useI18n } from 'vue-i18n'
  import { useMatchStore } from '../stores'
  const i18n = useI18n()

  const matchStore = useMatchStore()
  const { resetNewMatch } = matchStore

  const drawer: Ref<boolean> = ref(false)
  const onNavBarIconClick = (): void => {
    drawer.value = !drawer.value
  }
  const { mobile } = useDisplay()
  const isMobile: ComputedRef<boolean> = computed(() => mobile.value)
  const items = [
    { title: i18n.t('home'), to: '/' },
    { title: i18n.t('new-match'), to: '/new-match' },
  ]

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
