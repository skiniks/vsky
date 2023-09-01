<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isLoggedIn = ref(false)
const userHandle = ref<string | null>(null)

onMounted(async () => {
  const sessionData = localStorage.getItem('session')
  if (sessionData) {
    const parsedSession = JSON.parse(sessionData)
    userHandle.value = parsedSession.handle
    isLoggedIn.value = true
  }
})
</script>

<template>
  <div v-if="isLoggedIn" class="btm-nav">
    <NuxtLink to="/">
      <button class="active">
        <div class="i-carbon-home w-10 h-10 text-white" />
      </button>
    </NuxtLink>
    <NuxtLink to="/notifications">
      <button>
        <div class="i-carbon-notification w-10 h-10 text-white" />
      </button>
    </NuxtLink>
    <NuxtLink :to="`/profile/${userHandle}`">
      <button>
        <div class="i-carbon-user-avatar w-10 h-10 text-white" />
      </button>
    </NuxtLink>
  </div>
</template>
