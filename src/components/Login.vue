<script setup lang="ts">
import * as AtprotoApi from '@atproto/api'
import type { AtpSessionData, AtpSessionEvent } from '@atproto/api'

const emit = defineEmits(['loginSuccess'])

const identifier = ref('')
const password = ref('')
const error = ref('')

async function handleSubmit() {
  try {
    const agent = new AtprotoApi.BskyAgent({
      service: 'https://bsky.social',
      persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
        // eslint-disable-next-line no-console
        console.log('Event:', evt, 'Session Data:', sess)
        if ((evt === 'create') && sess)
          localStorage.setItem('sessionData', JSON.stringify(sess))
      },
    })

    await agent.login({
      identifier: identifier.value,
      password: password.value,
    })

    emit('loginSuccess')
  }
  catch (err: any) {
    console.error(err)
    error.value = 'Failed to login. Please check your credentials.'
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="max-w-md w-full space-y-8 px-8 py-10 bg-white rounded-3xl shadow-xl mx-auto box-border">
      <form class="w-full" @submit.prevent="handleSubmit">
        <div class="mb-6">
          <div class="flex col items-center">
            <div class="i-tabler-id text-black text-3xl mr-2" />
            <div>
              <label class="block text-black text-xl font-sans font-bold" for="identifier">
                Identifier
              </label>
              <span class="font-sans text-black text-sm">Your email, username, or <a
                href="https://atproto.com/guides/identity" target="_blank" class="text-blue-600"
              >DID</a></span>
            </div>
          </div>
          <input
            id="identifier" v-model="identifier" name="identifier" type="text" required
            class="mt-2 bg-gray-200 text-black input w-full box-border"
          >
        </div>
        <div class="mb-6">
          <div class="flex col items-center">
            <div class="i-tabler-password text-black text-3xl mr-2" />
            <div>
              <label class="block text-black text-xl font-sans font-bold" for="password">
                Password
              </label>
              <span class="font-sans text-black text-sm">Your service password</span>
            </div>
          </div>
          <input
            id="password" v-model="password" name="password" type="password" required
            class="mt-2 bg-gray-200 text-black input w-full box-border"
          >
        </div>
        <div class="flex justify-center">
          <button
            aria-label="Login"
            type="submit"
            class="btn text-white border-transparent hover:border-transparent"
          >
            Login
          </button>
        </div>
        <p v-if="error" class="text-red-500 mt-3 text-center">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
button[type="submit"] {
    @apply bg-blue-600 hover:bg-blue-700;
}
</style>
