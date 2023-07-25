<script setup lang="ts">
const loggedIn = ref(false)
const loading = ref(true)

onMounted(() => {
  loggedIn.value = !!localStorage.getItem('sessionData')
  loading.value = false
})

function onLoginSuccess() {
  loggedIn.value = true
}
</script>

<template>
  <div id="app">
    <NuxtLayout>
      <div v-if="loading" class="flex items-center justify-center h-screen">
        <span class="loading loading-spinner loading-lg" />
      </div>
      <template v-else>
        <Login v-if="!loggedIn" @login-success="onLoginSuccess" />
        <NuxtPage v-else />
      </template>
    </NuxtLayout>
  </div>
</template>
