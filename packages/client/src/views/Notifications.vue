<script setup lang="ts">
import NotificationList from '../components/notifications/NotificationsList.vue'

defineProps({
  agent: Object,
})
</script>

<template>
  <NotificationList v-if="agent" :agent="agent" />
</template>
