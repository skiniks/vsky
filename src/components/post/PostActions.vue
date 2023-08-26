<!-- eslint-disable no-console -->
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useSessionStore } from '@/stores/session'

const props = defineProps({
  postCid: {
    type: String,
    required: true,
  },
  likeUri: {
    type: String,
  },
  repostUri: {
    type: String,
  },
  postUri: {
    type: String,
    required: true,
  },
})

const emits = defineEmits(['likeToggled', 'repostToggled'])

const sessionStore = useSessionStore()
const nuxtApp = useNuxtApp()
const bskyAgent = nuxtApp.$bskyAgent

const localLikeUri = ref<string | null | undefined>(props.likeUri)
const localRepostUri = ref<string | null | undefined>(props.repostUri || null)
const isLiked = ref(!!props.likeUri)
const isReposted = ref(!!props.repostUri)

watchEffect(() => {
  if (sessionStore.isSessionLoaded)
    bskyAgent.resumeSession(sessionStore.session)
})

async function toggleLike() {
  if (!sessionStore.session)
    return

  if (isLiked.value && localLikeUri.value) {
    await bskyAgent.deleteLike(localLikeUri.value)
    console.log('Successfully deleted like.')
    localLikeUri.value = null
    isLiked.value = false
    emits('likeToggled', null)
  }
  else {
    const response = await bskyAgent.like(props.postUri, props.postCid)
    if (response && response.uri) {
      console.log('Successfully liked post.')
      localLikeUri.value = response.uri
      emits('likeToggled', response.uri)
      isLiked.value = true
    }
    else {
      console.error('Failed to retrieve the likeUri from the response.')
      emits('likeToggled', null)
    }
  }
}

async function toggleRepost() {
  if (!sessionStore.session)
    return

  if (isReposted.value && localRepostUri.value) {
    await bskyAgent.deleteRepost(localRepostUri.value)
    console.log('Successfully deleted repost.')
    localRepostUri.value = null
    isReposted.value = false
    emits('repostToggled', null)
  }
  else {
    const response = await bskyAgent.repost(props.postUri, props.postCid)
    if (response && response.uri) {
      console.log('Successfully reposted post.')
      localRepostUri.value = response.uri
      emits('repostToggled', response.uri)
      isReposted.value = true
    }
    else {
      console.error('Repost response does not contain the expected structure.')
      emits('repostToggled', null)
    }
  }
}
</script>

<template>
  <div class="flex items-center justify-end space-x-4 mt-4">
    <div :class="{ 'text-gray-500': !isReposted, 'text-green-500': isReposted }" @click="toggleRepost">
      <div class="i-carbon-repeat text-2xl" />
    </div>
    <div :class="{ 'text-gray-500': !isLiked, 'text-red-500': isLiked }" @click="toggleLike">
      <div v-if="isLiked" class="i-carbon-favorite-filled text-2xl" />
      <div v-else class="i-carbon-favorite text-2xl" />
    </div>
  </div>
</template>
