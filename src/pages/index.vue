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
          <v-card-title class="d-flex">
            <span>
              {{ $t('matches') }}
            </span>
            <v-spacer />
          </v-card-title>
          <v-card-text>
            <span v-if="matches.length">
              <v-table v-if="matches.length">
                <thead>
                  <tr>
                    <th>{{ $t('location-and-date') }}</th>
                    <th>{{ $t('home-team') }}</th>
                    <th>{{ $t('guest-team') }}</th>
                    <th>{{ $t('score') }}</th>
                    <th>{{ $t('status') }}</th>
                    <th width="5%" />
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="match in matches" :key="match.id">
                    <td>{{ match.matchLocation }}&nbsp;&ndash;&nbsp;{{ formatDateTime(match.matchDate.toISOString()) }}</td>
                    <td>{{ getTeamById(match.homeTeam)?.teamName }}</td>
                    <td>{{ getTeamById(match.guestTeam)?.teamName }}</td>
                    <td v-if="showScore(match)">{{ match.homeScore }}&nbsp;&colon;&nbsp;{{ match.guestScore }}</td>
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
      </v-col>
    </v-row>
  </v-container>
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

  const showScore = (match: MatchDto): boolean => {
    return [MatchStatus.NEW, MatchStatus.IN_PROGRESS, MatchStatus.FINISHED].includes(match.status as MatchStatus)
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
      fetchMatchesPage(ITEMS_PER_PAGE, currentPage.value),
    ])
    loading.value = false
  }

  onMounted(async () => {
    getMatchList()
  })
  watch(async () => route, async () => {
    getMatchList()
  }, { deep: true })
  watch(currentPage, () => {
    getMatchList()
  })
</script>
