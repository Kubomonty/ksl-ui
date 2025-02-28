<template>
  <v-card flat>
    <v-card-title class="my-3">{{ $t('admin-section') }}</v-card-title>
    <v-card-text>
      <v-btn
        class="admin-section-button my-3"
        color="primary"
        flat
        @click="addTeam"
      >{{ $t('add-team') }}</v-btn>
      <v-btn
        class="admin-section-button my-3"
        color="primary"
        flat
        @click="addAdmin"
      >{{ $t('add-admin') }}</v-btn>
      <v-btn
        class="admin-section-button my-3"
        color="primary"
        flat
        @click="seasonsAdministration"
      >{{ $t('seasons-administration') }}</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const addAdmin = () => {
    router.push('/new-admin')
  }
  const addTeam = () => {
    router.push('/new-team')
  }
  const seasonsAdministration = () => {
    router.push('/seasons-administration')
  }
</script>

<style scoped>
.admin-section-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
