<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Matches</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Location and Date</th>
                  <th>Home Team</th>
                  <th>Guest Team</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="match in matches" :key="match.matchId">
                  <td>{{ match.matchLocation }} - {{ formatDateTime(match.matchDateTime.toISOString()) }}</td>
                  <td>{{ match.homeTeam }}</td>
                  <td>{{ match.guestTeam }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { format } from 'date-fns'
  import { useMatchStore } from '../stores'
  import { storeToRefs } from 'pinia'

  const matchStore = useMatchStore()
  const { matches } = storeToRefs(matchStore)

  const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), 'dd.MM.yyyy-HH:mm')
  }

  onMounted(() => {
    // matchStore.fetchMatches()
  })
</script>
