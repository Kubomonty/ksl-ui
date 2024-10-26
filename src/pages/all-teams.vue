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
            <v-spacer />
            {{ team.teamEmail }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p v-for="player in team.players" :key="player.id">
              {{ player.name }}
            </p>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useTeamStore } from '../stores'

  const teamStore = useTeamStore()
  const { fetchTeams } = teamStore
  const { teams } = storeToRefs(teamStore)

  onMounted(() => {
    fetchTeams()
  })
</script>
