<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const isLoggedIn = ref(false)
const router = useRouter()
const slug = ref<string | null>(null)
const userHandle = ref<string | null>(null)

onMounted(async () => {
  slug.value = router.currentRoute.value.params.slug as string
  router.beforeEach(handleRouteChange)

  const sessionData = localStorage.getItem('session')
  if (sessionData) {
    const parsedSession = JSON.parse(sessionData)
    userHandle.value = parsedSession.handle
    isLoggedIn.value = true // User is logged in since session data exists
  }
})

function handleRouteChange(to: RouteLocationNormalizedLoaded) {
  slug.value = to.params.slug as string
}
</script>

<template>
  <div v-if="isLoggedIn" class="btm-nav">
    <!-- Only render the nav if user is logged in -->
    <NuxtLink to="/">
      <button class="active">
        <div class="i-carbon-home w-10 h-10" />
      </button>
    </NuxtLink>
    <NuxtLink to="/notifications">
      <button>
        <div class="i-carbon-notification w-10 h-10" />
      </button>
    </NuxtLink>
    <NuxtLink :to="`/profile/${userHandle}`">
      <button>
        <div class="i-carbon-user-avatar w-10 h-10" />
      </button>
    </NuxtLink>
  </div>
</template>
