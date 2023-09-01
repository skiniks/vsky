<script setup lang="ts">
import { useSessionStore } from '@/stores/session'

const isLoggedIn = ref(false)
const isLoading = ref(true)
const sessionStore = useSessionStore()

onMounted(() => {
  const storedSession = localStorage.getItem('session')
  if (storedSession && storedSession !== 'undefined') {
    try {
      sessionStore.setSession(JSON.parse(storedSession))
      isLoggedIn.value = true
    }
    catch (e) {
      console.error('Error parsing stored session:', e)
    }
  }
  isLoading.value = false
})

function onLoginSuccess() {
  isLoggedIn.value = true
}
</script>

<template>
  <div class="max-w-xl m-auto">
    <div v-if="isLoading">
      <div class="flex items-center justify-center h-screen">
        <Loading />
      </div>
    </div>
    <Login v-else-if="!isLoggedIn" @login-success="onLoginSuccess" />
    <Timeline v-else />
  </div>
</template>
