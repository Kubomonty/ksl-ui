<template>
  <v-card flat>
    <v-card-title class="my-3">{{ $t('all-teams') }}</v-card-title>
    <v-card-text>
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
            <p class="ml-5">{{ team.teamEmail }}</p>
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
              @click.prevent="() => $router.push(`/team-section?id=${team.id}`)"
            >{{ $t('manage-team') }}</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore, useTeamStore } from '../stores'

  const teamStore = useTeamStore()
  const { fetchTeams } = teamStore
  const { teams } = storeToRefs(teamStore)

  const authStore = useAuthStore()
  const { isAdmin, isUser, loggedInUser } = storeToRefs(authStore)

  const displayManageButton = (teamId: string): Boolean => {
    if (isAdmin.value) return true
    if (isUser.value && loggedInUser?.value?.id === teamId) return true
    return false
  }

  onMounted(() => {
    fetchTeams()
  })
</script>
