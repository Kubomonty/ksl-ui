<template>
  <v-card flat>
    <v-card-title class="my-3">{{ $t('seasons-administration') }}</v-card-title>
    <v-card-text>
      <span v-if="loading">
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
      </span>
      <span v-else>
        <span class="d-flex align-center">
          <v-text-field
            v-model="newSeasonName"
            density="compact"
            :hide-details="true"
            min-width="120px"
            variant="outlined"
          />
          <v-checkbox
            v-model="newSeasonIsActive"
            class="ml-3 my-auto"
            hide-details
            :label="$t('set-as-active')"
          />
          <v-btn
            class="ml-3"
            color="success"
            variant="flat"
            @click="handleNewSeasonClick"
          >{{ $t('add-season') }}</v-btn>
        </span>
        <v-divider class="my-5" />
        <h3>{{ $t('active-season') }}</h3>
        <p class="my-3">{{ activeSeason?.name || $t('no-active-season-found') }}</p>
        <v-divider class="my-5" />
        <h3>{{ $t('other-seasons') }}</h3>
        <span v-if="otherSeasons.length">
          <v-row
            v-for="season in otherSeasons"
            :key="season.id"
            class="d-flex align-center mt-5"
          >
            <p class="ml-3">{{ season.name }}</p>
            <v-btn
              class="ml-3"
              color="primary"
              size="small"
              variant="outlined"
              @click="handleSetActiveClick(season)"
            >{{ $t('set-as-active') }}</v-btn>
          </v-row>
        </span>
        <span v-else>
          <p>{{ $t('no-seasons-found') }}</p>
        </span>
      </span>
    </v-card-text>
    <v-dialog v-model="dialog" @keydown.enter="handleDialogConfirm">
      <v-card>
        <v-card-title>{{ $t('warning') }}</v-card-title>
        <v-card-subtitle>{{ $t('are-you-sure') }}</v-card-subtitle>
        <v-card-actions>
          <v-btn
            color="warning"
            variant="flat"
            @click="handleDialogCancel"
          >{{ $t('back') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleDialogConfirm"
          >{{ $t('ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
  import { SeasonDto } from '../models'
  import axios from 'axios'
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '../stores'

  const API_URL = import.meta.env.VITE_KSL_API_URL

  const authStore = useAuthStore()
  const { logoutTokenTimeOut } = authStore
  const { loggedInUser, token } = storeToRefs(authStore)

  const loading: Ref<boolean> = ref(false)
  const seasons: Ref<SeasonDto[]> = ref([])
  const newSeasonName: Ref<string> = ref('')
  const newSeasonIsActive: Ref<boolean> = ref(false)
  const dialog: Ref<boolean> = ref(false)
  const dialogType: Ref<'newSeason' | 'setActiveSeason' | null> = ref(null)
  const setActiveSeasonId: Ref<string | null> = ref(null)

  const handleNewSeasonClick = () => {
    dialogType.value = 'newSeason'
    dialog.value = true
  }

  const handleSetActiveClick = (season: SeasonDto) => {
    dialogType.value = 'setActiveSeason'
    setActiveSeasonId.value = season.id
    dialog.value = true
  }

  const activeSeason: ComputedRef<SeasonDto | undefined> = computed(() =>
    seasons.value.find((season: SeasonDto) => season.isActive)
  )
  const otherSeasons: ComputedRef<SeasonDto[]> = computed(() =>
    seasons.value.filter((season: SeasonDto) => !season.isActive)
  )

  const fetchSeasons = async () => {
    loading.value = true
    try {
      const response = await axios.get(`${API_URL}/api/seasons`, {
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      })
      seasons.value = response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
        logoutTokenTimeOut()
      }
      console.error('Error fetching teams:', error)
    }
    loading.value = false
    newSeasonName.value = ''
    newSeasonIsActive.value = false
    dialog.value = false
    dialogType.value = null
    setActiveSeasonId.value = null
  }

  const handleDialogCancel = () => {
    dialog.value = false
    dialogType.value = null
    setActiveSeasonId.value = null
  }
  const handleDialogConfirm = async () => {
    if (dialogType.value === 'newSeason') {
      await createNewSeasonRequest()
    } else if (dialogType.value === 'setActiveSeason') {
      await setActiveSeasonRequest()
    }
    handleDialogCancel()
  }

  const createNewSeasonRequest = async () => {
    if (!loggedInUser?.value?.id) {
      logoutTokenTimeOut()
      return
    }
    try {
      await axios.post(`${API_URL}/api/seasons`, {
        createdBy: loggedInUser.value?.id,
        isActive: newSeasonIsActive.value,
        name: newSeasonName.value,
      }, {
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      })
      await fetchSeasons()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
        logoutTokenTimeOut()
      }
      console.error('Error creating new season:', error)
    }
  }

  const setActiveSeasonRequest = async () => {
    if (!loggedInUser?.value?.id) {
      logoutTokenTimeOut()
      return
    }
    try {
      await axios.put(`${API_URL}/api/seasons/${setActiveSeasonId.value}`, {
        id: setActiveSeasonId.value,
      }, {
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      })
      await fetchSeasons()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
        logoutTokenTimeOut()
      }
      console.error('Error creating new season:', error)
    }
  }

  onMounted(async () => {
    loading.value = true
    await fetchSeasons()
    loading.value = false
  })
</script>
