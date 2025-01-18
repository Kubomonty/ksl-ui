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
        <v-row class="mb-3 ml-3 mr-5">
          <v-col cols="3"><h3>{{ $t('team-name') }}</h3></v-col>
          <v-col><h3>B</h3></v-col>
          <v-col><h3>Z</h3></v-col>
          <v-col><h3>V:P</h3></v-col>
          <v-col><h3>V:P PP</h3></v-col>
        </v-row>
        <v-expansion-panels
          elevation="1"
          multiple
          tile
          variant="default"
        >
          <v-expansion-panel
            v-for="team in teamStandings"
            :key="team.teamId"
          >
            <v-expansion-panel-title>
              <v-row align="center">
                <v-col cols="3"><h4>{{ `${team.place}. ${team.teamName}` }}</h4></v-col>
                <v-col>{{ team.points }}</v-col>
                <v-col>{{ team.matchesPlayed }}</v-col>
                <v-col>{{ `${team.wins}:${team.losses} (${team.wins-team.losses})` }}</v-col>
                <v-col>{{ `${team.overTimeWins}:${team.overTimeLosses} (${team.overTimeWins-team.overTimeLosses})` }}</v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-divider class="mb-3 mt-n3" />
              <h4 style="display: inline;">H</h4> - {{ `${team.gamesWon}:${team.legsLost} (${team.gamesWon-team.gamesLost})` }}<br>
              <h4 style="display: inline;">L</h4> - {{ `${team.legsWon}:${team.legsLost} (${team.legsWon-team.legsLost})` }}<br>
              <span v-if="team.matches.length">
                <br>
                <p v-for="match in team.matches" :key="match.matchDate+match.homeTeam+match.guestTeam" class="mb-2">
                  {{ `${match.homeTeamName} vs. ${match.guestTeamName}, ${format(new Date(match.matchDate), 'dd.MM.yyyy')}, ${match.matchLocation} - ${matchScoreString(match.homeScore, match.homeOvertimeScore, match.guestScore, match.guestOvertimeScore)}` }}
                </p>
              </span>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </span>
    </v-card-text>
  </v-card>
  <v-card class="ma-3">
    <v-card-title>{{ $t('legend') }}</v-card-title>
    <v-card-text>
      {{ $t('legend-b') }}<br>
      {{ $t('legend-z') }}<br>
      {{ $t('legend-v-p') }}<br>
      {{ $t('legend-v-p-pp') }}<br>
      {{ $t('legend-h') }}<br>
      {{ $t('legend-l') }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { MatchDto } from '../models'
  import { format } from 'date-fns'
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { useTeamStore } from '../stores'

  const route = useRoute()

  const loading = ref(false)

  const teamStore = useTeamStore()
  const { fetchTeamStandings } = teamStore
  const { teamStandings } = storeToRefs(teamStore)

  const loadTeamStandingsData = async () => {
    loading.value = true
    await fetchTeamStandings()
    console.log(teamStandings)
    loading.value = false
  }

  const matchScoreString = (homeScore: number, homeOvertimeScore: number, guestScore: number, guestOvertimeScore: number): string => {
    const overtimeHomeScore = +(homeOvertimeScore || 0) === 2 ? 1 : 0
    const overtimeGuestScore = +(guestOvertimeScore || 0) === 2 ? 1 : 0
    return `${homeScore + overtimeHomeScore}:${guestScore + overtimeGuestScore}`
  }

  onMounted(async () => {
    loadTeamStandingsData()
  })
  watch(async () => route, async () => {
    loadTeamStandingsData()
  }, { deep: true })
</script>
