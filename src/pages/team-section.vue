<template>
  <v-card flat>
    <v-text-field
      v-model="teamName"
      clearable
      density="compact"
      :label="$t('team-name')"
      required
      :rules="[(val : string) => !!val || $t('team-name-required')]"
      validate-on="input"
      variant="outlined"
    />
    <v-text-field
      v-model="teamEmail"
      clearable
      density="compact"
      :label="$t('team-email')"
      required
      :rules="[
        (val : string) => !!val || $t('team-email-required'),
        (val: string) => /.+@.+\..+/.test(val) || $t('team-email-invalid')
      ]"
      type="email"
      validate-on="input"
      variant="outlined"
    />
  </v-card>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router'
  import { TeamDto } from '../models'
  import { onMounted } from 'vue'
  import { useTeamStore } from '../stores'

  const route = useRoute()
  const router = useRouter()
  const teamStore = useTeamStore()
  const { fetchTeamById } = teamStore
  const team: Ref<TeamDto | null> = ref(null)

  const teamName: Ref<string> = ref('')
  const teamEmail: Ref<string> = ref('')

  watch(() => route.query.id, async () => {
    if (route.query.id) {
      team.value = await fetchTeamById(route.query.id as string)
      if (team.value) {
        teamName.value = team.value.teamName
        teamEmail.value = team.value.teamEmail
      }
    } else {
      router.push('/all-teams')
    }
  })

  onMounted(async () => {
    if (route.query.id) {
      team.value = await fetchTeamById(route.query.id as string)
      if (team.value) {
        teamName.value = team.value.teamName
        teamEmail.value = team.value.teamEmail
      }
    } else {
      router.push('/all-teams')
    }
  })
</script>
