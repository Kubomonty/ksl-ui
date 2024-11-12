<template>
  <v-container>
    <span v-if="loading">
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="heading" />
    </span>
    <v-row v-else>
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ $t('matches') }}</v-card-title>
          <v-card-text>
            <span v-if="paginatedMatches.length">
              <v-table v-if="paginatedMatches.length">
                <thead>
                  <tr>
                    <th>Location and Date</th>
                    <th>Home Team</th>
                    <th>Guest Team</th>
                    <th width="5%" />
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="match in paginatedMatches" :key="match.id">
                    <td>{{ match.matchLocation }} - {{ formatDateTime(match.matchDate.toISOString()) }}</td>
                    <td>{{ getTeamById(match.homeTeam)?.teamName }}</td>
                    <td>{{ getTeamById(match.guestTeam)?.teamName }}</td>
                    <td>
                      <v-btn
                        color="primary"
                        size="x-small"
                        variant="flat"
                        @click="handleMatchClick(match)"
                      >
                        detail
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <v-pagination
                v-if="pageCount > 1"
                v-model:page="currentPage"
                :length="pageCount"
                :total-visible="5"
              />
            </span>
            <p v-else>{{ $t('no-matches-found') }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router'
  import { useMatchStore, useTeamStore } from '../stores'
  import { MatchDto } from '@/models'
  import { format } from 'date-fns'
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'

  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)

  const matchStore = useMatchStore()
  const { matches } = storeToRefs(matchStore)
  const { fetchMatchesPage } = matchStore
  const teamStore = useTeamStore()
  const { fetchTeams, getTeamById } = teamStore

  const itemsPerPage = 10
  const currentPage = ref(1)

  const paginatedMatches = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return matches.value.slice(start, end)
  })

  const pageCount = computed(() => {
    return Math.ceil(matches.value.length / itemsPerPage)
  })

  const handleMatchClick = (match: MatchDto) => {
    const path = `/match-detail?id=${match.id}`
    const query = { id: match.id }
    router.push({ path, query })
  }

  const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), 'dd.MM.yyyy-HH:mm')
  }

  onMounted(async () => {
    loading.value = true
    await Promise.all([
      fetchTeams(),
      fetchMatchesPage(itemsPerPage, currentPage.value),
    ])
    loading.value = false
  })

  watch(async () => route, async () => {
    console.log('route changed', route)
    loading.value = true
    await Promise.all([
      fetchTeams(),
      fetchMatchesPage(itemsPerPage, currentPage.value),
    ])
    loading.value = false
  }, { deep: true })
  watch(currentPage, () => {
    fetchMatchesPage(itemsPerPage, currentPage.value)
  })
</script>
