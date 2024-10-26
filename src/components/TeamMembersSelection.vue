<template>
  <div class="ma-3">
    <v-row class="mb-1 mt-n2">
      <v-select
        ref="teamCaptainSelectRef"
        v-model="teamCaptainSelection"
        clearable
        density="compact"
        :disabled="disabled"
        item-title="name"
        item-value="id"
        :items="teamMembers"
        :label="$t('captain')"
        required
        :rules="[(sel : string) => !!sel || $t('captain-required')]"
        validate-on="input"
        variant="outlined"
      />
    </v-row>
    <v-row>
      <v-select
        ref="position1SelectRef"
        v-model="position1"
        clearable
        density="compact"
        :disabled="disabled"
        item-title="name"
        item-value="id"
        :items="teamMembers"
        :label="isHomeTeam ? 'D1' : 'H1'"
        required
        :rules="[(sel : string) => !!sel || i18n.t('player-required')]"
        validate-on="input"
        variant="outlined"
      />
    </v-row>
    <v-row>
      <v-select
        ref="position2SelectRef"
        v-model="position2"
        clearable
        density="compact"
        :disabled="disabled"
        item-title="name"
        item-value="id"
        :items="teamMembers"
        :label="isHomeTeam ? 'D2' : 'H2'"
        required
        :rules="[(sel : string) => !!sel || i18n.t('player-required')]"
        validate-on="input"
        variant="outlined"
      />
    </v-row>
    <v-row>
      <v-select
        ref="position3SelectRef"
        v-model="position3"
        clearable
        density="compact"
        :disabled="disabled"
        item-title="name"
        item-value="id"
        :items="teamMembers"
        :label="isHomeTeam ? 'D3' : 'H3'"
        required
        :rules="[(sel : string) => !!sel || i18n.t('player-required')]"
        validate-on="input"
        variant="outlined"
      />
    </v-row>
    <v-row>
      <v-select
        v-model="position4"
        clearable
        density="compact"
        :disabled="disabled"
        item-title="name"
        item-value="id"
        :items="teamMembers"
        :label="isHomeTeam ? 'D4' : 'H4'"
        validate-on="input"
        variant="outlined"
      />
    </v-row>
    <v-row>
      <v-select
        v-model="position5"
        clearable
        density="compact"
        :disabled="disabled"
        item-title="name"
        item-value="id"
        :items="teamMembers"
        :label="isHomeTeam ? 'D5' : 'H5'"
        validate-on="input"
        variant="outlined"
      />
    </v-row>
    <v-row>
      <v-select
        v-model="position6"
        clearable
        density="compact"
        :disabled="disabled"
        item-title="name"
        item-value="id"
        :items="teamMembers"
        :label="isHomeTeam ? 'D6' : 'H6'"
        validate-on="input"
        variant="outlined"
      />
    </v-row>
    <v-row>
      <v-select
        v-model="position7"
        clearable
        density="compact"
        :disabled="disabled"
        item-title="name"
        item-value="id"
        :items="teamMembers"
        :label="isHomeTeam ? 'D7' : 'H7'"
        validate-on="input"
        variant="outlined"
      />
    </v-row>
    <v-row>
      <v-select
        v-model="position8"
        clearable
        density="compact"
        :disabled="disabled"
        item-title="name"
        item-value="id"
        :items="teamMembers"
        :label="isHomeTeam ? 'D8' : 'H8'"
        validate-on="input"
        variant="outlined"
      />
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { type Ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  const i18n = useI18n()

  const props = defineProps({
    disabled: {
      default: false,
      required: false,
      type: Boolean,
    },
    isHomeTeam: {
      required: true,
      type: Boolean,
    },
    teamCaptain: {
      required: false,
      type: String,
    },
    teamMembersSelection: {
      required: true,
      type: Array as PropType<{ playerId: string | undefined, position: string }[]>,
    },
    teamMembers: {
      required: true,
      type: Array as PropType<{ id: string, name: string }[]>,
    },
  })

  const emits = defineEmits(['update:team-captain-select', 'update:team-select'])

  const teamCaptainSelectRef: Ref = ref()
  const position1SelectRef: Ref = ref()
  const position2SelectRef: Ref = ref()
  const position3SelectRef: Ref = ref()

  const teamCaptainSelection: Ref<string | undefined> = ref(props.teamCaptain)
  const position1: Ref<string | undefined> = ref(props.teamMembersSelection
    .find((member: { playerId: string | undefined, position: string}) => member.position === 'H1' || member.position === 'D1')!.playerId)
  const position2: Ref<string | undefined> = ref(props.teamMembersSelection
    .find((member: { playerId: string | undefined, position: string}) => member.position === 'H2' || member.position === 'D2')!.playerId)
  const position3: Ref<string | undefined> = ref(props.teamMembersSelection
    .find((member: { playerId: string | undefined, position: string}) => member.position === 'H3' || member.position === 'D3')!.playerId)
  const position4: Ref<string | undefined> = ref(props.teamMembersSelection
    .find((member: { playerId: string | undefined, position: string}) => member.position === 'H4' || member.position === 'D4')!.playerId)
  const position5: Ref<string | undefined> = ref(props.teamMembersSelection
    .find((member: { playerId: string | undefined, position: string}) => member.position === 'H5' || member.position === 'D5')!.playerId)
  const position6: Ref<string | undefined> = ref(props.teamMembersSelection
    .find((member: { playerId: string | undefined, position: string}) => member.position === 'H6' || member.position === 'D6')!.playerId)
  const position7: Ref<string | undefined> = ref(props.teamMembersSelection
    .find((member: { playerId: string | undefined, position: string}) => member.position === 'H7' || member.position === 'D7')!.playerId)
  const position8: Ref<string | undefined> = ref(props.teamMembersSelection
    .find((member: { playerId: string | undefined, position: string}) => member.position === 'H8' || member.position === 'D8')!.playerId)

  const reset = () => {
    teamCaptainSelection.value = undefined
    position1.value = undefined
    position2.value = undefined
    position3.value = undefined
    position4.value = undefined
    position5.value = undefined
    position6.value = undefined
    position7.value = undefined
    position8.value = undefined

    teamCaptainSelectRef.value?.reset()
    position1SelectRef.value?.reset()
    position2SelectRef.value?.reset()
    position3SelectRef.value?.reset()
  }

  defineExpose({ reset })

  watch(teamCaptainSelection, (newValue: string | unknown) => {
    emits('update:team-captain-select', newValue)
  })
  watch([
    position1, position2, position3, position4,
    position5, position6, position7, position8,
  ], () => {
    const newRoster: { playerId: string | undefined, position: string }[] = [
      { playerId: position1.value, position: props.isHomeTeam ? 'H1' : 'D1' },
      { playerId: position2.value, position: props.isHomeTeam ? 'H2' : 'D2' },
      { playerId: position3.value, position: props.isHomeTeam ? 'H3' : 'D3' },
      { playerId: position4.value, position: props.isHomeTeam ? 'H4' : 'D4' },
      { playerId: position5.value, position: props.isHomeTeam ? 'H5' : 'D5' },
      { playerId: position6.value, position: props.isHomeTeam ? 'H6' : 'D6' },
      { playerId: position7.value, position: props.isHomeTeam ? 'H7' : 'D7' },
      { playerId: position8.value, position: props.isHomeTeam ? 'H8' : 'D8' },
    ]
    emits('update:team-select', newRoster)
  })
</script>
