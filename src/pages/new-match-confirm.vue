<template>
  <v-card v-if="hasData" border flat>
    <v-container>
      <v-card-title>{{ `${ homeTeam!.teamName} vs. ${guestTeam!.teamName}` }}</v-card-title>
      <v-card-subtitle>{{ `${newMatch.matchLocation} - ${formattedMatchDateTime}` }}</v-card-subtitle>
      <v-card-text>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('home-team') }}
              </th>
              <th class="text-left">
                {{ homeTeam!.teamName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ $t('captain') }}</td>
              <td>{{ homeTeamCaptain?.name || '-' }}</td>
            </tr>
            <tr v-for="(player, index) in orderedHomeTeamPlayers" :key="index">
              <td>{{ player.position.replace('H', 'D') }}</td>
              <td>{{ player.player?.name || '-' }}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th class="text-left">
                {{ $t('guest-team') }}
              </th>
              <th class="text-left">
                {{ guestTeam!.teamName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ $t('captain') }}</td>
              <td>{{ guestTeamCaptain?.name || '-' }}</td>
            </tr>
            <tr v-for="(player, index) in orderedGuestTeamPlayers" :key="index">
              <td>{{ player.position.replace('G', 'H') }}</td>
              <td>{{ player.player?.name || '-' }}</td>
            </tr>
          </tbody>
        </v-table>
        <br>
        <h4>{{ `${$t('game-qt')} 1` }}</h4>
        <v-table density="compact">
          <thead>
            <tr>
              <th>{{ $t('home-team') }}</th>
              <th>{{ $t('guest-team') }}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>D1</strong> - {{ orderedHomeTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>
                <strong>H4</strong> - {{ orderedGuestTeamPlayers[3]?.player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D2</strong> - {{ orderedHomeTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>
                <strong>H3</strong> - {{ orderedGuestTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D3</strong> - {{ orderedHomeTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>
                <strong>H2</strong> - {{ orderedGuestTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D4</strong> - {{ orderedHomeTeamPlayers[3]?.player?.name || '-' }}
              </td>
              <td>
                <strong>H1</strong> - {{ orderedGuestTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>{{ $t('cricket') }}</td>
            </tr>
          </tbody>
        </v-table>
        <br>
        <h4>{{ `${$t('game-qt')} 2` }}</h4>
        <v-table density="compact">
          <thead>
            <tr>
              <th>{{ $t('home-team') }}</th>
              <th>{{ $t('guest-team') }}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>D1</strong> - {{ orderedHomeTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>
                <strong>H3</strong> - {{ orderedGuestTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D2</strong> - {{ orderedHomeTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>
                <strong>H4</strong> - {{ orderedGuestTeamPlayers[3]?.player?.name || '-' }}
              </td>
              <td>{{ $t('cricket') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D3</strong> - {{ orderedHomeTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>
                <strong>H1</strong> - {{ orderedGuestTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D4</strong> - {{ orderedHomeTeamPlayers[3]?.player?.name || '-' }}
              </td>
              <td>
                <strong>H2</strong> - {{ orderedGuestTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
          </tbody>
        </v-table>
        <br>
        <h4>{{ `${$t('game-qt')} 3` }}</h4>
        <v-table density="compact">
          <thead>
            <tr>
              <th>{{ $t('home-team') }}</th>
              <th>{{ $t('guest-team') }}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>D4</strong> - {{ orderedHomeTeamPlayers[3]?.player?.name || '-' }}
              </td>
              <td>
                <strong>H3</strong> - {{ orderedGuestTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D3</strong> - {{ orderedHomeTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>
                <strong>H4</strong> - {{ orderedGuestTeamPlayers[3]?.player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D2</strong> - {{ orderedHomeTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>
                <strong>H1</strong> - {{ orderedGuestTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D1</strong> - {{ orderedHomeTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>
                <strong>H2</strong> - {{ orderedGuestTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>{{ $t('cricket') }}</td>
            </tr>
          </tbody>
        </v-table>
        <br>
        <h4>{{ `${$t('game-qt')} 4` }}</h4>
        <v-table density="compact">
          <thead>
            <tr>
              <th>{{ $t('home-team') }}</th>
              <th>{{ $t('guest-team') }}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>D4</strong> - {{ orderedHomeTeamPlayers[3]?.player?.name || '-' }}
              </td>
              <td>
                <strong>H4</strong> - {{ orderedGuestTeamPlayers[3]?.player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D3</strong> - {{ orderedHomeTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>
                <strong>H3</strong> - {{ orderedGuestTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>{{ $t('cricket') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D2</strong> - {{ orderedHomeTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>
                <strong>H2</strong> - {{ orderedGuestTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>D1</strong> - {{ orderedHomeTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>
                <strong>H1</strong> - {{ orderedGuestTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-tooltip location="top">
          <template #activator="{ props }">
            <v-btn
              color="warning"
              variant="flat"
              v-bind="props"
              @click="handleReturn"
            >{{ $t('back') }}</v-btn>
          </template>
          <span>{{ $t('back-to-previous-step') }}</span>
        </v-tooltip>
        <v-btn
          color="primary"
          variant="flat"
          @click="dialog = true"
        >{{ $t('create-match') }}</v-btn>
      </v-card-actions>
    </v-container>
    <v-dialog v-model="dialog" @keydown.enter="handleMatchCreation">
      <v-card>
        <v-card-title>{{ $t('consent') }}</v-card-title>
        <v-card-text>
          <p>{{ $t('confirm-new-match') }}</p>
          <v-checkbox
            v-model="confirmHomeCaptain"
            class="mt-5 mb-n3"
            density="compact"
            :label="$t('confirm-new-match-home-captain')"
          />
          <v-checkbox
            v-model="confirmGuestCaptain"
            class="my-n3"
            density="compact"
            :label="$t('confirm-new-match-guest-captain')"
          />
        </v-card-text>
        <v-card-actions class="mb-3 mr-3">
          <v-btn
            color="warning"
            variant="flat"
            @click="dialog = false"
          >{{ $t('cancel') }}</v-btn>
          <v-btn
            color="primary"
            :disabled="!confirmHomeCaptain || !confirmGuestCaptain"
            variant="flat"
            @click="handleMatchCreation"
          >{{ $t('ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
  import { PlayerDto, TeamDto } from '../models'
  import { useMatchStore, useTeamStore } from '../stores'
  import { computed } from 'vue'
  import { format } from 'date-fns'
  import { storeToRefs } from 'pinia'

  const router = useRouter()

  const matchStore = useMatchStore()
  const { newMatch } = storeToRefs(matchStore)
  const { createMatch } = matchStore

  const teamStore = useTeamStore()
  const { getTeamById } = teamStore

  const dialog: Ref<boolean> = ref(false)
  const confirmGuestCaptain: Ref<boolean> = ref(false)
  const confirmHomeCaptain: Ref<boolean> = ref(false)

  const getPlayer = (team: TeamDto | undefined | null, playerId: string | undefined): PlayerDto | null => {
    if (!team || !playerId) {
      return null
    }

    return team.players.find(player => player.id === playerId) || null
  }

  const homeTeam: ComputedRef<TeamDto | null | undefined> = computed((): TeamDto | null | undefined => {
    return newMatch.value.homeTeam ? getTeamById(newMatch.value.homeTeam) : null
  })
  const homeTeamCaptain: ComputedRef<PlayerDto | null> = computed((): PlayerDto | null => {
    return getPlayer(homeTeam.value, newMatch.value.homeCaptain)
  })
  const homeTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(
    (): { player: PlayerDto | null | undefined, position: string }[] => {
      const homePlayers: { player: PlayerDto | null | undefined, position: string }[] = [
        {
          player: getPlayer(homeTeam.value, newMatch.value.homePos1),
          position: 'H1',
        },
        {
          player: getPlayer(homeTeam.value, newMatch.value.homePos2),
          position: 'H2',
        },
        {
          player: getPlayer(homeTeam.value, newMatch.value.homePos3),
          position: 'H3',
        },
      ]
      if (newMatch.value.homePos4?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, newMatch.value.homePos4),
          position: 'H4',
        })
      }
      if (newMatch.value.homePos5?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, newMatch.value.homePos5),
          position: 'H5',
        })
      }
      if (newMatch.value.homePos6?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, newMatch.value.homePos6),
          position: 'H6',
        })
      }
      if (newMatch.value.homePos7?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, newMatch.value.homePos7),
          position: 'H7',
        })
      }
      if (newMatch.value.homePos8?.trim()) {
        homePlayers.push({
          player: getPlayer(homeTeam.value, newMatch.value.homePos8),
          position: 'H8',
        })
      }
      return homePlayers
    }
  )
  const orderedHomeTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(() => {
    return homeTeamPlayers.value.slice().sort((a, b) => a.position.localeCompare(b.position))
  })

  const guestTeam: ComputedRef<TeamDto | null | undefined> = computed((): TeamDto | null | undefined => {
    return newMatch.value.guestTeam ? getTeamById(newMatch.value.guestTeam) : null
  })
  const guestTeamCaptain: ComputedRef<PlayerDto | null> = computed((): PlayerDto | null => {
    return getPlayer(guestTeam.value, newMatch.value.guestCaptain)
  })
  const guestTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(
    (): { player: PlayerDto | null | undefined, position: string }[] => {
      const guestPlayers: { player: PlayerDto | null | undefined, position: string }[] = [
        {
          player: getPlayer(guestTeam.value, newMatch.value.guestPos1),
          position: 'G1',
        },
        {
          player: getPlayer(guestTeam.value, newMatch.value.guestPos2),
          position: 'G2',
        },
        {
          player: getPlayer(guestTeam.value, newMatch.value.guestPos3),
          position: 'G3',
        },
      ]
      if (newMatch.value.guestPos4?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, newMatch.value.guestPos4),
          position: 'G4',
        })
      }
      if (newMatch.value.guestPos5?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, newMatch.value.guestPos5),
          position: 'G5',
        })
      }
      if (newMatch.value.guestPos6?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, newMatch.value.guestPos6),
          position: 'G6',
        })
      }
      if (newMatch.value.guestPos7?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, newMatch.value.guestPos7),
          position: 'G7',
        })
      }
      if (newMatch.value.guestPos8?.trim()) {
        guestPlayers.push({
          player: getPlayer(guestTeam.value, newMatch.value.guestPos8),
          position: 'G8',
        })
      }
      return guestPlayers
    }
  )
  const orderedGuestTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(() => {
    return guestTeamPlayers.value.slice().sort((a, b) => a.position.localeCompare(b.position))
  })

  const formattedMatchDateTime: ComputedRef<string> = computed((): string => {
    return newMatch.value.matchDate ? format(new Date(newMatch.value.matchDate), 'dd.MM.yyyy, HH:mm') : '-'
  })

  const handleReturn = (): void => {
    router.push('/new-match')
  }
  const handleMatchCreation = async (): Promise<void> => {
    if (!confirmGuestCaptain.value || !confirmHomeCaptain.value) {
      return
    }
    const newMatch = await createMatch()
    router.push(`/match-detail?id=${newMatch.matchId}`)
  }

  const hasData = computed(() => {
    return !!newMatch.value && !!homeTeam.value && !!guestTeam.value
  })

  onMounted(() => {
    if (!hasData.value) {
      handleReturn()
    }
  })
</script>
