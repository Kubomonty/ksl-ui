<template>
  <v-card border flat>
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
              <td>{{ player.position }}</td>
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
              <td>{{ player.position }}</td>
              <td>{{ player.player?.name || '-' }}</td>
            </tr>
          </tbody>
        </v-table>
        <br>
        <h4>{{ `${$t('game-no')} 1` }}</h4>
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
                <strong>H1</strong> - {{ orderedHomeTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>
                <strong>G4</strong> - {{ orderedGuestTeamPlayers[3].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H2</strong> - {{ orderedHomeTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>
                <strong>G3</strong> - {{ orderedGuestTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H3</strong> - {{ orderedHomeTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>
                <strong>G2</strong> - {{ orderedGuestTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H4</strong> - {{ orderedHomeTeamPlayers[3].player?.name || '-' }}
              </td>
              <td>
                <strong>G1</strong> - {{ orderedGuestTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>{{ $t('cricket') }}</td>
            </tr>
          </tbody>
        </v-table>
        <br>
        <h4>{{ `${$t('game-no')} 2` }}</h4>
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
                <strong>H1</strong> - {{ orderedHomeTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>
                <strong>G3</strong> - {{ orderedGuestTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H2</strong> - {{ orderedHomeTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>
                <strong>G4</strong> - {{ orderedGuestTeamPlayers[3].player?.name || '-' }}
              </td>
              <td>{{ $t('cricket') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H3</strong> - {{ orderedHomeTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>
                <strong>G1</strong> - {{ orderedGuestTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H4</strong> - {{ orderedHomeTeamPlayers[3].player?.name || '-' }}
              </td>
              <td>
                <strong>G2</strong> - {{ orderedGuestTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
          </tbody>
        </v-table>
        <br>
        <h4>{{ `${$t('game-no')} 3` }}</h4>
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
                <strong>H4</strong> - {{ orderedHomeTeamPlayers[3].player?.name || '-' }}
              </td>
              <td>
                <strong>G3</strong> - {{ orderedGuestTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H3</strong> - {{ orderedHomeTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>
                <strong>G4</strong> - {{ orderedGuestTeamPlayers[3].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H2</strong> - {{ orderedHomeTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>
                <strong>G1</strong> - {{ orderedGuestTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H1</strong> - {{ orderedHomeTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>
                <strong>G2</strong> - {{ orderedGuestTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>{{ $t('cricket') }}</td>
            </tr>
          </tbody>
        </v-table>
        <br>
        <h4>{{ `${$t('game-no')} 4` }}</h4>
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
                <strong>H4</strong> - {{ orderedHomeTeamPlayers[3].player?.name || '-' }}
              </td>
              <td>
                <strong>G4</strong> - {{ orderedGuestTeamPlayers[3].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H3</strong> - {{ orderedHomeTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>
                <strong>G3</strong> - {{ orderedGuestTeamPlayers[2].player?.name || '-' }}
              </td>
              <td>{{ $t('cricket') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H2</strong> - {{ orderedHomeTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>
                <strong>G2</strong> - {{ orderedGuestTeamPlayers[1].player?.name || '-' }}
              </td>
              <td>{{ $t('501-do') }}</td>
            </tr>
            <tr>
              <td>
                <strong>H1</strong> - {{ orderedHomeTeamPlayers[0].player?.name || '-' }}
              </td>
              <td>
                <strong>G1</strong> - {{ orderedGuestTeamPlayers[0].player?.name || '-' }}
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
          <span>balbalaablab</span>
        </v-tooltip>
        <v-btn
          color="primary"
          variant="flat"
          @click="dialog = true"
        >{{ $t('create-match') }}</v-btn>
      </v-card-actions>
    </v-container>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-form @submit.prevent="handleMatchCreation">
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
              type="submit"
              variant="flat"
              @click="handleMatchCreation"
            >{{ $t('ok') }}</v-btn>
          </v-card-actions>
        </v-form>
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
    return getPlayer(homeTeam.value, newMatch.value.homeTeamCaptain)
  })
  const homeTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(
    (): { player: PlayerDto | null | undefined, position: string }[] => {
      return newMatch.value.homeTeamRoster.map((player: { playerId: string | undefined, position: string }) => {
        return {
          player: getPlayer(homeTeam.value, player.playerId),
          position: player.position,
        }
      })
    }
  )
  const orderedHomeTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(() => {
    return homeTeamPlayers.value.slice().sort((a, b) => a.position.localeCompare(b.position))
  })

  const guestTeam: ComputedRef<TeamDto | null | undefined> = computed((): TeamDto | null | undefined => {
    return newMatch.value.guestTeam ? getTeamById(newMatch.value.guestTeam) : null
  })
  const guestTeamCaptain: ComputedRef<PlayerDto | null> = computed((): PlayerDto | null => {
    return getPlayer(guestTeam.value, newMatch.value.guestTeamCaptain)
  })
  const guestTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(
    (): { player: PlayerDto | null | undefined, position: string }[] => {
      return newMatch.value.guestTeamRoster.map((player: { playerId: string | undefined, position: string }) => {
        return {
          player: getPlayer(guestTeam.value, player.playerId),
          position: player.position,
        }
      })
    }
  )
  const orderedGuestTeamPlayers: ComputedRef<{ player: PlayerDto | null | undefined, position: string }[]> = computed(() => {
    return guestTeamPlayers.value.slice().sort((a, b) => a.position.localeCompare(b.position))
  })

  const formattedMatchDateTime: ComputedRef<string> = computed((): string => {
    return newMatch.value.matchDateTime ? format(new Date(newMatch.value.matchDateTime), 'dd.MM.yyyy, HH:mm') : '-'
  })

  const handleReturn = (): void => {
    router.push('/new-match')
  }
  const handleMatchCreation = (): void => {
    if (!confirmHomeCaptain.value || !confirmGuestCaptain.value) {
      return
    }
    createMatch()
    router.push('/')
  }

  onMounted(() => {
    if (!newMatch.value || !newMatch.value.homeTeam || !newMatch.value.guestTeam) {
      handleReturn()
    }
  })
</script>
