<script setup lang="ts">
import { BskyAgent } from '@atproto/api'

const authStore = useAuthStore()

const agent = new BskyAgent({
  service: 'https://bsky.social',
  persistSession: (_evt, sess) => {
    if (sess)
      authStore.setSession(sess)
  },
})

function isJwtExpired(jwt: string): boolean {
  const [, payload] = jwt.split('.')
  const { exp } = JSON.parse(atob(payload))
  return Date.now() >= exp * 1000
}

const initializing = ref(true)

onMounted(async () => {
  await refreshTokenIfNeeded()
  initializing.value = false
})

async function refreshTokenIfNeeded() {
  const session = authStore.session
  if (!session)
    return

  const { accessJwt, refreshJwt } = session
  const isAccessTokenExpired = isJwtExpired(accessJwt)

  if (isAccessTokenExpired) {
    try {
      await agent.resumeSession({ ...session, refreshJwt })
    }
    catch (error) {
      console.error('Failed to refresh token:', error)
    }
  }
}

function isLoggedIn(): boolean {
  return !!authStore.session && !!authStore.session.accessJwt
}
</script>

<template>
  <Loading v-if="initializing" />
  <div v-else>
    <div v-if="!isLoggedIn()" class="h-screen flex items-center justify-center">
      <Login />
    </div>
    <router-view v-else :agent="agent" />
    <BottomNav v-if="isLoggedIn()" />
  </div>
</template>

<style>
:root, html.dark {
  @apply bg-dark;
}

a {
  @apply text-blue-600;
}

a:hover {
  @apply text-blue-700;
}
</style>
