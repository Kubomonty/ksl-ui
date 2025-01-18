<template>
  <v-card flat>
    <v-card-title class="my-3">{{ $t('team-list') }}</v-card-title>
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
        <v-expansion-panels
          flat
          multiple
          rounded="0"
          variant="accordion"
        >
          <v-expansion-panel
            v-for="team in teams"
            :key="team.id"
          >
            <v-expansion-panel-title color="blue-grey-lighten-5">
              <h4>{{ team.teamName }}</h4>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p v-for="player in team.players" :key="player.id">
                {{ player.name }}
              </p>
              <v-btn
                v-if="displayManageButton(team.id)"
                class="mt-2"
                color="primary"
                size="small"
                variant="tonal"
                @click.prevent="() => $router.push(`/team-administration?id=${team.id}`)"
              >{{ $t('manage-team') }}</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore, useTeamStore } from '../stores'

  const loading: Ref<boolean> = ref(false)

  const teamStore = useTeamStore()
  const { fetchActiveTeams: fetchTeams } = teamStore
  const { teams } = storeToRefs(teamStore)

  const authStore = useAuthStore()
  const { isAdmin, isUser, loggedInUser } = storeToRefs(authStore)

  const displayManageButton = (teamId: string): Boolean => {
    if (isAdmin.value) return true
    if (isUser.value && loggedInUser?.value?.id === teamId) return true
    return false
  }

  onMounted(async () => {
    loading.value = true
    await fetchTeams()
    loading.value = false
  })
</script>
