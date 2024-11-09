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
    pos1: {
      required: false,
      type: String,
    },
    pos2: {
      required: false,
      type: String,
    },
    pos3: {
      required: false,
      type: String,
    },
    pos4: {
      required: false,
      type: String,
    },
    pos5: {
      required: false,
      type: String,
    },
    pos6: {
      required: false,
      type: String,
    },
    pos7: {
      required: false,
      type: String,
    },
    pos8: {
      required: false,
      type: String,
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
  const position1: Ref<string | undefined> = ref(props.pos1)
  const position2: Ref<string | undefined> = ref(props.pos2)
  const position3: Ref<string | undefined> = ref(props.pos3)
  const position4: Ref<string | undefined> = ref(props.pos4)
  const position5: Ref<string | undefined> = ref(props.pos5)
  const position6: Ref<string | undefined> = ref(props.pos6)
  const position7: Ref<string | undefined> = ref(props.pos7)
  const position8: Ref<string | undefined> = ref(props.pos8)

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
    const newRoster = {
      position1: position1.value,
      position2: position2.value,
      position3: position3.value,
      position4: position4.value,
      position5: position5.value,
      position6: position6.value,
      position7: position7.value,
      position8: position8.value,
    }
    emits('update:team-select', newRoster)
  })
</script>
