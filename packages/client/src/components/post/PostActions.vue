<script setup lang="ts">
import type { BskyAgent } from '@atproto/api'

const props = defineProps({
  postUri: {
    type: String,
    required: true,
  },
  postCid: {
    type: String,
    required: true,
  },
  agent: {
    type: Object as () => BskyAgent,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  post: {
    type: Object,
    required: true,
  },
})

const sessionData = localStorage.getItem('session')
const isLiked = ref(false)

async function fetchLikedState() {
  try {
    if (!sessionData) {
      console.error('Session data not found in localStorage')
      return
    }
    const session = JSON.parse(sessionData)
    const agent = props.agent as BskyAgent

    let allLikes: any[] = []
    let cursor: string | undefined
    const currentUserDid = session.did

    while (true) {
      const response = await agent.getLikes({
        uri: props.postUri,
        cid: props.postCid,
        limit: 100,
        cursor,
      })

      const likes = response?.data?.likes
      if (!likes)
        break

      allLikes = allLikes.concat(likes)
      cursor = response.data?.cursor

      if (!cursor)
        break
    }

    isLiked.value = allLikes.some((like: { actor: { did: any } }) => like.actor.did === currentUserDid) || false
  }
  catch (error) {
    console.error('Error fetching liked state:', error)
  }
}

async function likePost() {
  try {
    if (sessionData)
      await props.agent.resumeSession(JSON.parse(sessionData))

    await props.agent.like(props.postUri, props.postCid)
    // eslint-disable-next-line no-console
    console.log('Post liked successfully')
    isLiked.value = !isLiked.value
  }
  catch (error) {
    console.error('Error liking post:', error)
  }
}

async function repostPost() {
  try {
    if (sessionData)
      await props.agent.resumeSession(JSON.parse(sessionData))

    await props.agent.repost(props.postUri, props.postCid)
    // eslint-disable-next-line no-console
    console.log('Post reposted successfully')
  }
  catch (error) {
    console.error('Error reposting post:', error)
  }
}

onMounted(async () => {
  if (sessionData) {
    await props.agent.resumeSession(JSON.parse(sessionData))
    fetchLikedState()
  }
  else { console.error('Session data not found in localStorage') }
})
</script>

<template>
  <div class="flex justify-end">
    <button aria-label="Repost Post" class="btn btn-primary bg-transparent hover:bg-transparent hover-transparent text-black border-none" @click="repostPost">
      <div class="i-carbon-repeat text-xl" />
    </button>
    <button
      aria-label="Like Post" class="btn btn-primary bg-transparent hover:bg-transparent text-black border-none"
      @click="likePost"
    >
      <div v-if="isLiked" class="i-carbon-favorite-filled text-red-600 text-xl" />
      <div v-else class="i-carbon-favorite text-xl" />
    </button>
  </div>
</template>
