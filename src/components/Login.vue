<script setup lang="ts">
const emit = defineEmits(['loginSuccess'])
const nuxtApp = useNuxtApp()
const bskyAgent = nuxtApp.$bskyAgent

const identifier = ref('')
const password = ref('')

async function login() {
  try {
    const result = await bskyAgent.login({ identifier: identifier.value, password: password.value })
    // eslint-disable-next-line no-console
    console.log(result)
    // eslint-disable-next-line no-console
    console.log('Login successful')
    emit('loginSuccess') // Emitting the success event
  }
  catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="max-w-md w-full space-y-8 px-8 py-10 bg-white rounded-3xl shadow-xl mx-auto box-border">
      <input v-model="identifier" placeholder="Email" class="mt-2 bg-gray-200 text-black input w-full box-border">
      <input v-model="password" type="password" placeholder="Password" class="mt-2 bg-gray-200 text-black input w-full box-border">
      <div class="flex justify-center">
        <button class="btn text-white border-transparent hover:border-transparent" @click="login">
          Login
        </button>
      </div>
    </div>
  </div>
</template>
