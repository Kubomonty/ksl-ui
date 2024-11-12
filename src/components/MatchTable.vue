<template>
  <v-table density="compact">
    <thead>
      <tr>
        <th>{{ $t('home-team') }}</th>
        <th>{{ $t('guest-team') }}</th>
        <th v-if="!editType">{{ $t('match-state') }}</th>
        <th>{{ $t('legs') }}</th>
        <th width="8%" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(match, index) in currentMatch" :key="index">
        <td>
          <strong>{{ `H${match.home}` }}</strong> - {{ getHomePlayer(match.home)?.player?.name || '-' }}
        </td>
        <td>
          <strong>{{ `G${match.guest}` }}</strong> - {{ getGuestPlayer(match.guest)?.player?.name || '-' }}
        </td>
        <td v-if="!editType">{{ matchState[`game${index + 1}` as keyof typeof matchState].home }} : {{ matchState[`game${index + 1}` as keyof typeof matchState].guest }}</td>
        <td>
          <div class="d-flex">
            <div class="my-2" style="background-color: #f5f5f5; border-radius: 5px;">
              <v-select
                v-model="hLegs[index]"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="legItems"
                :readonly="!isLoggedIn"
                style="width: 52px;"
                variant="plain"
              />
            </div>
            &nbsp;
            <div style="margin-top: auto; margin-bottom: auto;"><strong>&colon;</strong></div>
            &nbsp;
            <div class="my-2" style="background-color: #f5f5f5; border-radius: 5px;">
              <v-select
                v-model="gLegs[index]"
                class="pl-2 pb-2"
                density="compact"
                hide-details
                :items="legItems"
                :readonly="!isLoggedIn"
                style="width: 52px;"
                variant="plain"
              />
            </div>
          </div>
        </td>
        <td>{{ $t(match.type) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
  import { defineEmits, defineProps, type PropType } from 'vue'
  import { EditMatchType } from '../enums'
  import { matchOpponentsStructure } from '../constants'
  import { PlayerDto } from '../models'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '../stores'

  const props = defineProps({
    editType: {
      required: false,
      default: undefined,
      type: String as PropType<EditMatchType | undefined>,
    },
    guestPlayers: {
      required: true,
      type: Array as PropType<{ player: PlayerDto | null | undefined; position: string }[]>,
    },
    homePlayers: {
      required: true,
      type: Array as PropType<{ player: PlayerDto | null | undefined; position: string }[]>,
    },
    matchState: {
      required: true,
      type: Object as PropType< {
        game1: { guest: number, home: number },
        game2: { guest: number, home: number },
        game3: { guest: number, home: number },
        game4: { guest: number, home: number },
      }>,
    },
    matchLegs: {
      required: true,
      type: Object as PropType<{
        game1: { guest: number, home: number }
        game2: { guest: number, home: number }
        game3: { guest: number, home: number }
        game4: { guest: number, home: number }
      }>,
    },
    qtr: {
      required: true,
      type: Number,
    },
  })
  const emits = defineEmits(['update:match-legs-home', 'update:match-legs-guest'])

  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  const legItems: Ref<number[]> = ref([0, 1, 2])

  const currentMatch = matchOpponentsStructure[props.qtr - 1]
  const getHomePlayer = (position: number) => props.homePlayers.find(player => player.position === `H${position}`)
  const getGuestPlayer = (position: number) => props.guestPlayers.find(player => player.position === `G${position}`)

  const hLegs = ref([props.matchLegs.game1.home, props.matchLegs.game2.home, props.matchLegs.game3.home, props.matchLegs.game4.home])
  const gLegs = ref([props.matchLegs.game1.guest, props.matchLegs.game2.guest, props.matchLegs.game3.guest, props.matchLegs.game4.guest])

  watch(hLegs, () => {
    emits('update:match-legs-home', { values: hLegs.value, qtr: props.qtr })
  }, { deep: true })
  watch(gLegs, () => {
    emits('update:match-legs-guest', { values: gLegs.value, qtr: props.qtr })
  }, { deep: true })
</script>
