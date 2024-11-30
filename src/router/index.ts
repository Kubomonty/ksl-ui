/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '../stores/auth.store'

const adminOnlyRoutes: string[] = [
  '/admin-section',
]

const userOwnRoutes: string[] = [
]

const loggedInRoutes: string[] = [
  '/new-match',
  '/new-match-confirm',
  '/new-team',
  '/team-administration',
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (adminOnlyRoutes.includes(to.path) && !authStore.isAdmin) {
    next({ path: '/' })
  } else if ((userOwnRoutes.includes(to.path) && authStore.isAdmin) ||
    (userOwnRoutes.includes(to.path) && !authStore.isUser) ||
    (userOwnRoutes.includes(to.path) && authStore.isUser && to.query.id !== authStore.loggedInUser?.id)
  ) {
    next({ path: '/' })
  } else if (loggedInRoutes.includes(to.path) && !authStore.isLoggedIn) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
