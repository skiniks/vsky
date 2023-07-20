<script setup lang="ts">
const authStore = useAuthStore()
const identifier = ref('')
const password = ref('')

async function handleSubmit() {
  try {
    await authStore.login('https://bsky.social', identifier.value, password.value)
  }
  catch (error: any) {
    console.error(error)
  }
}
</script>

<template>
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
            <span class="font-sans text-black text-sm">Your service (i.e. Bluesky Social) password</span>
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
          class="btn text-white border-transparent hover:border-transparent bg-blue-600 hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</template>
