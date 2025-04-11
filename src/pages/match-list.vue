<template>
  <v-card flat>
    <v-card-title class="d-flex">
      <span>
        {{ $t('matches') }}
      </span>
      <v-spacer />
    </v-card-title>
    <v-card-text>
      <span v-if="loading">
        <v-select
          v-model="filter"
          chips
          class="mb-n3 mt-5"
          clearable
          :items="filterItems"
          :label="$t('filter-by-status')"
          max-width="max-content"
          min-width="200px"
          multiple
        />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="heading" />
      </span>
      <span v-else-if="matches.length">
        <v-select
          v-model="filter"
          chips
          class="mb-n3 mt-5"
          clearable
          :items="filterItems"
          :label="$t('filter-by-status')"
          max-width="max-content"
          min-width="200px"
          multiple
        />
        <v-table v-if="matches.length">
          <thead>
            <tr>
              <th width="5%" />
              <th>{{ $t('home-team') }}</th>
              <th>{{ $t('guest-team') }}</th>
              <th>{{ $t('score') }}</th>
              <th>{{ $t('status') }}</th>
              <th>{{ $t('location-and-date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="match in matches" :key="match.id">
              <td>
                <v-btn
                  v-if="match.status !== MatchStatus.CANCELED"
                  color="primary"
                  size="x-small"
                  variant="flat"
                  @click="handleMatchClick(match)"
                >
                  detail
                </v-btn>
              </td>
              <td>{{ getTeamById(match.homeTeam)?.teamName }}</td>
              <td>{{ getTeamById(match.guestTeam)?.teamName }}</td>
              <td v-if="showScore(match)">
                {{ +match.homeScore + scoreInOvertime(match).home }}&nbsp;&colon;&nbsp;{{ +match.guestScore + scoreInOvertime(match).guest }}
              </td>
              <td v-else>&ndash;&nbsp;&colon;&nbsp;&ndash;</td>
              <td>
                <v-chip
                  border
                  class="justify-center"
                  :color="getStatusLabel(match.status as MatchStatus).color"
                  density="compact"
                  label
                  rounded
                  size="small"
                  :title="getStatusLabel(match.status as MatchStatus).label"
                  variant="tonal"
                >
                  {{ getStatusLabel(match.status as MatchStatus).label }}
                </v-chip>
              </td>
              <td>{{ match.matchLocation }}&nbsp;&ndash;&nbsp;{{ formatDateTime(match.matchDate.toISOString()) }}</td>
            </tr>
          </tbody>
        </v-table>
        <v-pagination
          v-if="matchPages > 1"
          v-model="currentPage"
          :length="matchPages"
          :total-visible="5"
        />
      </span>
      <p v-else>{{ $t('no-matches-found') }}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router'
  import { useMatchStore, useTeamStore } from '../stores'
  import { ITEMS_PER_PAGE } from '../constants'
  import { MatchDto } from '../models'
  import { MatchStatus } from '../enums'
  import { format } from 'date-fns'
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'

  const route = useRoute()
  const router = useRouter()
  const i18n = useI18n()

  const loading = ref(false)

  const matchStore = useMatchStore()
  const { matches, matchPages } = storeToRefs(matchStore)
  const { fetchMatchesPage } = matchStore
  const teamStore = useTeamStore()
  const { fetchTeams, getTeamById } = teamStore

  const currentPage = ref(1)

  const filterItems = [
    { title: i18n.t('finished'), value: MatchStatus.FINISHED },
    { title: i18n.t('in-progress'), value: MatchStatus.IN_PROGRESS },
    { title: i18n.t('new'), value: MatchStatus.NEW },
    { title: i18n.t('canceled'), value: MatchStatus.CANCELED },
  ]
  const filter = ref([])

  const showScore = (match: MatchDto): boolean => {
    return [MatchStatus.NEW, MatchStatus.IN_PROGRESS, MatchStatus.FINISHED].includes(match.status as MatchStatus)
  }

  const scoreInOvertime = (match: MatchDto): { home: number, guest: number } => {
    const score = {
      home: 0,
      guest: 0,
    }
    if (+(match.homeScoreOvertime || 0) === 2) {
      score.home = 1
    } else if (+(match.guestScoreOvertime || 0) === 2) {
      score.guest = 1
    }

    return score
  }

  const handleMatchClick = (match: MatchDto) => {
    const path = `/match-detail?id=${match.id}`
    const query = { id: match.id }
    router.push({ path, query })
  }

  const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), 'dd.MM.yyyy, HH:mm')
  }

  const getStatusLabel = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.NEW:
        return {
          color: 'primary',
          label: i18n.t('new'),
        }
      case MatchStatus.IN_PROGRESS:
        return {
          color: 'warning',
          label: i18n.t('in-progress'),
        }
      case MatchStatus.FINISHED:
        return {
          color: 'success',
          label: i18n.t('finished'),
        }
      case MatchStatus.CANCELED:
        return {
          color: 'grey',
          label: i18n.t('canceled'),
        }
      default:
        return {
          color: 'primary',
          label: i18n.t('new'),
        }
    }
  }

  const getMatchList = async () => {
    loading.value = true
    await Promise.all([
      fetchTeams(),
      fetchMatchesPage(ITEMS_PER_PAGE, currentPage.value, filter.value.length
        ? filter.value
        : [MatchStatus.CANCELED, MatchStatus.FINISHED, MatchStatus.IN_PROGRESS, MatchStatus.NEW]),
    ])
    loading.value = false
  }

  onMounted(async () => {
    getMatchList()
  })
  watch(filter, () => {
    getMatchList()
  }, { deep: true })
  watch(async () => route, async () => {
    getMatchList()
  }, { deep: true })
  watch(currentPage, () => {
    getMatchList()
  })
</script>
